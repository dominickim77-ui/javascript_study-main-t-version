# 뉴스 소재 CRUD 실습

HTML/JavaScript에서 `fetch()`로 JSON을 보내고, Node.js/Express 서버가 뉴스 소재를 등록·조회·수정·삭제하는 학습용 프로젝트입니다.

## 학습 목표

- HTTP 메서드 GET·POST·PUT·DELETE 구분
- JavaScript 객체를 `JSON.stringify()`로 변환
- `Content-Type: application/json` 헤더 사용
- Express의 `express.json()`으로 요청 본문 읽기
- 경로 매개변수 `/api/ideas/:id` 사용
- HTTP 상태 코드 200·201·400·404 확인
- `async/await`과 `fetch()`로 서버 응답 처리

## 처리 흐름

```text
사용자 입력 → JavaScript 객체 → JSON.stringify() → fetch()
→ Express API → 메모리 배열 ideas → JSON 응답 → 화면 출력
```

## API

| 메서드 | 경로 | 기능 |
|---|---|---|
| GET | `/api/ideas` | 전체 뉴스 소재 조회 |
| POST | `/api/ideas` | 새 뉴스 소재 등록 |
| PUT | `/api/ideas/:id` | 지정한 뉴스 소재 전체 수정 |
| DELETE | `/api/ideas/:id` | 지정한 뉴스 소재 삭제 |

POST와 PUT 요청 본문:

```json
{
  "title": "제주 강풍",
  "fact": "제주 지역에 강풍이 관측됐다"
}
```

## 파일 구조

```text
simple-post-put-delete-app/
├── public/
│   └── index.html   # 입력 화면, fetch 요청, JSON 결과 표시
├── package.json     # 실행 명령과 Express 의존성
├── package-lock.json
├── server.js        # Express 서버와 CRUD API
└── README.md
```

## 실행 방법

Node.js 18 이상을 설치한 뒤 VS Code 터미널에서 실행합니다.

```bash
cd simple-post-put-delete-app
npm install
npm start
```

브라우저에서 `http://localhost:3000`을 엽니다.

Live Server로 `public/index.html`만 열면 안 됩니다. 이 프로젝트는 POST·PUT·DELETE를 처리하는 Express 서버가 필요합니다.

## 실습 순서

1. **GET 목록 확인**으로 빈 배열 `[]`을 확인합니다.
2. 제목과 핵심 사실을 입력한 뒤 **POST 등록**을 누릅니다.
3. 생성된 `id`를 확인합니다.
4. 수정할 내용을 입력하고 **PUT 수정**을 누릅니다.
5. 삭제할 번호를 입력하고 **DELETE 삭제**를 누릅니다.
6. 존재하지 않는 번호와 빈 입력값으로 400·404 오류를 확인합니다.

## 주의사항

현재 데이터베이스를 사용하지 않고 `ideas` 배열에 저장합니다. 서버를 종료하거나 다시 실행하면 등록한 데이터가 모두 사라집니다.

