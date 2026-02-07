# 📊 ReplyKingAI - Project Summary

## 🎯 Project Overview

**Name**: 댓글왕AI (ReplyKingAI)
**Purpose**: 24/7 Instagram comment automation with AI-powered responses
**Target Market**: Korean social commerce sellers & influencers
**Pricing**: ₩19,900/month (30-day free trial)
**Estimated ARR**: ₩11.5억 (at 5% conversion of 50k target market)

## ✅ What's Been Built

### Backend (Node.js + TypeScript)
- ✅ Express REST API server
- ✅ SQLite database with comprehensive schema
- ✅ Instagram Basic Display API integration
- ✅ AI service (DeepSeek/OpenAI) for:
  - Sentiment analysis (positive/neutral/negative)
  - Category classification (질문/칭찬/불만/구매문의/일반대화)
  - Contextual reply generation in Korean
- ✅ Comment processor service:
  - Auto-fetches new comments every 5 minutes (cron)
  - Analyzes sentiment
  - Generates AI replies
  - Stores in database for approval
- ✅ Response templates system
- ✅ Analytics tracking

### Frontend (Next.js 14 + Tailwind CSS)
- ✅ Landing page with hero section, features, stats
- ✅ Pricing page with free trial and pro plan
- ✅ Dashboard with:
  - Account management
  - Real-time comment feed with sentiment indicators
  - Pending replies approval system
  - Analytics overview (7-day stats)
  - Template management
  - Manual "Check Comments" trigger

### Features Implemented
1. **Instagram Integration**: Connect via OAuth access token
2. **Auto Comment Detection**: Polls Instagram API every 5 minutes
3. **AI Sentiment Analysis**: Categorizes emotions and intent
4. **Smart Reply Generation**: Context-aware Korean responses with emojis
5. **Template System**: Create reusable response templates by category
6. **Approval Workflow**: Review AI-generated replies before posting
7. **Analytics Dashboard**: Track comments, replies, sentiment distribution
8. **Multi-Account Support**: Manage up to 3 Instagram accounts (Pro plan)

## 📁 Project Structure

```
~/muin/replyking/
├── backend/
│   ├── src/
│   │   ├── db/schema.ts              # Database schema & initialization
│   │   ├── services/
│   │   │   ├── instagram.service.ts  # Instagram API client
│   │   │   ├── ai.service.ts         # AI reply generation
│   │   │   └── comment-processor.service.ts  # Main processing logic
│   │   └── index.ts                  # Express server + API routes
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── pricing/page.tsx          # Pricing page
│   │   └── dashboard/page.tsx        # Main dashboard
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.ts
├── docs/
│   └── SETUP.md                      # Detailed setup instructions
├── README.md                         # Main documentation
├── DEPLOYMENT.md                     # Deployment guide
├── LICENSE                           # MIT License
└── .gitignore
```

## 🔑 Key API Endpoints

- `POST /api/accounts/connect` - Connect Instagram account
- `GET /api/accounts` - List connected accounts
- `POST /api/accounts/:id/process` - Process new comments
- `GET /api/accounts/:id/comments` - Get comment history
- `GET /api/accounts/:id/pending-replies` - Get replies awaiting approval
- `POST /api/replies/:id/approve` - Approve and mark reply as posted
- `GET /api/accounts/:id/analytics` - Get analytics data
- `POST /api/accounts/:id/templates` - Add response template
- `GET /api/accounts/:id/templates` - List templates

## 🗄️ Database Schema

**Tables:**
1. `instagram_accounts` - Connected Instagram accounts
2. `comments` - All fetched comments with sentiment
3. `replies` - AI-generated responses (pending/posted)
4. `templates` - User-created response templates
5. `analytics` - Daily aggregated statistics

## 🤖 AI Processing Flow

1. **Fetch**: Get new comments from Instagram API
2. **Analyze**: AI determines sentiment + category
3. **Generate**: AI creates contextual Korean reply
   - Uses templates if available for category
   - Otherwise generates from scratch
4. **Store**: Save as "pending" for review
5. **Approve**: User reviews and approves in dashboard
6. **Track**: Update analytics

## 💰 Business Model

### Free Tier (30 days)
- 1 Instagram account
- 100 comments/month
- Basic sentiment analysis
- 5 templates

### Pro Plan (₩19,900/month)
- 3 Instagram accounts
- Unlimited comments
- Advanced sentiment + categorization
- Unlimited templates
- Priority support
- Detailed analytics

### Enterprise
- Custom pricing
- Unlimited accounts
- Dedicated support
- API access

## 🚀 Next Steps to Launch

### 1. GitHub Repository
```bash
# Create repo at github.com/muin-company/replyking
# Then push:
cd ~/muin/replyking
git remote set-url origin https://github.com/muin-company/replyking.git
git add DEPLOYMENT.md PROJECT_SUMMARY.md
git commit -m "Add deployment and project summary docs"
git push -u origin main
```

### 2. Get API Keys
- **DeepSeek**: https://platform.deepseek.com/ (cheaper, recommended)
- **OpenAI**: https://platform.openai.com/ (alternative)
- **Instagram**: https://developers.facebook.com/ (OAuth setup)

### 3. Local Testing
```bash
# Backend
cd ~/muin/replyking/backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev

# Frontend (new terminal)
cd ~/muin/replyking/frontend
npm install
npm run dev
```

### 4. Production Deployment
- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: SQLite works for MVP, consider PostgreSQL for scale

### 5. Marketing
- Target communities: 네이버 카페, 인스타그램 셀러 그룹
- Content: Blog posts about automation, ROI case studies
- SEO: "인스타그램 댓글 자동 응답", "소셜커머스 자동화"

## 🎯 Success Metrics

- **MRR Goal**: ₩20M (1,000 subscribers × ₩19,900)
- **User Acquisition**: Target 50 beta users in first month
- **Conversion Rate**: 2-5% from free trial to paid
- **Churn**: <10% monthly

## 🐛 Known Limitations

1. **Instagram API**: Basic Display API is read-only
   - Can fetch comments but not post replies automatically
   - Current solution: Manual copy-paste from dashboard
   - Future: Instagram Graph API for business accounts (requires approval)

2. **Token Expiration**: Instagram tokens expire after 60 days
   - Need to implement auto-refresh
   - Or prompt users to reconnect

3. **Rate Limits**: 
   - Instagram: 200 requests/hour
   - DeepSeek: Varies by plan
   - Need to implement queue for high-volume accounts

## 🗺️ Roadmap

### Phase 1 (MVP - DONE) ✅
- Instagram Basic Display integration
- AI reply generation
- Web dashboard
- Manual approval workflow

### Phase 2 (Q2 2026)
- TikTok integration
- Automatic posting (Instagram Graph API)
- Mobile app (React Native)
- Webhook-based real-time processing

### Phase 3 (Q3-Q4 2026)
- YouTube Shorts comments
- Multi-language support (English, Japanese)
- Advanced analytics (ROI tracking, A/B testing)
- Team collaboration features

### Phase 4 (2027)
- WhatsApp Business integration
- ChatGPT plugin
- API for third-party integrations
- White-label solution for agencies

## 📞 Support & Resources

- **GitHub**: https://github.com/muin-company/replyking
- **Email**: contact@muin.company
- **Docs**: See README.md and docs/SETUP.md
- **Issues**: Report bugs via GitHub Issues

## 🏆 Competitive Advantage

1. **24/7 Response**: Never miss a comment, even at 3 AM
2. **Korean-First**: Optimized for Korean language and culture
3. **Emotion-Aware**: Not just templates, real sentiment understanding
4. **Affordable**: ₩19,900 vs competitors at ₩50,000+
5. **Easy Setup**: No coding required, 5-minute onboarding

## 💡 Tips for Success

1. **Start Small**: Beta test with 10-20 friendly sellers
2. **Gather Feedback**: Iterate based on real user pain points
3. **Focus on ROI**: Show sellers how much time they save
4. **Build Trust**: Emphasize human review before posting
5. **Expand Gradually**: Perfect Instagram before adding TikTok

---

**Project Status**: ✅ MVP Complete - Ready for Beta Testing
**Built by**: MUIN Company
**Date**: February 7, 2026
**Location**: ~/muin/replyking/
