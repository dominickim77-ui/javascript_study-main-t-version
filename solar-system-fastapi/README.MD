# 🪐 Solar System Explorer

`Python · FastAPI · OpenAPI · NASA Images API · JavaScript · JSON`

태양계 8개 행성의 정보를 외부 OpenAPI에서 가져와 웹페이지에서 탐색하고 비교할 수 있도록 만든 **FastAPI 기반 Solar System Explorer 웹 프로젝트**입니다.

이 프로젝트에서는 단순히 행성 정보를 화면에 표시하는 것에서 끝나지 않고,

- 외부 OpenAPI에서 데이터 가져오기
- JSON 데이터 처리
- Python으로 필요한 데이터 가공
- FastAPI로 Backend API 만들기
- JavaScript `fetch()`로 Frontend와 연결하기
- 두 개의 서로 다른 API 결과 합치기
- 행성 상세 정보 표시
- 두 행성 비교하기
- 한국어 / 영어 / 스페인어 UI 전환

까지 직접 구현했습니다.

---

# 🎯 프로젝트를 만든 목적

이번 프로젝트의 가장 큰 목적은 **외부 API의 데이터를 실제 웹서비스에서 사용하는 전체 흐름을 이해하는 것**입니다.

전체 구조는 다음과 같습니다.

```text
사용자
  ↓
HTML / JavaScript
  ↓
fetch()
  ↓
FastAPI
  ↓
외부 OpenAPI
  ├── Solar System OpenData API
  └── NASA Images API
  ↓
JSON Response
  ↓
Python 데이터 처리
  ↓
FastAPI Response
  ↓
JavaScript
  ↓
웹페이지 출력
```

즉,

```text
OpenAPI
   ↓
JSON
   ↓
Python
   ↓
FastAPI
   ↓
JavaScript
   ↓
Web Service
```

라는 데이터 흐름을 직접 구현하는 것이 이번 프로젝트의 핵심입니다.

---

# ✅ 현재 구현된 기능

현재 프로젝트에서는 다음 기능을 구현했습니다.

- 태양계 8개 행성 정보 조회
- NASA Images API를 이용한 행성 이미지 조회
- 행성별 카드 UI
- 행성 카드 클릭 시 상세 정보 Modal 표시
- 두 행성 데이터 비교
- 중력(Gravity) 정보 표시
- 평균 반지름(Radius) 표시
- 평균 온도를 Kelvin → Celsius로 변환
- 공전주기를 Day → Year 단위로 변환
- 자전주기 표시
- 순행(Prograde) / 역행(Retrograde) 자전 구분
- 위성(Moons) 개수 표시
- 한국어 / 영어 / 스페인어 UI
- 반응형 Grid Layout
- FastAPI 자동 API 문서 `/docs`
- 외부 API ID와 사용자 행성 이름 Mapping

---

# 🛠 사용 기술

## Backend

| 기술 | 역할 |
|---|---|
| Python | Backend 개발 언어 |
| FastAPI | API 서버 구축 |
| Uvicorn | FastAPI 실행 서버 |
| HTTPX | 외부 API HTTP 요청 |
| python-dotenv | 환경변수 관리 |
| JSON | API 데이터 교환 형식 |

## Frontend

| 기술 | 역할 |
|---|---|
| HTML | 웹페이지 구조 |
| CSS | 화면 디자인 및 반응형 Layout |
| JavaScript | 동적 화면 및 API 처리 |
| fetch() | FastAPI 요청 |
| async / await | 비동기 API 처리 |
| DOM | 행성 카드와 Modal 동적 생성 |

## External API

| API | 용도 |
|---|---|
| Solar System OpenData API | 행성의 물리적·천문학적 정보 |
| NASA Images API | 행성 이미지 검색 |

---

# 🌐 사용한 OpenAPI

## 1. Solar System OpenData API

태양계의 행성 및 천체 정보를 제공하는 OpenAPI입니다.

Official Website:

```text
https://api.le-systeme-solaire.net/
```

Base URL:

```text
https://api.le-systeme-solaire.net/rest/
```

예를 들어 Mars 정보를 요청하면:

```text
https://api.le-systeme-solaire.net/rest/bodies/mars
```

Request Method:

```text
GET
```

이 프로젝트에서는 다음과 같은 데이터를 사용합니다.

```text
Planet Name
Gravity
Mean Radius
Average Temperature
Orbital Period
Rotation Period
Moons
```

---

## 2. NASA Images API

행성 이미지는 NASA Images API를 이용해 검색합니다.

API:

```text
https://images-api.nasa.gov/search
```

예를 들어 Mars 이미지를 검색할 때는:

```text
q = Mars planet
media_type = image
```

와 같은 Query Parameter를 전달합니다.

FastAPI에서는 행성마다 적절한 검색어를 미리 지정했습니다.

```python
NASA_SEARCH_TERMS = {
    "mercury": "Mercury planet",
    "venus": "Venus planet",
    "earth": "Earth Blue Marble",
    "mars": "Mars planet",
    "jupiter": "Jupiter planet Great Red Spot",
    "saturn": "Saturn planet rings",
    "uranus": "Uranus planet",
    "neptune": "Neptune planet"
}
```

---

# 📁 실제 프로젝트 구조

현재 프로젝트 구조는 다음과 같습니다.

```text
solar-system-fastapi/
│
├── index.html
│   ├── HTML 화면
│   ├── CSS 디자인
│   ├── JavaScript
│   ├── Planet Card
│   ├── Modal
│   ├── Compare 기능
│   └── Language 기능
│
├── server.py
│   ├── FastAPI Server
│   ├── Solar System API 연결
│   ├── NASA Images API 연결
│   ├── Planet Data Processing
│   └── API Routes
│
├── requirements.txt
│   └── Python Package 목록
│
└── README.MD
```

Frontend와 Backend를 별도 폴더로 나누지 않고 학습 편의를 위해 하나의 프로젝트 폴더 안에서 관리했습니다.

---

# 🚀 프로젝트 실행 방법

## 1. 프로젝트 폴더로 이동

Terminal 또는 PowerShell에서:

```powershell
cd solar-system-fastapi
```

---

## 2. Python 가상환경 생성

프로젝트 전용 Python 환경을 만듭니다.

```powershell
py -m venv .venv
```

생성 후:

```text
solar-system-fastapi/
│
├── .venv/
├── index.html
├── server.py
└── requirements.txt
```

형태가 됩니다.

---

## 3. 가상환경 활성화

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

정상적으로 활성화되면 Terminal 앞에:

```text
(.venv)
```

가 표시됩니다.

---

## 4. 필요한 Python Package 설치

```powershell
python -m pip install -r requirements.txt
```

현재 `requirements.txt`:

```text
fastapi
uvicorn
httpx
python-dotenv
```

각 Package의 역할은 다음과 같습니다.

| Package | 역할 |
|---|---|
| fastapi | Backend API Server |
| uvicorn | FastAPI 실행 |
| httpx | 외부 API 요청 |
| python-dotenv | `.env` 환경변수 읽기 |

---

# 🔐 Environment Variable

`server.py`에서는 다음 환경변수를 읽습니다.

```python
SOLAR_API_KEY = os.getenv("SOLAR_API_KEY")
```

필요한 경우 프로젝트 폴더에 `.env` 파일을 만들고 다음과 같이 설정합니다.

```env
SOLAR_API_KEY=YOUR_API_KEY
```

민감한 정보가 들어 있는 `.env` 파일은 GitHub에 업로드하지 않습니다.

예:

```gitignore
.env
.venv/
__pycache__/
*.pyc
```

---

# ▶️ FastAPI Server 실행

가상환경이 활성화된 상태에서:

```powershell
python -m uvicorn server:app --reload --port 8001
```

을 실행합니다.

각 부분의 의미:

```text
python -m uvicorn
→ Uvicorn 실행

server:app
→ server.py 안의 FastAPI app 실행

--reload
→ 코드가 변경되면 서버 자동 재시작

--port 8001
→ 8001번 Port 사용
```

---

# 🌐 Browser 접속

웹페이지:

```text
http://127.0.0.1:8001
```

FastAPI 자동 API Documentation:

```text
http://127.0.0.1:8001/docs
```

`/docs`에서는 각 API Route를 직접 실행하고 Response를 확인할 수 있습니다.

---

# 🔗 FastAPI API Routes

현재 프로젝트에서는 다음 API Route를 사용합니다.

| Method | Route | 기능 |
|---|---|---|
| GET | `/` | Solar System Explorer 웹페이지 |
| GET | `/planet/{planet_name}` | 한 행성의 기본 정보 |
| GET | `/planets` | 태양계 8개 행성 목록 |
| GET | `/planet-image/{planet_name}` | NASA 행성 이미지 |
| GET | `/planet-full/{planet_name}` | 행성 정보 + NASA 이미지 통합 |

---

# 🪐 `/planets`

태양계의 모든 행성 정보를 가져오는 API입니다.

```text
GET /planets
```

FastAPI가 Solar System API에서 전체 천체 데이터를 받은 뒤:

```python
if body.get("isPlanet") == True:
```

조건을 사용해 행성만 골라냅니다.

그 결과:

```text
Mercury
Venus
Earth
Mars
Jupiter
Saturn
Uranus
Neptune
```

8개 행성만 반환합니다.

---

# 🔢 행성 순서 정렬

외부 API에서 반환되는 데이터 순서가 태양계 순서와 같다는 보장이 없기 때문에 직접 순서를 지정했습니다.

```python
PLANET_ORDER = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune"
]
```

그리고:

```python
planets.sort(
    key=lambda planet: PLANET_ORDER.index(planet["name"])
)
```

를 이용해 웹페이지에서도 태양에서 가까운 순서대로 표시되도록 만들었습니다.

---

# 🌡️ Kelvin → Celsius 변환

외부 API의 평균 온도는 Kelvin 단위로 제공됩니다.

웹페이지에서는 Celsius로 보여주기 위해 Python에서 변환했습니다.

```python
temperature_k = planet_data.get("avgTemp")

temperature_c = round(
    temperature_k - 273.15,
    1
)
```

예:

```text
288 K
↓
14.9 °C
```

---

# ☀️ 공전주기 Day → Year 변환

API에서는 공전주기가 Day 단위로 들어옵니다.

웹페이지에서는 사용자가 이해하기 쉽게 Year 단위로 변환했습니다.

```python
orbit_days = planet_data.get("sideralOrbit")

orbit_years = round(
    orbit_days / 365.25,
    2
)
```

예:

```text
Earth

365.25 Days
↓
1 Year
```

---

# 🔄 자전 방향 처리

행성의 자전주기 값이 음수인 경우 역행 자전으로 처리했습니다.

```python
if rotation is not None and rotation < 0:
    rotation_direction = "Retrograde"
    rotation_hours = abs(rotation)
else:
    rotation_direction = "Prograde"
    rotation_hours = rotation
```

결과적으로 사용자 화면에서는:

```text
Prograde
```

또는:

```text
Retrograde
```

로 표시할 수 있습니다.

한국어에서는:

```text
순행 자전
역행 자전
```

으로 번역해서 보여줍니다.

---

# ☿ Mercury API ID 문제와 해결

프로젝트 테스트 과정에서 중요한 문제를 발견했습니다.

웹서비스에서는 Mercury를:

```text
mercury
```

라고 사용하지만 Solar System API에서는 Mercury의 ID가:

```text
mercure
```

였습니다.

따라서 다음 요청은 정상적으로 동작하지 않을 수 있습니다.

```text
/rest/bodies/mercury
```

외부 API가 기대하는 값은:

```text
/rest/bodies/mercure
```

입니다.

이를 해결하기 위해 Python에서 Mapping을 사용했습니다.

```python
PLANET_API_IDS = {
    "mercury": "mercure",
    "venus": "venus",
    "earth": "terre",
    "mars": "mars",
    "jupiter": "jupiter",
    "saturn": "saturne",
    "uranus": "uranus",
    "neptune": "neptune"
}
```

따라서:

```text
User Input
mercury
   ↓
PLANET_API_IDS
   ↓
mercure
   ↓
Solar System OpenData API
```

형태로 변환됩니다.

이 실습을 통해 **사용자가 사용하는 값과 외부 API 내부의 ID가 항상 같지는 않다**는 점을 배웠습니다.

---

# 🖼️ NASA 이미지 검색

`/planet-image/{planet_name}` API에서는 NASA Images API를 호출합니다.

```python
url = "https://images-api.nasa.gov/search"
```

행성에 따라 Search Term을 설정하고:

```python
params = {
    "q": NASA_SEARCH_TERMS.get(
        planet_name.lower(),
        f"{planet_name} planet"
    ),
    "media_type": "image"
}
```

NASA API에 요청합니다.

검색 결과 중에는 실제 행성이 아닌 이미지도 포함될 수 있기 때문에 `title`과 `description`을 확인해서:

```text
planet
surface
```

같은 단어가 포함된 이미지를 우선 선택하도록 만들었습니다.

---

# 🔗 두 개의 API 데이터 합치기

이 프로젝트에서 가장 중요한 기능 중 하나가:

```text
/planet-full/{planet_name}
```

입니다.

예:

```text
GET /planet-full/mars
```

이 API는 두 개의 서로 다른 API에 요청합니다.

```text
Solar System API
       ↓
행성 데이터
       │
       ├──────────────┐
       │              │
       ↓              ↓
    FastAPI      NASA Images API
       │              │
       │          행성 이미지
       │              │
       └──────┬───────┘
              ↓
       하나의 JSON Response
```

즉:

**Solar System API의 행성 정보 + NASA 이미지**

를 하나로 합쳐 Frontend에 전달합니다.

---

# 📦 `/planet-full` Response

예상 데이터 구조:

```json
{
  "name": "Mars",
  "gravity": 3.71,
  "mean_radius_km": 3389.5,
  "average_temperature_c": -63.1,
  "orbital_period_years": 1.88,
  "rotation_hours": 24.62,
  "rotation_direction": "Prograde",
  "moons": 2,
  "image_title": "Mars",
  "image_url": "NASA_IMAGE_URL"
}
```

Frontend에서는 이 하나의 JSON으로 행성 상세 화면을 만들 수 있습니다.

---

# 💻 Frontend 동작

`index.html`에서는 JavaScript의 `fetch()`를 이용해 FastAPI를 호출합니다.

예:

```javascript
const response = await fetch("/planets");
const planets = await response.json();
```

전체 흐름:

```text
JavaScript
   ↓
fetch("/planets")
   ↓
FastAPI
   ↓
OpenAPI
   ↓
JSON
   ↓
JavaScript
   ↓
Planet Card 생성
```

---

# 🪐 Planet Card

`/planets` API에서 받은 8개 행성 데이터를 이용해서 JavaScript가 직접 HTML Card를 생성합니다.

각 Card에는 다음 정보가 표시됩니다.

```text
Planet Image
Planet Name
Gravity
Radius
Temperature
Orbital Period
Moons
```

행성 이미지는 별도로:

```text
/planet-image/{planet_name}
```

API를 호출해서 가져옵니다.

---

# 🔍 Planet Detail Modal

사용자가 행성 Card를 클릭하면:

```javascript
fetch(
    `/planet-full/${planet.name.toLowerCase()}`
)
```

가 실행됩니다.

그 결과를 이용해 Modal 안에서:

```text
Planet Image
Planet Name
Gravity
Radius
Temperature
Orbit
Rotation
Rotation Direction
Moons
```

를 보여줍니다.

따라서 사용자가 별도의 페이지로 이동하지 않고 같은 화면에서 행성의 상세 정보를 확인할 수 있습니다.

---

# ⚖️ Compare Planets

두 개의 행성을 선택하여 데이터를 비교할 수 있습니다.

예:

```text
Earth
 VS
Mars
```

COMPARE 버튼을 누르면 각각:

```text
/planet-full/earth
/planet-full/mars
```

를 요청합니다.

그리고 다음 데이터를 비교합니다.

| 항목 | Planet A | Planet B |
|---|---|---|
| Gravity | 값 | 값 |
| Radius | 값 | 값 |
| Temperature | 값 | 값 |
| Orbit | 값 | 값 |
| Moons | 값 | 값 |

같은 행성을 두 번 선택하면:

```text
서로 다른 두 행성을 선택해주세요.
```

라는 안내가 표시됩니다.

---

# 🌍 Multi-language UI

현재 프로젝트에서는 세 가지 언어를 지원합니다.

```text
🇰🇷 한국어
🇺🇸 English
🇪🇸 Español
```

JavaScript 객체에 각 언어를 저장했습니다.

```javascript
const translations = {
    ko: {...},
    en: {...},
    es: {...}
};
```

언어를 선택하면:

```text
Planet Name
Gravity
Radius
Temperature
Orbit
Rotation
Moons
Compare
```

등의 UI 텍스트가 변경됩니다.

행성 이름도:

```text
Earth
지구
Tierra
```

처럼 선택한 언어에 맞게 표시됩니다.

---

# 📱 Responsive Design

행성 Card는 CSS Grid를 사용합니다.

Desktop:

```text
4 Columns
```

Tablet:

```text
2 Columns
```

Mobile:

```text
1 Column
```

CSS:

```css
@media (max-width: 900px) {
    #planet-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 500px) {
    #planet-container {
        grid-template-columns: 1fr;
    }
}
```

따라서 화면 크기에 따라 Layout이 자동으로 변경됩니다.

---

# 🐞 Debugging 과정

프로젝트를 만들면서 API에서 데이터를 받아오지 못하는 문제가 발생할 때 Terminal에서 데이터를 직접 확인했습니다.

예:

```python
print("planet_name =", planet_name)
print("planet_id =", planet_id)
```

확인하고 싶은 결과:

```text
planet_name = mercury
planet_id = mercure
```

문제가 있을 때 다음 순서로 확인했습니다.

```text
사용자 입력
   ↓
Path Parameter
   ↓
Planet ID Mapping
   ↓
External API Request
   ↓
HTTP Status Code
   ↓
JSON Response
   ↓
Frontend
```

이 과정을 통해 API 문제를 단계별로 찾아가는 Debugging 방법을 연습했습니다.

---

# 📊 HTTP Status Code

외부 API 요청이 정상적이지 않으면 FastAPI의 `HTTPException`을 이용해 오류를 반환합니다.

예:

```python
if response.status_code != 200:
    raise HTTPException(
        status_code=response.status_code,
        detail="행성 정보를 가져오지 못했습니다."
    )
```

이미지가 없는 경우:

```python
raise HTTPException(
    status_code=404,
    detail="이미지를 찾지 못했습니다."
)
```

주요 Status Code:

| Code | 의미 |
|---|---|
| 200 | 요청 성공 |
| 400 | 잘못된 요청 |
| 404 | 데이터를 찾을 수 없음 |
| 500 | 서버 내부 오류 |
| 502 | 외부 서버 응답 문제 |
| 503 | 서비스 이용 불가 |

---

# 🔐 Security

GitHub에는 다음과 같은 민감정보를 직접 올리지 않습니다.

```text
API Key
Password
Access Token
Secret Key
Database Password
Login Information
```

이러한 정보는 `.env` 환경변수로 관리합니다.

```env
SOLAR_API_KEY=YOUR_API_KEY
```

그리고 `.gitignore`를 이용해 GitHub 업로드 대상에서 제외합니다.

---

# ✅ 프로젝트 결과

이번 프로젝트에서 실제로 구현한 결과는 다음과 같습니다.

```text
Solar System OpenData API
            +
      NASA Images API
            ↓
          FastAPI
            ↓
      Data Processing
            ↓
          JSON API
            ↓
         JavaScript
            ↓
    Solar System Explorer
```

구현 완료:

- [x] FastAPI Server
- [x] Solar System OpenData API 연결
- [x] NASA Images API 연결
- [x] 태양계 8개 행성 조회
- [x] Planet ID Mapping
- [x] Kelvin → Celsius 변환
- [x] Day → Year 변환
- [x] 자전 방향 처리
- [x] NASA 이미지 검색
- [x] Planet Card 생성
- [x] Planet Detail Modal
- [x] Planet Compare 기능
- [x] 한국어 지원
- [x] English 지원
- [x] Español 지원
- [x] Responsive Layout
- [x] FastAPI `/docs`
- [x] API Error Handling

---

# 💡 이번 프로젝트에서 배운 것

이번 프로젝트를 통해 단순히 Python 코드 하나를 실행하는 것이 아니라 **Frontend와 Backend 그리고 외부 API가 서로 연결되는 전체 구조**를 직접 구현했습니다.

가장 중요한 데이터 흐름은:

```text
Frontend
   ↓
JavaScript fetch()
   ↓
HTTP Request
   ↓
FastAPI
   ↓
External API
   ↓
JSON
   ↓
Python Processing
   ↓
FastAPI Response
   ↓
JavaScript
   ↓
Browser
```

입니다.

특히 다음 내용을 실제 코드로 확인했습니다.

1. 외부 API의 데이터를 Python에서 가져오는 방법
2. JSON에서 필요한 값만 선택하는 방법
3. 외부 API의 ID와 사용자 입력이 다를 때 Mapping하는 방법
4. 서로 다른 두 API의 데이터를 하나의 Response로 합치는 방법
5. FastAPI를 Frontend와 연결하는 방법
6. `fetch()`와 `async/await`을 이용해 API를 호출하는 방법
7. API 데이터를 이용해 HTML을 동적으로 생성하는 방법
8. 한 개의 API 데이터를 여러 언어 UI에서 재사용하는 방법
9. HTTP Status Code와 Error Handling
10. API 문제를 단계별로 Debugging하는 방법

---

# 🌌 최종 결과

사용자는 웹사이트에서 태양계 8개 행성을 확인하고,

```text
Planet Image
Planet Name
Gravity
Radius
Temperature
Orbital Period
Rotation Period
Rotation Direction
Moons
```

정보를 확인할 수 있습니다.

또한 행성을 클릭하면 상세 정보를 볼 수 있고, 두 행성을 선택해 데이터를 직접 비교할 수 있습니다.

```text
Explore
   ↓
Select Planet
   ↓
View Details
   ↓
Compare Planets
```

한국어, 영어, 스페인어를 선택할 수 있어 하나의 API 데이터를 여러 언어의 사용자 인터페이스에서 활용할 수 있도록 만들었습니다.

---

# 🔜 Next Step

다음 단계에서는 현재 Local 환경에서 실행되는 프로젝트를 실제 인터넷에서 접속할 수 있도록 배포하는 것을 목표로 합니다.

```text
Local Development
      ↓
GitHub
      ↓
Cloud Deployment
      ↓
Public Web Service
```

추가로 확장할 수 있는 기능:

- Planet 검색
- 행성 거리 데이터 추가
- 태양(Sun) 정보 추가
- 행성 크기 시각화
- 행성 간 비교 Chart
- Database 연동
- 사용자 Favorite Planet 저장
- Vercel 또는 Cloud 환경 배포

---

# 📌 Project Summary

이 프로젝트는 다음 과정을 직접 경험하기 위해 만든 학습 프로젝트입니다.

```text
OpenAPI
   ↓
JSON
   ↓
Python
   ↓
FastAPI
   ↓
JavaScript
   ↓
HTML / CSS
   ↓
Interactive Web Service
```

단순히 API 데이터를 출력하는 것이 아니라 **실제 사용자가 탐색하고 비교할 수 있는 웹서비스 형태로 발전시키는 것**이 이번 프로젝트의 목표입니다.