# OpenWeather FastAPI 실습

기존 Node.js 예제의 네 도시 조회 화면을 Python FastAPI로 옮겼습니다. 브라우저는 `/api/weather?city=...`만 호출하고, FastAPI가 `.env`의 키로 OpenWeather를 호출합니다. `.then()`과 `async/await`는 **브라우저 JavaScript의 두 표현 방식**입니다. 네 도시 조회는 브라우저의 `Promise.all()`로 네 API 요청을 병렬 실행합니다.

## Windows 실행

Python 3.10 이상을 설치하고 이 폴더를 VS Code로 엽니다. PowerShell에서:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

`.env`의 `OPENWEATHER_API_KEY`를 본인 키로 바꾼 다음:

```powershell
python -m uvicorn server:app --reload --port 8000
```

브라우저에서 `http://127.0.0.1:8000`을 엽니다. API 문서는 `http://127.0.0.1:8000/docs`입니다. Live Server로 `index.html`을 직접 열지 않습니다. `.env`는 GitHub에 올리지 않습니다.

## 파일

- `server.py`: FastAPI 서버 및 OpenWeather 요청
- `public/index.html`: 세 가지 브라우저 비동기 호출 예제
- `.env.example`: 키 이름만 적힌 복사본
- `.gitignore`: 실제 키와 가상 환경 제외

도시: 서울, 부산, 제주, 광주. 하나의 도시 조회 실패 시 네 도시 병렬 조회 전체가 실패합니다. 실습에서는 이 동작을 `Promise.all()`의 특성으로 확인합니다.
