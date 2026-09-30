"""OpenWeather proxy for the browser fetch / Promise lesson."""
import os
from contextlib import asynccontextmanager
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE = Path(__file__).resolve().parent
load_dotenv(BASE / ".env")

CITIES = {
    "seoul": ("Seoul,KR", "서울"),
    "busan": ("Busan,KR", "부산"),
    "jeju": ("Jeju,KR", "제주"),
    "gwangju": ("Gwangju,KR", "광주"),
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with httpx.AsyncClient(timeout=10.0) as client:
        app.state.weather_client = client
        yield


app = FastAPI(title="OpenWeather FastAPI 실습", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=BASE / "public"), name="static")


@app.get("/", include_in_schema=False)
def index():
    return FileResponse(BASE / "public" / "index.html")


async def get_weather(city: str, client: httpx.AsyncClient) -> dict:
    api_key = os.getenv("OPENWEATHER_API_KEY", "").strip()
    if not api_key or api_key == "your_api_key_here":
        raise HTTPException(503, detail=".env에 OPENWEATHER_API_KEY를 설정하세요.")

    query, korean_name = CITIES[city]
    try:
        response = await client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"q": query, "appid": api_key, "units": "metric", "lang": "kr"},
        )
    except httpx.RequestError:
        raise HTTPException(502, detail="날씨 서비스에 연결하지 못했습니다.") from None

    if response.status_code != 200:
        # Do not forward the upstream URL, which contains the API key.
        raise HTTPException(502, detail=f"날씨 서비스 응답 오류 ({response.status_code})")
    try:
        data = response.json()
        return {
            "regionName": korean_name,
            "cityName": data["name"],
            "temperature": data["main"]["temp"],
            "feelsLike": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "windSpeed": data["wind"]["speed"],
            "description": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"],
            "observedAt": data.get("dt"),
        }
    except (ValueError, KeyError, IndexError, TypeError):
        raise HTTPException(502, detail="날씨 응답 형식을 확인할 수 없습니다.") from None


@app.get("/api/weather")
async def weather(city: str = Query("seoul", pattern="^(seoul|busan|jeju|gwangju)$")):
    """The browser calls this route for both .then() and async/await examples."""
    return {"success": True, "data": await get_weather(city, app.state.weather_client)}
