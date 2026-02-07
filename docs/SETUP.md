# 🔧 ReplyKingAI 설치 가이드

## 사전 요구사항

- **Node.js** 18+ ([다운로드](https://nodejs.org/))
- **npm** 또는 **yarn**
- **Instagram Business/Creator 계정**
- **Facebook 개발자 계정**
- **DeepSeek** 또는 **OpenAI API 키**

## 1. 저장소 클론

```bash
git clone https://github.com/muin-company/replyking.git
cd replyking
```

## 2. Backend 설정

### 2.1 패키지 설치

```bash
cd backend
npm install
```

### 2.2 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 다음을 설정:

```env
PORT=3001

# AI Service
USE_DEEPSEEK=true
AI_API_KEY=your_api_key_here

# Instagram OAuth
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 2.3 AI API 키 발급

**DeepSeek (추천 - 저렴함)**:
1. https://platform.deepseek.com/ 접속
2. 회원가입 후 API 키 생성
3. `.env`의 `AI_API_KEY`에 입력

**OpenAI**:
1. https://platform.openai.com/ 접속
2. API 키 생성
3. `.env`에서 `USE_DEEPSEEK=false` 설정
4. `AI_API_KEY`에 OpenAI 키 입력

### 2.4 데이터베이스 초기화

```bash
# 데이터 디렉토리 생성
mkdir -p data

# 개발 서버 실행 (자동으로 DB 초기화됨)
npm run dev
```

서버가 정상적으로 시작되면:
```
✅ Database initialized
🚀 ReplyKingAI Backend running on http://localhost:3001
```

## 3. Frontend 설정

새 터미널에서:

```bash
cd ../frontend
npm install
```

### 3.1 환경 변수 (선택사항)

```bash
# .env.local 생성
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

### 3.2 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 4. Instagram API 설정

### 4.1 Facebook 앱 생성

1. https://developers.facebook.com/ 접속
2. "내 앱" → "앱 만들기"
3. 유형: "비즈니스" 선택
4. 앱 이름: "ReplyKingAI Test" (원하는 이름)

### 4.2 Instagram Basic Display 추가

1. 앱 대시보드 → "제품 추가"
2. "Instagram Basic Display" 선택
3. "설정" 클릭

### 4.3 OAuth 설정

**유효한 OAuth 리디렉션 URI**:
```
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
```

**권한 해제 URL**:
```
http://localhost:3000/auth/deauthorize
```

**데이터 삭제 요청 URL**:
```
http://localhost:3000/auth/delete
```

### 4.4 Instagram 테스터 추가

1. "역할" → "Instagram 테스터"
2. Instagram 사용자 이름 입력
3. 해당 Instagram 계정에서 승인

### 4.5 액세스 토큰 발급

#### 방법 1: 수동으로 토큰 생성 (개발용)

1. Instagram Basic Display 설정 페이지에서 "Generate Token" 버튼 클릭
2. Instagram으로 로그인 및 권한 승인
3. 받은 토큰을 복사

**토큰 유효기간**: 60일 (자동 갱신 필요)

#### 방법 2: OAuth Flow (프로덕션용)

인증 URL 생성:
```
https://api.instagram.com/oauth/authorize
  ?client_id={your-client-id}
  &redirect_uri={your-redirect-uri}
  &scope=user_profile,user_media
  &response_type=code
```

사용자가 승인하면 `code` 파라미터로 리디렉트됨.

코드를 액세스 토큰으로 교환:
```bash
curl -X POST \
  https://api.instagram.com/oauth/access_token \
  -F client_id={your-client-id} \
  -F client_secret={your-client-secret} \
  -F grant_type=authorization_code \
  -F redirect_uri={your-redirect-uri} \
  -F code={code}
```

### 4.6 장기 액세스 토큰으로 교환

단기 토큰(1시간)을 장기 토큰(60일)으로 교환:

```bash
curl -X GET \
  "https://graph.instagram.com/access_token
   ?grant_type=ig_exchange_token
   &client_secret={your-client-secret}
   &access_token={short-lived-token}"
```

### 4.7 토큰 갱신 (60일마다)

```bash
curl -X GET \
  "https://graph.instagram.com/refresh_access_token
   ?grant_type=ig_refresh_token
   &access_token={long-lived-token}"
```

## 5. 계정 연결 테스트

### 5.1 API로 직접 테스트

```bash
curl -X POST http://localhost:3001/api/accounts/connect \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "your_instagram_access_token",
    "userId": "test_user_1"
  }'
```

### 5.2 대시보드에서 연결

1. http://localhost:3000/dashboard 접속
2. "계정 연결" 버튼 클릭
3. 액세스 토큰 입력

## 6. 댓글 처리 테스트

### 6.1 수동 처리

대시보드에서 "댓글 확인" 버튼 클릭

### 6.2 자동 처리 확인

Backend는 5분마다 자동으로 댓글을 확인합니다.

로그 확인:
```
🔄 Running scheduled comment processing...
✅ Processed 3 new comments for account 1
```

## 7. 프로덕션 배포

### 7.1 Backend 빌드

```bash
cd backend
npm run build
npm start
```

### 7.2 Frontend 빌드

```bash
cd frontend
npm run build
npm start
```

### 7.3 환경 변수 (프로덕션)

```env
PORT=3001
NODE_ENV=production

USE_DEEPSEEK=true
AI_API_KEY=your_production_api_key

INSTAGRAM_CLIENT_ID=your_production_client_id
INSTAGRAM_CLIENT_SECRET=your_production_client_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/auth/callback
```

### 7.4 Nginx 설정 (선택사항)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 8. 문제 해결

### Instagram API 오류

**"Invalid OAuth access token"**:
- 토큰이 만료되었을 수 있습니다 (60일)
- 토큰을 갱신하거나 재발급하세요

**"Unsupported get request"**:
- Instagram Basic Display API는 제한된 기능만 제공
- 댓글 읽기는 가능하지만 쓰기는 불가능 (현재는 수동 승인 후 복사-붙여넣기)

### Database 오류

**"SQLITE_ERROR: no such table"**:
```bash
# 데이터베이스 재생성
rm backend/data/replyking.db
npm run dev
```

### AI API 오류

**DeepSeek rate limit**:
- 무료 플랜은 분당 요청 제한이 있습니다
- 유료 플랜으로 업그레이드하거나 OpenAI 사용

## 9. 다음 단계

- ✅ Instagram 계정 연결
- ✅ 댓글 자동 수집 확인
- ✅ AI 답변 생성 테스트
- ✅ 응답 템플릿 추가
- ✅ 분석 대시보드 확인

**TikTok 연동은 Phase 2에서 추가 예정입니다.**

## 10. 지원

문제가 발생하면:
- GitHub Issues: https://github.com/muin-company/replyking/issues
- Email: contact@muin.company
- Discord: [Join our server](https://discord.gg/muin)

---

**Happy automating! 🚀**
