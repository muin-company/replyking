import Database from 'better-sqlite3';
import { InstagramService, InstagramComment } from './instagram.service';
import { AIService, SentimentResult } from './ai.service';

export class CommentProcessorService {
  constructor(
    private db: Database.Database,
    private instagramService: InstagramService,
    private aiService: AIService
  ) {}

  async processNewComments(accountId: number): Promise<number> {
    // Get account details
    const account = this.db.prepare('SELECT * FROM instagram_accounts WHERE id = ? AND is_active = 1').get(accountId) as any;
    
    if (!account) {
      throw new Error('Account not found or inactive');
    }

    // Fetch recent comments from Instagram
    const instagramComments = await this.instagramService.getAllRecentComments(account.access_token);
    
    let newCommentsCount = 0;

    for (const comment of instagramComments) {
      // Check if comment already exists
      const existing = this.db.prepare('SELECT id FROM comments WHERE comment_id = ?').get(comment.id);
      
      if (!existing) {
        // Analyze sentiment
        const sentiment = await this.aiService.analyzeSentiment(comment.text);
        
        // Insert comment
        const insertComment = this.db.prepare(`
          INSERT INTO comments (instagram_account_id, comment_id, post_id, username, text, sentiment, sentiment_score, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const timestamp = new Date(comment.timestamp).getTime() / 1000;
        const result = insertComment.run(
          accountId,
          comment.id,
          'unknown', // We'll need to track this separately
          comment.username,
          comment.text,
          sentiment.sentiment,
          sentiment.score,
          timestamp
        );

        const commentDbId = result.lastInsertRowid as number;

        // Generate reply
        await this.generateReplyForComment(commentDbId, comment, sentiment, accountId);
        
        newCommentsCount++;

        // Update analytics
        this.updateAnalytics(accountId, sentiment);
      }
    }

    return newCommentsCount;
  }

  private async generateReplyForComment(
    commentDbId: number,
    comment: InstagramComment,
    sentiment: SentimentResult,
    accountId: number
  ) {
    // Get templates for this category
    const templates = this.db.prepare(`
      SELECT template FROM templates 
      WHERE instagram_account_id = ? AND category = ? AND is_active = 1
      ORDER BY usage_count ASC
      LIMIT 3
    `).all(accountId, sentiment.category || '일반') as any[];

    let replyText: string;
    let category: string;

    if (templates.length > 0) {
      replyText = await this.aiService.generateReplyFromTemplate(
        comment.text,
        templates.map(t => t.template),
        sentiment
      );
      category = sentiment.category || '일반';
    } else {
      const reply = await this.aiService.generateReply(comment.text, sentiment, {
        username: comment.username
      });
      replyText = reply.text;
      category = reply.category;
    }

    // Insert reply
    this.db.prepare(`
      INSERT INTO replies (comment_id, reply_text, status, category)
      VALUES (?, ?, 'pending', ?)
    `).run(commentDbId, replyText, category);
  }

  private updateAnalytics(accountId: number, sentiment: SentimentResult) {
    const today = new Date().toISOString().split('T')[0];
    
    const sentimentField = `sentiment_${sentiment.sentiment}`;
    
    this.db.prepare(`
      INSERT INTO analytics (instagram_account_id, date, comments_received, ${sentimentField})
      VALUES (?, ?, 1, 1)
      ON CONFLICT(instagram_account_id, date) DO UPDATE SET
        comments_received = comments_received + 1,
        ${sentimentField} = ${sentimentField} + 1
    `).run(accountId, today);
  }

  async getPendingReplies(accountId: number) {
    return this.db.prepare(`
      SELECT r.*, c.username, c.text as comment_text, c.comment_id as instagram_comment_id
      FROM replies r
      JOIN comments c ON r.comment_id = c.id
      WHERE c.instagram_account_id = ? AND r.status = 'pending'
      ORDER BY r.created_at ASC
    `).all(accountId);
  }

  async markReplyPosted(replyId: number) {
    this.db.prepare(`
      UPDATE replies SET status = 'posted', posted_at = strftime('%s', 'now')
      WHERE id = ?
    `).run(replyId);

    // Mark comment as replied
    const reply = this.db.prepare('SELECT comment_id FROM replies WHERE id = ?').get(replyId) as any;
    if (reply) {
      this.db.prepare('UPDATE comments SET is_replied = 1 WHERE id = ?').run(reply.comment_id);
    }
  }

  async getAnalytics(accountId: number, days: number = 7) {
    return this.db.prepare(`
      SELECT * FROM analytics
      WHERE instagram_account_id = ?
      ORDER BY date DESC
      LIMIT ?
    `).all(accountId, days);
  }
}
