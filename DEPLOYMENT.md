# 🚀 ReplyKingAI Deployment Guide

## GitHub Repository Setup

The repository needs to be created on GitHub first:

### Option 1: Create via GitHub Website
1. Go to https://github.com/muin-company
2. Click "New repository"
3. Name: `replyking`
4. Description: "24/7 Instagram comment automation with AI"
5. Keep it **Private** (or Public if you want)
6. **Do NOT** initialize with README (we already have one)
7. Click "Create repository"

### Option 2: Create via GitHub CLI
```bash
# Install GitHub CLI if you haven't: https://cli.github.com/
gh repo create muin-company/replyking --private --source=. --remote=origin --push
```

### Option 3: Manual Push
After creating the repo on GitHub:
```bash
cd ~/muin/replyking
git remote set-url origin https://github.com/muin-company/replyking.git
git push -u origin main
```

## Current Status

✅ Project initialized at `~/muin/replyking/`
✅ Git repository initialized
✅ All files committed
⏸️ Waiting for GitHub repository creation

## Quick Start After Push

### 1. Install Dependencies

**Backend:**
```bash
cd ~/muin/replyking/backend
npm install
```

**Frontend:**
```bash
cd ~/muin/replyking/frontend
npm install
```

### 2. Configure Environment

```bash
cd ~/muin/replyking/backend
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd ~/muin/replyking/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd ~/muin/replyking/frontend
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## Next Steps

1. ✅ Create GitHub repository `muin-company/replyking`
2. ✅ Push code to GitHub
3. 🔄 Get DeepSeek API key (or OpenAI)
4. 🔄 Set up Instagram Basic Display API
5. 🔄 Install dependencies and run locally
6. 🔄 Test with Instagram account
7. 🔄 Deploy to production (Vercel + Railway/Render)

## Production Deployment

### Frontend (Vercel - Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd ~/muin/replyking/frontend
vercel
```

### Backend (Railway/Render)
- Railway: https://railway.app/
- Render: https://render.com/

Upload the `backend/` folder and set environment variables.

## Environment Variables for Production

```env
# Backend
PORT=3001
NODE_ENV=production
USE_DEEPSEEK=true
AI_API_KEY=your_deepseek_api_key
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=https://replyking.yourdomain.com/auth/callback

# Frontend
NEXT_PUBLIC_API_URL=https://api.replyking.yourdomain.com/api
```

## Monitoring

- **Backend Logs**: Check server logs for comment processing
- **Cron Jobs**: Comments are auto-processed every 5 minutes
- **Database**: SQLite file at `backend/data/replyking.db`

## Support

- GitHub: https://github.com/muin-company/replyking
- Email: contact@muin.company
