"""OpenWeather proxy for the browser fetch / Promise lesson."""
import os
from contextlib import asynccontextmanager
from pathlib import Path
from urllib import response
import pymysql

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

def get_db_connection():
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )


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

        weather_data = {
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

        save_weather_to_db(weather_data)

        return weather_data

    except (ValueError, KeyError, IndexError, TypeError):
        raise HTTPException(
            502,
            detail="날씨 응답 형식을 확인할 수 없습니다."
    ) from None


@app.get("/api/weather")
async def weather(city: str = Query("seoul", pattern="^(seoul|busan|jeju|gwangju)$")):
    """The browser calls this route for both .then() and async/await examples."""
    return {"success": True, "data": await get_weather(city, app.state.weather_client)}

def save_weather_to_db(weather_data):
    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO weather (
                    city,
                    region_name,
                    temperature,
                    feels_like,
                    humidity,
                    wind_speed,
                    description,
                    observed_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    region_name = VALUES(region_name),
                    temperature = VALUES(temperature),
                    feels_like = VALUES(feels_like),
                    humidity = VALUES(humidity),
                    wind_speed = VALUES(wind_speed),
                    description = VALUES(description),
                    observed_at = VALUES(observed_at)
            """

            cursor.execute(
                sql,
                (
                    weather_data["cityName"],
                    weather_data["regionName"],
                    weather_data["temperature"],
                    weather_data["feelsLike"],
                    weather_data["humidity"],
                    weather_data["windSpeed"],
                    weather_data["description"],
                    weather_data["observedAt"],
                ),
            )

        connection.commit()

    finally:
        connection.close()

@app.get("/api/db-test")
def db_test():
    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION() AS version")
            result = cursor.fetchone()

        return {
            "success": True,
            "mysql": result
        }

    finally:
        connection.close()

@app.get("/api/weather-db")
def weather_from_db():
    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    city,
                    region_name,
                    temperature,
                    feels_like,
                    humidity,
                    wind_speed,
                    description,
                    observed_at
                FROM weather
                ORDER BY city
            """)

            rows = cursor.fetchall()

        return {
            "success": True,
            "data": rows
        }

    finally:
        connection.close()       