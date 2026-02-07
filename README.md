# 💬 댓글왕AI (ReplyKingAI)

24/7 인스타그램 댓글 자동 응답 서비스

## 📊 비즈니스 개요

- **예상 ARR**: ₩11.5억
- **타겟 고객**: 소셜커머스 셀러, 인플루언서
- **핵심 가치**: 24/7 즉시 응답, AI 감정 분석, 맞춤형 답변 생성
- **가격**: ₩19,900/월 (30일 무료 체험)

## 🚀 핵심 기능

### V1 (Current - Instagram Only)
- ✅ Instagram Basic Display API 연동
- ✅ 자동 댓글 감지 (5분마다)
- ✅ AI 감정 분석 (긍정/중립/부정)
- ✅ 카테고리 분류 (질문/칭찬/불만/구매문의/일반)
- ✅ 맞춤형 답변 생성 (한국어, DeepSeek/OpenAI)
- ✅ 응답 템플릿 관리
- ✅ 분석 대시보드
- ✅ 대기 중 답변 승인 시스템

### V2 (Roadmap)
- ⏳ TikTok 지원
- ⏳ 자동 게시 기능
- ⏳ 고급 분석 (시간대별, 해시태그별)
- ⏳ 멀티 언어 지원

## 🛠 기술 스택

### Backend
- **Node.js** + TypeScript
- **Express** - REST API
- **SQLite** - 데이터 저장
- **Instagram Basic Display API** - 댓글 읽기
- **DeepSeek API** (또는 OpenAI) - AI 답변 생성
- **node-cron** - 스케줄링

### Frontend
- **Next.js 14** - React 프레임워크
- **TypeScript**
- **Tailwind CSS** - 스타일링
- **Axios** - API 통신

## 📁 프로젝트 구조

```
replyking/
├── backend/
│   ├── src/
│   │   ├── api/           # API 라우트
│   │   ├── services/      # 비즈니스 로직
│   │   │   ├── instagram.service.ts
│   │   │   ├── ai.service.ts
│   │   │   └── comment-processor.service.ts
│   │   ├── models/        # 데이터 모델
│   │   ├── db/            # 데이터베이스 스키마
│   │   └── index.ts       # 메인 서버
│   ├── data/              # SQLite DB 파일
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx       # 홈페이지
│   │   ├── pricing/       # 요금제 페이지
│   │   └── dashboard/     # 대시보드
│   └── package.json
├── docs/
│   └── SETUP.md           # 설치 가이드
└── README.md
```

## 🔧 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/muin-company/replyking.git
cd replyking
```

### 2. Backend 설정

```bash
cd backend
npm install

# .env 파일 생성
cp .env.example .env
```

`.env` 파일 편집:

```env
PORT=3001

# DeepSeek API (추천 - 저렴함)
USE_DEEPSEEK=true
AI_API_KEY=your_deepseek_api_key

# 또는 OpenAI
# USE_DEEPSEEK=false
# AI_API_KEY=your_openai_api_key
```

Backend 실행:

```bash
npm run dev
```

### 3. Frontend 설정

```bash
cd ../frontend
npm install
npm run dev
```

### 4. 접속

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🔐 Instagram API 설정

### 1. Facebook 개발자 앱 생성

1. [Facebook Developers](https://developers.facebook.com/) 접속
2. 새 앱 생성
3. "Instagram Basic Display" 제품 추가

### 2. 리디렉션 URI 설정

```
http://localhost:3000/auth/callback
```

### 3. 액세스 토큰 발급

Instagram Basic Display API는 사용자 인증이 필요합니다:

1. 앱 설정에서 "Instagram 테스터" 추가
2. Instagram 계정으로 승인
3. 토큰 생성 URL 사용:

```
https://api.instagram.com/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=YOUR_REDIRECT_URI
  &scope=user_profile,user_media
  &response_type=code
```

4. 받은 코드로 액세스 토큰 교환

자세한 가이드: [docs/SETUP.md](docs/SETUP.md)

## 📊 데이터베이스 스키마

```sql
-- Instagram 계정
instagram_accounts (id, user_id, username, access_token, ...)

-- 댓글
comments (id, comment_id, text, sentiment, sentiment_score, ...)

-- AI 답변
replies (id, comment_id, reply_text, status, category, ...)

-- 응답 템플릿
templates (id, category, template, usage_count, ...)

-- 분석 데이터
analytics (id, date, comments_received, replies_sent, ...)
```

## 🤖 AI 답변 생성 로직

1. **댓글 수집**: Instagram API로 5분마다 새 댓글 가져오기
2. **감정 분석**: DeepSeek/OpenAI로 감정 + 카테고리 분류
3. **답변 생성**: 
   - 해당 카테고리 템플릿이 있으면 템플릿 기반 생성
   - 없으면 AI가 처음부터 생성
4. **대기열 추가**: 생성된 답변을 pending 상태로 저장
5. **수동 승인**: 사용자가 대시보드에서 확인 후 승인

## 💰 비즈니스 모델

### 무료 체험
- 30일 무료
- 계정 1개
- 월 100개 댓글

### 프로 플랜 (₩19,900/월)
- 계정 3개
- 무제한 댓글
- 고급 분석
- 우선 지원

### 수익 예측
- 타겟: 한국 소셜커머스 셀러 5만 명
- 예상 전환율: 2% (1,000명)
- 예상 ARR: 1,000명 × ₩19,900 × 12개월 = **₩238,800,000** (약 2.4억)
- 최대 ARR (5% 전환): **₩11.5억**

## 🗺 로드맵

### Phase 1 (완료) ✅
- Instagram 기본 연동
- AI 답변 생성
- 웹 대시보드

### Phase 2 (2026 Q2)
- TikTok 연동
- 자동 게시 기능
- 모바일 앱

### Phase 3 (2026 Q3-Q4)
- YouTube Shorts 댓글
- 멀티 언어 지원
- 고급 분석 (영향력 분석, ROI)

## 📝 API 문서

### POST `/api/accounts/connect`
Instagram 계정 연결

**Request:**
```json
{
  "accessToken": "instagram_access_token",
  "userId": "unique_user_id"
}
```

### GET `/api/accounts/:id/comments`
댓글 조회

### POST `/api/accounts/:id/process`
새 댓글 처리

### GET `/api/accounts/:id/analytics`
분석 데이터 조회

자세한 API 문서: [docs/API.md](docs/API.md)

## 🤝 기여

이슈와 PR 환영합니다!

## 📄 라이선스

MIT License - see [LICENSE](LICENSE)

## 📞 문의

- **Email**: contact@muin.company
- **Website**: https://muin.company
- **Twitter**: [@muincompany](https://twitter.com/muincompany)

---

Built with ❤️ by [MUIN Company](https://muin.company)
