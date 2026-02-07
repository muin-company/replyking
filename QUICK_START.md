# ⚡ Quick Start Guide

Get ReplyKingAI running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([download](https://nodejs.org/))
- Instagram account (Business or Creator recommended)
- DeepSeek or OpenAI API key

## 1. Clone & Setup

```bash
git clone https://github.com/muin-company/replyking.git
cd replyking
```

## 2. Get Your API Key

### DeepSeek (Recommended - Cheaper)
1. Visit https://platform.deepseek.com/
2. Sign up & create API key
3. Copy the key

### Or OpenAI
1. Visit https://platform.openai.com/
2. Create API key
3. Copy the key

## 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
AI_API_KEY=your_api_key_here
USE_DEEPSEEK=true
```

## 4. Install & Run

### Option A: Automated (macOS)
```bash
./scripts/dev.sh
```

### Option B: Manual

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 5. Open Dashboard

Visit http://localhost:3000

## 6. Connect Instagram

You'll need an Instagram access token. Two options:

### Quick Test (60-day token)
1. Go to [Instagram Basic Display Settings](https://developers.facebook.com/apps/)
2. Create app → Add Instagram Basic Display
3. Generate test token
4. Paste in dashboard

### Full OAuth (production)
See [docs/SETUP.md](docs/SETUP.md) for complete OAuth flow setup.

## 7. Test It Out

1. Click "댓글 확인" button in dashboard
2. Wait for AI to process comments
3. Review generated replies
4. Approve to mark as posted

## 🎉 You're Done!

The system will now check for new comments every 5 minutes automatically.

## Troubleshooting

**"AI API Error"**: Check your API key in `.env`

**"Instagram API Error"**: Your access token may be expired (60 days). Generate a new one.

**"Database Error"**: Delete `backend/data/replyking.db` and restart.

## Next Steps

- Add response templates for common questions
- Set up automatic posting (requires Instagram Graph API approval)
- Deploy to production (see DEPLOYMENT.md)

## Need Help?

- Full docs: [README.md](README.md)
- Setup guide: [docs/SETUP.md](docs/SETUP.md)
- Issues: https://github.com/muin-company/replyking/issues
