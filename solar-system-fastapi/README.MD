# 🪐 Solar Planet OpenAPI Project

> OpenAPI, Python, FastAPI를 이용해 태양계 행성 정보를 가져오고  
> 웹서비스에서 보여주는 학습 프로젝트입니다.

이 프로젝트의 목표는 외부 API에서 데이터를 받아와  
Python과 FastAPI로 가공한 뒤 웹에서 사용하는 전체 흐름을 이해하는 것입니다.

---

## 🎯 Project Goal

```text
OpenAPI
   ↓
JSON
   ↓
Python
   ↓
FastAPI
   ↓
Web Service
```

최종적으로 사용자가 원하는 행성을 선택하면  
각 행성의 주요 정보를 확인할 수 있는 웹서비스를 만드는 것이 목표입니다.

---

## 🛠 Tech Stack

- Python
- FastAPI
- Uvicorn
- HTTPX
- JSON
- HTML
- CSS
- Visual Studio Code
- Git / GitHub

---

## 🌐 OpenAPI

### Solar System OpenData API

태양계의 행성과 천체 정보를 제공하는 공개 API입니다.

Official Website:

```text
https://api.le-systeme-solaire.net/
```

Base URL:

```text
https://api.le-systeme-solaire.net/rest/
```

Example:

```text
https://api.le-systeme-solaire.net/rest/bodies/mars
```

Request Method:

```text
GET
```

Main Data:

```text
Planet Name
Gravity
Mean Radius
Mass
Density
Average Temperature
Orbital Period
Rotation Period
Moons
```

---

## 🔄 Data Flow

```text
User
 ↓
Browser
 ↓
FastAPI
 ↓
HTTPX
 ↓
Solar System OpenData API
 ↓
JSON Response
 ↓
Python Data Processing
 ↓
FastAPI Response
 ↓
Browser
```

---

## 📁 Project Structure

```text
solar-planet/
│
├── server.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
├── templates/
│   └── index.html
│
└── static/
    ├── css/
    │   └── style.css
    └── images/
```

> 프로젝트 진행 상황에 따라 폴더 구조는 변경될 수 있습니다.

---

## 🚀 Run Project

### 1. Install packages

```bash
pip install -r requirements.txt
```

### 2. Start FastAPI server

```bash
python -m uvicorn server:app --reload --port 8001
```

### 3. Open browser

```text
http://127.0.0.1:8001
```

FastAPI Docs:

```text
http://127.0.0.1:8001/docs
```

---

## 🪐 API Routes

Planet data:

```text
/planet/{planet_name}
```

Example:

```text
http://127.0.0.1:8001/planet/mars
```

Detailed planet data:

```text
/planet-full/{planet_name}
```

Example:

```text
http://127.0.0.1:8001/planet-full/mercury
```

---

## ☿ Mercury API ID Issue

프로젝트를 테스트하면서  
사용자가 입력하는 행성 이름과 외부 API의 ID가 다른 경우를 확인했습니다.

사용자 입력:

```text
mercury
```

Solar System OpenData API ID:

```text
mercure
```

따라서 Python에서 Mapping을 사용해 값을 변환합니다.

```python
PLANET_API_IDS = {
    "mercury": "mercure"
}
```

Data Flow:

```text
mercury
   ↓
PLANET_API_IDS
   ↓
mercure
   ↓
Solar System OpenData API
```

이 과정에서 외부 API를 사용할 때  
서비스마다 사용하는 ID나 데이터 형식이 다를 수 있다는 점을 확인했습니다.

---

## 🐞 Debugging

Mercury 데이터가 정상적으로 변환되는지 확인하기 위해  
Terminal에서 값을 확인했습니다.

```python
print("planet_name =", planet_name)
print("planet_id =", planet_id)
```

Expected Result:

```text
planet_name = mercury
planet_id = mercure
```

문제가 발생하면 다음 순서로 확인합니다.

```text
User Input
   ↓
Path Parameter
   ↓
Planet ID Mapping
   ↓
API Request
   ↓
API Response
```

---

## 🔐 Security

다음과 같은 민감정보는 GitHub에 업로드하지 않습니다.

```text
API Key
Password
Access Token
Secret Key
Login ID
Database Password
```

민감정보가 필요한 경우 `.env` 파일에 저장합니다.

Example:

```env
API_KEY=YOUR_API_KEY
```

`.env` 파일은 `.gitignore`에 추가합니다.

```gitignore
.env
__pycache__/
*.pyc
.venv/
venv/
```

---

## 📦 requirements.txt

Example:

```text
fastapi
uvicorn
httpx
python-dotenv
```

Install:

```bash
pip install -r requirements.txt
```

---

## ✅ Current Progress

현재 프로젝트에서 진행 중인 내용:

- FastAPI 서버 실행
- 외부 OpenAPI 연결
- JSON 데이터 확인
- Planet Path Parameter 사용
- Mercury API ID Mapping
- Terminal Debugging
- 행성별 API 테스트

---

## 🔜 Next Steps

앞으로 추가할 기능:

```text
8 Planets API
      ↓
Planet Data Processing
      ↓
Planet Images
      ↓
HTML / CSS
      ↓
Planet Detail Page
      ↓
Solar System Website
```

Planned Features:

- 8개 행성 정보
- 행성별 상세 페이지
- 행성 이미지
- 행성 선택 기능
- HTML / CSS 디자인
- FastAPI + Frontend 연결
- 반응형 웹페이지

---

## 💡 What I Learned

이번 프로젝트를 통해  
외부 API의 데이터를 웹서비스에서 사용하는 전체 흐름을 직접 확인했습니다.

특히 다음 연결 관계를 이해하는 것이 핵심이었습니다.

```text
OpenAPI
 ↓
JSON
 ↓
Python
 ↓
FastAPI
 ↓
Web
```

또한 외부 API를 사용할 때  
내가 사용하는 이름과 API 내부 ID가 다를 수 있으며,  
이 경우 Mapping을 통해 데이터를 변환해야 한다는 점을 배웠습니다.

---

## 🌌 Final Goal

최종적으로 사용자가 웹사이트에서 행성을 선택하면

```text
Planet Image
Planet Name
Gravity
Radius
Temperature
Orbital Period
Rotation Period
Moon Information
```

등을 확인할 수 있는  
**Solar Planet Web Service**를 만드는 것이 목표입니다.