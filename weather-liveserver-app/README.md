# ☕ Live Server 전용 비동기 날씨 대시보드
Node.js 설치 없이 **VS Code와 Live Server 확장 프로그램만으로 즉시 구동**되는 순수 프론트엔드 프로젝트입니다.

---

## 📁 파일 구성
```text
weather-liveserver-app/
├── index.html     # 반응형 웹 화면 (카페 진동벨 상태 카드, 결과창, 터미널 로그창)
├── app.js         # fetch, Promise, async/await, Promise.all, AbortController 구현 코드
└── README.md      # 사용 안내 가이드
```

---

## 🚀 VS Code에서 실행하는 방법 (10초 컷)

1. 다운로드한 `weather-liveserver-app.zip`의 압축을 풉니다.
2. VS Code에서 **[파일] → [폴더 열기]**를 눌러 압축을 푼 폴더를 엽니다.
3. VS Code 마켓플레이스(`Ctrl + Shift + X` 또는 Mac: `Cmd + Shift + X`)에서 **Live Server** 확장이 설치되어 있는지 확인합니다.
4. `index.html` 파일을 우클릭하고 **[Open with Live Server]**를 클릭합니다.
5. 브라우저에서 버튼을 누르면 즉시 실시간 날씨 데이터와 비동기 단계별 로그를 확인하실 수 있습니다!

---

## 💡 주요 비동기 학습 포인트

1. **`fetch`**: 브라우저에서 직접 Open-Meteo 무료 기상청 API로 요청 전송 (CORS 기본 허용).
2. **`Promise`**: 요청 즉시 진동벨(Pending)을 발급받고 응답에 따라 성공(Fulfilled) / 실패(Rejected)로 분기.
3. **`async / await`**: 동기식 코드처럼 읽기 쉽고 깔끔하게 결과 대기.
4. **`Promise.all`**: 5개 도시(서울, 도쿄, 뉴욕, 런던, 파리)의 날씨를 직렬이 아닌 병렬로 동시에 가져와 대기 시간을 획기적으로 단축.
5. **`AbortController`**: 5초 이상 응답이 지연될 경우 네트워크 요청을 실제로 중단(Cancel)시키는 안전 패턴.
