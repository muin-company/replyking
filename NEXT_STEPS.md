# 🚀 ReplyKingAI - Next Steps

**Document Created**: 2026-02-07  
**Project Status**: MVP Complete - Ready for Beta Testing  
**Location**: `~/muin/replyking/`

---

## 1. 📊 Current Status

### ✅ What's Built

#### Backend (Node.js + TypeScript)
- ✅ **Express REST API** with comprehensive endpoints
- ✅ **SQLite Database** with 5 tables (accounts, comments, replies, templates, analytics)
- ✅ **Instagram Basic Display API Integration**
  - OAuth token management
  - Comment fetching from recent posts
  - User profile retrieval
- ✅ **AI Service** (DeepSeek/OpenAI)
  - Sentiment analysis (positive/neutral/negative with 0-1 score)
  - Category classification (질문/칭찬/불만/구매문의/일반대화)
  - Contextual Korean reply generation with emojis
  - Template-based reply enhancement
- ✅ **Comment Processor Service**
  - Automated cron job (every 5 minutes)
  - Duplicate detection
  - Batch comment analysis
  - Reply queue management
- ✅ **Response Template System**
  - Category-based templates
  - Usage tracking
  - AI-enhanced template application
- ✅ **Analytics Engine**
  - Daily aggregation
  - Sentiment distribution
  - Response rate tracking

#### Frontend (Next.js 14 + TypeScript + Tailwind)
- ✅ **Landing Page**
  - Hero section with CTA
  - Feature showcase
  - Social proof (stats)
- ✅ **Pricing Page**
  - Free trial (30 days)
  - Pro plan (₩19,900/month)
  - Feature comparison
- ✅ **Dashboard**
  - Multi-account selector
  - Real-time comment feed with sentiment indicators
  - Pending reply approval system
  - 7-day analytics overview
  - Template management UI
  - Manual "Check Comments" trigger

### ✅ What's Working

1. **Core Flow**
   - Instagram → Fetch Comments → AI Analysis → Generate Reply → Human Approval → *(Manual Post)*
2. **Comment Detection**
   - Polls last 5 posts every 5 minutes
   - Duplicate prevention via comment_id
3. **AI Processing**
   - Accurate Korean sentiment analysis
   - Context-aware reply generation
   - Template integration
4. **User Experience**
   - Clean, intuitive dashboard
   - Real-time stats
   - Easy account management

### ❌ What's Missing

#### Critical Gaps

1. **Instagram Graph API Integration** 🔴
   - Current: Instagram Basic Display API (read-only)
   - Problem: Cannot post replies automatically
   - Workaround: Manual copy-paste from dashboard
   - Solution: Migrate to Instagram Graph API for Business accounts

2. **Token Refresh Mechanism** 🔴
   - Current: Tokens expire after 60 days
   - Problem: App breaks silently when token expires
   - Solution: Implement auto-refresh or user notification

3. **Actual Reply Posting** 🔴
   - Current: `approveReply()` only marks as "posted" in DB
   - Problem: User must manually copy-paste to Instagram
   - Solution: Integrate Graph API's `POST /{comment-id}/replies`

#### Important Features

4. **Batch Processing**
   - Process multiple accounts in parallel
   - Queue system for high-volume accounts

5. **Rate Limiting**
   - Instagram API: 200 req/hour
   - Need exponential backoff and queue management

6. **Error Handling**
   - Retry logic for API failures
   - User notifications for errors
   - Logging system

7. **Real-time Updates**
   - WebSocket or SSE for live comment feed
   - Instagram webhooks (requires Facebook approval)

8. **Mobile Responsiveness**
   - Dashboard needs mobile optimization
   - Consider React Native app

#### Nice-to-Have

9. **Testing**
   - Unit tests for services
   - Integration tests for API endpoints
   - E2E tests for critical flows

10. **Documentation**
    - API documentation (Swagger/OpenAPI)
    - User guide
    - Video tutorials

---

## 2. 🎯 Phase 2 Features (Next Sprint)

**Timeline**: 2-3 weeks  
**Goal**: Production-ready MVP with automated posting

### P0 - Critical (Must Have)

#### 2.1 Instagram Graph API Integration 🚨

**Problem**: Current Basic Display API cannot post comments.

**Solution**:
1. **Setup Facebook Business App**
   - Migrate from Basic Display to Graph API
   - Request `instagram_manage_comments` permission
   - Submit for Facebook review (7-14 days)

2. **Update InstagramService**
   ```typescript
   // backend/src/services/instagram.service.ts
   
   async postReply(accessToken: string, commentId: string, message: string) {
     const response = await axios.post(
       `${this.baseUrl}/${commentId}/replies`,
       { message },
       { params: { access_token: accessToken } }
     );
     return response.data;
   }
   ```

3. **Update Comment Processor**
   ```typescript
   // Auto-post approved replies
   async approveAndPostReply(replyId: number) {
     const reply = this.getReply(replyId);
     const account = this.getAccount(reply.instagram_account_id);
     
     // Post to Instagram
     await this.instagramService.postReply(
       account.access_token,
       reply.instagram_comment_id,
       reply.reply_text
     );
     
     // Mark as posted
     this.markReplyPosted(replyId);
   }
   ```

4. **Add Toggle for Auto-Post**
   - User can choose: "Auto-post approved replies" or "Review first"
   - Default: Review first (safer)

**Files to Modify**:
- `backend/src/services/instagram.service.ts`
- `backend/src/services/comment-processor.service.ts`
- `backend/src/index.ts` (API endpoint)
- `frontend/app/dashboard/page.tsx` (UI toggle)

**Testing**:
- Use Instagram test user accounts
- Verify reply appears on actual post

---

#### 2.2 Auto-Refresh Token Handling 🔄

**Problem**: Instagram tokens expire after 60 days.

**Solution**:

1. **Add Token Expiry Tracking**
   ```typescript
   // Already in schema: token_expires_at INTEGER
   
   // When connecting account:
   const expiresAt = Date.now() / 1000 + (60 * 24 * 60 * 60); // 60 days
   db.prepare('UPDATE instagram_accounts SET token_expires_at = ? WHERE id = ?')
     .run(expiresAt, accountId);
   ```

2. **Daily Refresh Job**
   ```typescript
   // backend/src/services/token-refresh.service.ts
   
   cron.schedule('0 0 * * *', async () => {
     // Get accounts expiring in < 7 days
     const accounts = db.prepare(`
       SELECT * FROM instagram_accounts 
       WHERE token_expires_at < ? AND is_active = 1
     `).all(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60);
     
     for (const account of accounts) {
       try {
         const newToken = await instagramService.refreshToken(account.access_token);
         // Update token and expiry
       } catch (error) {
         // Notify user: "Please reconnect your Instagram account"
       }
     }
   });
   ```

3. **User Notification**
   - Email/push notification 7 days before expiry
   - Dashboard warning banner
   - One-click reconnect button

**Files to Create**:
- `backend/src/services/token-refresh.service.ts`
- `backend/src/services/notification.service.ts`

**Files to Modify**:
- `backend/src/index.ts` (initialize refresh job)
- `frontend/app/dashboard/page.tsx` (expiry warning UI)

---

#### 2.3 Batch Reply Processing ⚡

**Problem**: Processing one comment at a time is slow for high-volume accounts.

**Solution**:

1. **Parallel Processing**
   ```typescript
   async processNewComments(accountId: number): Promise<number> {
     const comments = await this.instagramService.getAllRecentComments(token);
     
     // Process in batches of 10
     const batches = chunk(comments, 10);
     let totalNew = 0;
     
     for (const batch of batches) {
       const results = await Promise.all(
         batch.map(comment => this.processComment(comment, accountId))
       );
       totalNew += results.filter(Boolean).length;
     }
     
     return totalNew;
   }
   ```

2. **Queue System (Optional, for scale)**
   - Use BullMQ or Agenda for job queue
   - Prevents rate limit issues
   - Better error recovery

**Files to Modify**:
- `backend/src/services/comment-processor.service.ts`

**Performance Target**:
- Process 100 comments in < 30 seconds

---

#### 2.4 Sentiment Analytics Dashboard 📈

**Goal**: Give users actionable insights.

**Features**:

1. **Enhanced Analytics Page**
   ```typescript
   // New endpoint
   GET /api/accounts/:id/analytics/detailed?start=2026-01-01&end=2026-02-01
   
   // Returns:
   {
     "overview": {
       "totalComments": 1234,
       "avgSentiment": 0.75,
       "responseRate": 0.89,
       "avgResponseTime": 342  // seconds
     },
     "sentimentTrend": [
       { "date": "2026-01-01", "positive": 45, "neutral": 20, "negative": 5 },
       // ...
     ],
     "categoryBreakdown": {
       "질문": 123,
       "칭찬": 456,
       "구매문의": 78
     },
     "topPosts": [
       { "postId": "abc123", "comments": 89, "avgSentiment": 0.92 }
     ]
   }
   ```

2. **Dashboard Visualizations**
   - Line chart: Sentiment trend over time
   - Pie chart: Category distribution
   - Heatmap: Best times to post
   - Table: Top performing posts

**Libraries**:
- Recharts (simple, React-friendly)
- Chart.js (more features)

**Files to Create**:
- `frontend/app/analytics/page.tsx`
- `frontend/components/charts/SentimentChart.tsx`

**Files to Modify**:
- `backend/src/services/comment-processor.service.ts` (detailed analytics queries)
- `backend/src/index.ts` (new endpoint)

---

### P1 - Important (Should Have)

#### 2.5 Additional Features

- **Manual Reply Editing**: Allow users to modify AI-generated replies before posting
- **Reply History**: Show all posted replies with timestamp
- **Account Health Check**: Display token expiry, API quota usage
- **Notification System**: Email/SMS alerts for negative comments
- **Bulk Actions**: Approve/reject multiple replies at once
- **Custom AI Instructions**: Per-account tone customization

---

## 3. 🔮 Phase 3 Features (Future)

**Timeline**: Q3-Q4 2026  
**Goal**: Multi-platform enterprise solution

### 3.1 Multi-Platform Support

#### YouTube Comments
- YouTube Data API v3
- Reply to video and Shorts comments
- Same AI analysis pipeline
- Unified dashboard

**Effort**: 2-3 weeks (similar to Instagram)

#### TikTok Comments
- TikTok Display API (limited availability)
- Alternative: Web scraping (risky, against ToS)
- Consider official TikTok Creator Marketplace partnership

**Effort**: 3-4 weeks (API approval + integration)

#### X (Twitter) Mentions
- Twitter API v2
- Reply to @mentions and DMs
- Real-time streaming API

**Effort**: 1-2 weeks

### 3.2 Team Collaboration

**Features**:
- Role-based access control (Owner, Manager, Agent)
- Assign comments to team members
- Internal notes on comments
- Approval workflows (2-tier approval)
- Activity logs (who approved what)

**DB Changes**:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT,  -- owner, manager, agent
  instagram_account_id INTEGER
);

CREATE TABLE comment_assignments (
  id INTEGER PRIMARY KEY,
  comment_id INTEGER,
  assigned_to INTEGER,
  status TEXT  -- pending, in_review, approved
);
```

**Effort**: 4-5 weeks

### 3.3 Custom AI Training

**Goal**: Brand-specific AI models

**Approach 1: Fine-tuning**
- Collect user's past replies
- Fine-tune GPT-3.5 or Claude
- Cost: $$$ per account

**Approach 2: Few-shot Learning**
- Store user's "approved edits" as examples
- Include top 5 similar past replies in prompt
- Cost: $ (just longer prompts)

**Approach 3: RAG (Retrieval-Augmented Generation)**
- Vector DB (Pinecone, Weaviate)
- Embed all past replies
- Retrieve relevant context for each comment

**Recommended**: Start with Approach 2 (quick wins), upgrade to 3 if needed.

**Effort**: 2-3 weeks

### 3.4 Advanced Analytics

- **ROI Tracking**: Link comments to sales (e.g., promo codes)
- **A/B Testing**: Test different reply styles
- **Competitor Analysis**: Monitor competitor's comment sentiment
- **Influencer Insights**: Identify engaged users, potential brand ambassadors

**Effort**: 3-4 weeks

---

## 4. 🛠 Technical Debt

### Quick Fixes (< 1 day each)

1. **Error Handling** 🔴
   - Add try-catch in all API routes
   - Return consistent error format: `{ error: string, code: number }`
   - Log errors to file/service (Winston, Sentry)

2. **Environment Validation** 🟡
   - Check required env vars on startup
   - Fail fast with clear error if missing

3. **API Rate Limit Tracking** 🟡
   - Log Instagram API usage
   - Warn user at 80% quota
   - Queue requests when near limit

4. **Comment Deduplication** 🟢
   - Already using `comment_id`, but no index
   - Add unique constraint: `CREATE UNIQUE INDEX idx_comment_id ON comments(comment_id)`

5. **Timestamps** 🟢
   - Inconsistent: some `created_at` in Unix seconds, some missing
   - Standardize all to Unix timestamps

6. **SQL Injection Risk** 🔴
   - Already using prepared statements (✅ good!)
   - Audit all `.prepare()` calls for safety

### Code Quality Improvements (1-2 days)

7. **TypeScript Strictness**
   - Enable `"strict": true` in tsconfig
   - Fix `any` types (currently ~20 instances)

8. **Logging**
   - Replace `console.log` with Winston logger
   - Add log levels: debug, info, warn, error
   - Log rotation

9. **Configuration Management**
   - Move hardcoded values to config file
   - `config/default.ts`, `config/production.ts`

10. **Service Layer**
    - Extract DB queries from index.ts
    - Create `repositories/` for data access

### Testing (2-3 days)

11. **Unit Tests**
    - Test AI service sentiment analysis
    - Test comment processor logic
    - Coverage target: 70%

12. **Integration Tests**
    - Test API endpoints
    - Mock Instagram service

13. **E2E Tests**
    - Playwright/Cypress for dashboard flows

### Performance (1-2 days)

14. **Database Optimization**
    - Add indexes for common queries
    - `CREATE INDEX idx_comments_account_time ON comments(instagram_account_id, timestamp)`

15. **Caching**
    - Cache Instagram profile data (1 hour)
    - Cache analytics (5 minutes)
    - Use Redis or in-memory cache

16. **API Response Time**
    - Current: ~2-3s for comment processing
    - Target: < 1s
    - Solution: Batch AI calls, cache templates

---

## 5. 🚀 Deployment Plan

### Current State
- ❌ Not deployed
- ⏸️ GitHub repo created: `muin-company/replyking`
- ✅ Code ready for deployment

### Step-by-Step Deployment

#### Phase 1: Development → Staging (This Week)

##### Backend: Railway (Recommended)

**Why Railway?**
- Easy SQLite support (persistent volume)
- Automatic HTTPS
- Simple env var management
- $5/month (Hobby plan)

**Alternative: Render**
- Free tier available
- SQLite on disk (persistent)
- Automatic deploys from GitHub

**Deployment Steps**:

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login and deploy
   cd ~/muin/replyking/backend
   railway login
   railway init
   railway up
   ```

2. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   USE_DEEPSEEK=true
   AI_API_KEY=sk-xxxxxx
   DATABASE_PATH=/app/data/replyking.db
   ```

3. **Add Persistent Volume**
   - Railway: Create volume mounted at `/app/data`
   - Ensures SQLite DB survives restarts

4. **Configure Cron**
   - Verify cron jobs work in production
   - Monitor logs for scheduled runs

**Result**: Backend API at `https://replyking-backend.up.railway.app`

---

##### Frontend: Vercel (Recommended)

**Why Vercel?**
- Built for Next.js (zero config)
- Global CDN (fast worldwide)
- Free tier generous (100GB bandwidth)
- Automatic SSL

**Alternative: Netlify**
- Similar to Vercel
- Slightly slower builds

**Deployment Steps**:

1. **Connect GitHub Repo**
   ```bash
   cd ~/muin/replyking/frontend
   vercel
   # Select: Link to existing project? No
   # Framework: Next.js (auto-detected)
   # Build: npm run build
   ```

2. **Set Environment Variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   ```
   NEXT_PUBLIC_API_URL=https://replyking-backend.up.railway.app/api
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

**Result**: Frontend at `https://replyking.vercel.app`

---

##### Database: SQLite vs PostgreSQL?

**Current**: SQLite (simple, file-based)

**Keep SQLite if**:
- < 10 active accounts
- < 1000 comments/day
- Single-server deployment

**Migrate to PostgreSQL if**:
- > 50 accounts
- High concurrency
- Need analytics queries

**PostgreSQL Options**:
- **Supabase** (easiest, generous free tier)
- **Railway** (built-in Postgres)
- **Neon** (serverless Postgres)

**Migration Plan** (if needed):
```bash
# Export SQLite
sqlite3 data/replyking.db .dump > schema.sql

# Import to Postgres
psql $DATABASE_URL < schema.sql

# Update backend/src/db/schema.ts
# Replace better-sqlite3 with pg or Prisma
```

**Recommendation for MVP**: **Stick with SQLite** until you have 20+ paying customers, then migrate.

---

#### Phase 2: Production Launch (Week 2)

##### Monitoring & Observability

1. **Error Tracking: Sentry**
   ```bash
   npm install @sentry/node @sentry/integrations
   ```
   - Catch backend errors
   - Alert on critical issues

2. **Logging: Better Stack (formerly Logtail)**
   - Centralized logs
   - Search and filter
   - Free tier: 1GB/month

3. **Uptime Monitoring: UptimeRobot**
   - Ping backend every 5 minutes
   - Email alert if down
   - Free for 50 monitors

4. **Analytics: PostHog**
   - User behavior tracking
   - Feature usage
   - Self-hosted or cloud

##### Security

1. **API Authentication**
   - Currently: None! 🚨
   - Add JWT or session tokens
   - Protect all `/api/*` routes

2. **Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 min
     max: 100 // 100 requests per IP
   });
   
   app.use('/api', limiter);
   ```

3. **CORS Configuration**
   - Currently: Allows all origins
   - Restrict to: `https://replyking.vercel.app`

4. **Environment Secrets**
   - Never commit `.env` files
   - Use Railway/Vercel secret management
   - Rotate API keys quarterly

##### Scaling Checklist

- [ ] Database backups (daily)
- [ ] Redis cache for hot data
- [ ] CDN for static assets
- [ ] Load balancer (if > 1000 users)
- [ ] Horizontal scaling (multiple backend instances)

---

#### Phase 3: Domain & Branding (Week 3)

1. **Custom Domain**
   - Buy: `replyking.ai` or `댓글왕.com`
   - Configure DNS:
     - `www.replyking.ai` → Vercel (frontend)
     - `api.replyking.ai` → Railway (backend)

2. **SSL Certificates**
   - Automatic via Vercel + Railway
   - Verify HTTPS works

3. **Email Setup**
   - Domain email: `support@replyking.ai`
   - Transactional emails: SendGrid or Resend
   - Notification templates

---

### Cost Estimate (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| **Railway** (Backend) | Hobby | $5 |
| **Vercel** (Frontend) | Hobby | $0 (free tier) |
| **SQLite** (DB) | - | $0 |
| **DeepSeek API** | Pay-as-you-go | ~$2 (100k tokens) |
| **Domain** | .ai TLD | ~$1 (annual / 12) |
| **Monitoring** | Free tiers | $0 |
| **Email** | SendGrid Free | $0 (100 emails/day) |
| **Total** | | **~$8/month** |

**Revenue Needed to Break Even**: 1 customer at ₩19,900/month (~$15) 🎉

---

## 6. 📋 Action Items (Priority Order)

### Week 1: Phase 2 Critical Features
- [ ] **Day 1-2**: Instagram Graph API integration (2.1)
- [ ] **Day 3**: Auto-refresh token handling (2.2)
- [ ] **Day 4**: Batch reply processing (2.3)
- [ ] **Day 5**: Deploy to Railway + Vercel (Section 5)
- [ ] **Day 6**: Sentiment analytics dashboard (2.4)
- [ ] **Day 7**: Testing + bug fixes

### Week 2: Technical Debt & Polish
- [ ] Error handling and logging (4.1, 4.8)
- [ ] API authentication (5.2)
- [ ] Rate limiting (4.3, 5.2)
- [ ] Unit tests (4.11)
- [ ] Custom domain setup (5.3)

### Week 3: Beta Launch
- [ ] Recruit 10-20 beta testers
- [ ] Onboarding flow optimization
- [ ] Support system (email, chat)
- [ ] Documentation + video tutorials
- [ ] Marketing landing page

### Week 4: Iteration
- [ ] Analyze beta feedback
- [ ] Fix critical bugs
- [ ] Add most-requested features
- [ ] Prepare for paid launch

---

## 7. 🎯 Success Metrics

### Technical KPIs
- ✅ **Uptime**: > 99.5%
- ✅ **API Response Time**: < 1s (p95)
- ✅ **Comment Processing**: < 10 min from Instagram post to AI reply
- ✅ **Error Rate**: < 1%

### Business KPIs
- 🎯 **Beta Signups**: 50 accounts in first month
- 🎯 **Activation Rate**: 70% (connect IG account + generate 1 reply)
- 🎯 **Free → Paid Conversion**: 5% after 30-day trial
- 🎯 **MRR**: ₩1M within 3 months

### User Satisfaction
- 📊 **NPS Score**: > 40
- 📊 **Reply Approval Rate**: > 80% (users approve AI replies as-is)
- 📊 **Daily Active Users**: 30% of signups

---

## 8. 📚 Resources

### Documentation to Create
1. **API Documentation** (Swagger/Postman)
2. **User Guide** (How to connect Instagram, approve replies, etc.)
3. **Instagram API Setup Tutorial** (Step-by-step with screenshots)
4. **Troubleshooting Guide** (Common errors + solutions)
5. **Video Walkthrough** (5-min demo on YouTube)

### Tools & Services to Sign Up
- [ ] DeepSeek API key: https://platform.deepseek.com/
- [ ] Instagram Graph API: https://developers.facebook.com/
- [ ] Railway account: https://railway.app/
- [ ] Vercel account: https://vercel.com/
- [ ] Sentry account: https://sentry.io/
- [ ] UptimeRobot account: https://uptimerobot.com/

### Learning Resources
- Instagram Graph API Docs: https://developers.facebook.com/docs/instagram-api/
- Next.js Deployment: https://nextjs.org/docs/deployment
- Railway Docs: https://docs.railway.app/

---

## 9. ⚠️ Risks & Mitigation

### Risk 1: Instagram API Rejection 🔴
**Problem**: Facebook may reject Graph API request  
**Likelihood**: Medium  
**Impact**: High (blocks auto-posting)  
**Mitigation**:
- Submit detailed use case in app review
- Show user consent and privacy policy
- Have manual mode as fallback
- Consider official Instagram partner program

### Risk 2: AI Costs Spiral 🟡
**Problem**: DeepSeek costs > revenue  
**Likelihood**: Low (DeepSeek is very cheap)  
**Impact**: Medium  
**Mitigation**:
- Set usage quotas per plan (e.g., 100 comments/month for free)
- Cache AI results for similar comments
- Offer bring-your-own-API-key option

### Risk 3: Scaling Beyond SQLite 🟡
**Problem**: DB can't handle > 1000 comments/min  
**Likelihood**: Low (not in Phase 1-2)  
**Impact**: High  
**Mitigation**:
- Monitor DB performance
- Plan Postgres migration early
- Design schema to be DB-agnostic

### Risk 4: Competition 🟢
**Problem**: Larger player launches similar service  
**Likelihood**: Medium  
**Impact**: Medium  
**Mitigation**:
- Focus on Korean market (language advantage)
- Build strong brand and community
- Faster iteration and customer support

---

## 10. 💡 Quick Wins (Do First)

These are high-impact, low-effort tasks:

1. **Fix Token Expiry Warning** (2 hours)
   - Add check: If `token_expires_at < 7 days`, show banner
   - Prevents silent failures

2. **Add Error Messages to Dashboard** (1 hour)
   - Currently: Errors only in console
   - Show user-friendly error toast notifications

3. **Improve Comment Processor Logging** (1 hour)
   - Log: "Processed X comments, Y new, Z duplicates"
   - Helps debug issues

4. **Add Health Check Endpoint** (30 min)
   - Already exists at `/api/health`
   - Add: DB connection check, Instagram API test

5. **Create .env.example** (15 min)
   - Document all required env vars
   - Makes setup easier for new devs

6. **Add Loading States** (1 hour)
   - Dashboard: Show spinner when fetching data
   - Better UX

---

## 11. 🚧 Blockers & Dependencies

### External Dependencies
1. **Instagram Graph API Approval**
   - Timeline: 7-14 days
   - Required for: Auto-posting
   - Blocker for: Phase 2 production launch

2. **Instagram Business Account Required**
   - Users must convert personal → business
   - May deter some users
   - Solution: Clear onboarding guide

3. **DeepSeek API Access**
   - Currently available
   - If quota exceeded, fallback to OpenAI

### Internal Dependencies
1. **Authentication System**
   - Blocks multi-user features
   - Currently no login (just account IDs)
   - Need JWT + user DB

2. **Payment Integration**
   - Blocks paid plan
   - Options: Stripe, Paddle, KG Inicis (Korean)

---

## 12. 🎉 Long-Term Vision

**6 Months**: Market leader in Korean Instagram automation (500+ customers)  
**1 Year**: Multi-platform (YouTube, TikTok), enterprise clients (agencies)  
**2 Years**: Raise Series A, expand to Japan/SEA markets  
**3 Years**: Exit via acquisition or IPO? 🚀

---

## ✅ Ready to Ship

The MVP is **feature-complete** and ready for beta testing. The main gap is Instagram Graph API integration, which is a 2-day task once approved.

**Recommended Next Steps**:
1. Deploy to Railway + Vercel (today)
2. Apply for Instagram Graph API access (today)
3. Recruit 5 beta testers (this week)
4. Build Phase 2 features (next 2 weeks)
5. Launch paid beta (Week 4)

**Let's ship it! 🚀**

---

*Document maintained by: MUIN Company*  
*Last updated: 2026-02-07*  
*Questions? contact@muin.company*
