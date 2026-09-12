# HERMIT HOUSE — 타로 리딩 앱

## 개요
10-30대 한국 여성을 주 타겟으로 한 웨이트 타로 리딩 웹앱.

## 기술 스택
- React (Create React App)
- Claude API — claude-sonnet-5
- 웨이트 타로 78장 (메이저 22 + 마이너 56)
- Vercel 서버리스 함수 (API 프록시)

## 앱 구조
- 질문 입력 → 카테고리 분류 → 카드 3장 → AI 리딩
- 조언 듣기: 추가 카드 3장 (방해물 / 주변환경 / 조언)
- AI 실패 시 → 243개 종합 메시지 풀에서 폴백

## 알고리즘
docs/타로리딩_알고리즘.md 참조

## 메시지 풀
docs/종합메시지_243개.md 참조

## 배포
- GitHub: https://github.com/hkkunovel/hermithouse
- Vercel: https://hermithouse.vercel.app
- GitHub push 시 Vercel 자동 재배포

## 배포 구조
hermithouse/
  ├── public/
  │   └── index.html
  ├── src/
  │   ├── App.jsx       ← 메인 파일
  │   ├── cards.js       ← 78장 카드 SVG·데이터
  │   ├── synthesis.js   ← 질문 분석·메시지 합성
  │   └── index.js
  ├── api/
  │   └── reading.js    ← Vercel 서버리스 함수 (Anthropic API 프록시)
  └── package.json

## API 구조
- 브라우저 → /api/reading (Vercel 서버리스) → Anthropic API
- API 키는 Vercel 환경변수로 관리

