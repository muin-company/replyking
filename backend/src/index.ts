import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { initDatabase } from './db/schema';
import { InstagramService } from './services/instagram.service';
import { AIService } from './services/ai.service';
import { CommentProcessorService } from './services/comment-processor.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = initDatabase();
console.log('✅ Database initialized');

// Initialize services
const instagramService = new InstagramService();
const aiService = new AIService(
  process.env.AI_API_KEY || '',
  process.env.USE_DEEPSEEK === 'true'
);
const commentProcessor = new CommentProcessorService(db, instagramService, aiService);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Connect Instagram account
app.post('/api/accounts/connect', async (req, res) => {
  try {
    const { accessToken, userId } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    // Get Instagram profile
    const profile = await instagramService.getUserProfile(accessToken);

    // Check if account already exists
    const existing = db.prepare('SELECT id FROM instagram_accounts WHERE user_id = ?').get(userId);
    
    if (existing) {
      // Update existing account
      db.prepare(`
        UPDATE instagram_accounts 
        SET access_token = ?, username = ?, is_active = 1, updated_at = strftime('%s', 'now')
        WHERE user_id = ?
      `).run(accessToken, profile.username, userId);
      
      res.json({ message: 'Account updated', accountId: (existing as any).id });
    } else {
      // Insert new account
      const result = db.prepare(`
        INSERT INTO instagram_accounts (user_id, username, access_token)
        VALUES (?, ?, ?)
      `).run(userId, profile.username, accessToken);

      res.json({ message: 'Account connected', accountId: result.lastInsertRowid });
    }
  } catch (error: any) {
    console.error('Error connecting account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all accounts
app.get('/api/accounts', (req, res) => {
  try {
    const accounts = db.prepare(`
      SELECT id, user_id, username, is_active, created_at
      FROM instagram_accounts
      ORDER BY created_at DESC
    `).all();

    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Process comments for an account
app.post('/api/accounts/:id/process', async (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const newCommentsCount = await commentProcessor.processNewComments(accountId);

    res.json({ 
      message: 'Comments processed successfully',
      newCommentsCount 
    });
  } catch (error: any) {
    console.error('Error processing comments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get comments for an account
app.get('/api/accounts/:id/comments', (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 50;

    const comments = db.prepare(`
      SELECT c.*, r.reply_text, r.status as reply_status
      FROM comments c
      LEFT JOIN replies r ON c.id = r.comment_id
      WHERE c.instagram_account_id = ?
      ORDER BY c.timestamp DESC
      LIMIT ?
    `).all(accountId, limit);

    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending replies
app.get('/api/accounts/:id/pending-replies', async (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const replies = await commentProcessor.getPendingReplies(accountId);

    res.json(replies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve and post reply
app.post('/api/replies/:id/approve', async (req, res) => {
  try {
    const replyId = parseInt(req.params.id);
    await commentProcessor.markReplyPosted(replyId);

    res.json({ message: 'Reply approved and marked as posted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
app.get('/api/accounts/:id/analytics', async (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const days = parseInt(req.query.days as string) || 7;

    const analytics = await commentProcessor.getAnalytics(accountId, days);

    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add template
app.post('/api/accounts/:id/templates', (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const { category, template } = req.body;

    const result = db.prepare(`
      INSERT INTO templates (instagram_account_id, category, template)
      VALUES (?, ?, ?)
    `).run(accountId, category, template);

    res.json({ message: 'Template added', templateId: result.lastInsertRowid });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get templates
app.get('/api/accounts/:id/templates', (req, res) => {
  try {
    const accountId = parseInt(req.params.id);

    const templates = db.prepare(`
      SELECT * FROM templates
      WHERE instagram_account_id = ?
      ORDER BY category, created_at DESC
    `).all(accountId);

    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cron job: Process comments every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('🔄 Running scheduled comment processing...');
  
  const accounts = db.prepare('SELECT id FROM instagram_accounts WHERE is_active = 1').all() as any[];
  
  for (const account of accounts) {
    try {
      const count = await commentProcessor.processNewComments(account.id);
      if (count > 0) {
        console.log(`✅ Processed ${count} new comments for account ${account.id}`);
      }
    } catch (error: any) {
      console.error(`❌ Error processing account ${account.id}:`, error.message);
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ReplyKingAI Backend running on http://localhost:${PORT}`);
  console.log(`📊 Database location: ${__dirname}/../data/replyking.db`);
});
