# ☕ Node.js 비동기 날씨 대시보드 프로젝트
(fetch · Promise · async/await · Promise.all 완전 정복)

VS Code에서 바로 열어서 실행할 수 있는 완성된 Node.js + Express 프로젝트입니다.

---

## 📁 폴더 및 파일 구조
```text
weather-async-node-app/
├── public/
│   └── index.html          # 브라우저 UI (진동벨 상태 표시, 콘솔 로그, 부트스트랩 UI)
├── .env.example            # 환경 설정 예시 파일
├── .env                    # 실제 환경 변수 (PORT, API Key 등)
├── package.json            # 프로젝트 메타데이터 및 의존성 라이브러리
├── server.js               # Express 백엔드 서버 (fetch, AbortController, Promise.all)
└── README.md               # 프로젝트 가이드
```

---

## 🚀 빠른 시작 가이드 (VS Code)

### 1단계: 압축 풀기 및 VS Code에서 폴더 열기
1. 다운로드한 `weather-async-node-app.zip` 압축을 해제합니다.
2. VS Code를 실행하고, 메뉴에서 **[파일] → [폴더 열기]**를 선택하여 해당 폴더를 엽니다.

### 2단계: 터미널 열고 패키지 설치
1. VS Code에서 단축키 `` Ctrl + ` `` (Mac: `` Cmd + ` ``)를 눌러 내장 터미널을 엽니다.
2. 아래 명령어를 입력하여 필요한 라이브러리를 설치합니다:
```bash
npm install
```

### 3단계: 서버 실행
```bash
npm start
```
*(수정 시 자동 재시작 모드로 실행하려면 `npm run dev`)*

### 4단계: 브라우저 확인
웹 브라우저를 켜고 아래 주소로 접속합니다:
👉 **http://localhost:8080**

---

## 🔑 날씨 API Key 설정 안내

* **기본 설정 (Open-Meteo)**:
  - 회원가입이나 **API 키 입력 없이 즉시 정상 동작**합니다.
* **OpenWeatherMap으로 변경하고 싶을 때**:
  - `.env` 파일을 열고 다음과 같이 수정합니다:
    ```env
    WEATHER_PROVIDER=openweathermap
    OPENWEATHER_API_KEY=발급받은_32자리_API키
    ```
