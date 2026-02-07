import OpenAI from 'openai';

export interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  category?: string;
}

export interface ReplyResult {
  text: string;
  category: string;
}

export class AIService {
  private openai: OpenAI;
  private useDeepSeek: boolean;

  constructor(apiKey: string, useDeepSeek = true) {
    this.useDeepSeek = useDeepSeek;
    
    if (useDeepSeek) {
      // DeepSeek API (cheaper alternative)
      this.openai = new OpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com/v1'
      });
    } else {
      // OpenAI API
      this.openai = new OpenAI({ apiKey });
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.useDeepSeek ? 'deepseek-chat' : 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `당신은 소셜 미디어 댓글 감정 분석 전문가입니다. 댓글의 감정을 분석하고 다음 형식의 JSON으로 응답하세요:
{
  "sentiment": "positive" | "neutral" | "negative",
  "score": 0.0-1.0 (부정적일수록 0에 가깝고, 긍정적일수록 1에 가까움),
  "category": "질문" | "칭찬" | "불만" | "구매문의" | "일반대화" | "기타"
}`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        sentiment: result.sentiment || 'neutral',
        score: result.score || 0.5,
        category: result.category
      };
    } catch (error: any) {
      console.error('Error analyzing sentiment:', error.message);
      return { sentiment: 'neutral', score: 0.5 };
    }
  }

  async generateReply(
    commentText: string,
    sentiment: SentimentResult,
    context?: {
      username?: string;
      postCaption?: string;
      previousComments?: string[];
      templates?: string[];
    }
  ): Promise<ReplyResult> {
    try {
      const systemPrompt = `당신은 한국의 소셜커머스 셀러를 위한 친근하고 전문적인 인스타그램 댓글 답변 어시스턴트입니다.

답변 원칙:
- 친근하고 따뜻한 톤 사용
- 이모지 적절히 활용 (😊, ❤️, 👍 등)
- 짧고 명확하게 (1-2문장)
- 고객의 감정에 공감
- 구매 문의는 적극 안내
- 불만 사항은 정중하게 사과 후 해결 제시

감정: ${sentiment.sentiment}
카테고리: ${sentiment.category || '일반'}
${context?.username ? `사용자명: ${context.username}` : ''}
${context?.postCaption ? `게시물 내용: ${context.postCaption}` : ''}

다음 형식의 JSON으로 응답하세요:
{
  "text": "답변 내용",
  "category": "질문" | "칭찬" | "불만" | "구매문의" | "일반대화" | "기타"
}`;

      const response = await this.openai.chat.completions.create({
        model: this.useDeepSeek ? 'deepseek-chat' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: commentText }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        text: result.text || '댓글 남겨주셔서 감사합니다! 😊',
        category: result.category || sentiment.category || '일반대화'
      };
    } catch (error: any) {
      console.error('Error generating reply:', error.message);
      return {
        text: '댓글 남겨주셔서 감사합니다! 😊',
        category: '기타'
      };
    }
  }

  async generateReplyFromTemplate(
    commentText: string,
    templates: string[],
    sentiment: SentimentResult
  ): Promise<string> {
    if (templates.length === 0) {
      const reply = await this.generateReply(commentText, sentiment);
      return reply.text;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.useDeepSeek ? 'deepseek-chat' : 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `제공된 템플릿을 참고하여 댓글에 맞는 답변을 생성하세요. 템플릿을 그대로 사용하거나 상황에 맞게 수정할 수 있습니다.

템플릿:
${templates.map((t, i) => `${i + 1}. ${t}`).join('\n')}

감정: ${sentiment.sentiment}
카테고리: ${sentiment.category || '일반'}

자연스럽고 친근한 답변을 생성하세요.`
          },
          { role: 'user', content: commentText }
        ],
        temperature: 0.8
      });

      return response.choices[0].message.content || templates[0];
    } catch (error: any) {
      console.error('Error generating reply from template:', error.message);
      return templates[0];
    }
  }
}
