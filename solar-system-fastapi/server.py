import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path


load_dotenv()

app = FastAPI(title="Solar System API")
BASE = Path(__file__).resolve().parent

SOLAR_API_KEY = os.getenv("SOLAR_API_KEY")

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



@app.get("/")
def home():
    return FileResponse(BASE / "index.html")


@app.get("/planet/{planet_name}")
async def get_planet(planet_name: str):

    url = f"https://api.le-systeme-solaire.net/rest/bodies/{planet_name}"

    headers = {
        "Authorization": f"Bearer {SOLAR_API_KEY}"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="행성 정보를 가져오지 못했습니다."
        )

    data = response.json()

    return {
        "name": data.get("englishName"),
        "gravity": data.get("gravity"),
        "mean_radius_km": data.get("meanRadius"),
        "average_temperature_k": data.get("avgTemp"),
        "orbital_period_days": data.get("sideralOrbit"),
        "rotation_hours": data.get("sideralRotation"),
        "moons": len(data.get("moons") or [])
    }

@app.get("/planets")
async def get_planets():

    url = "https://api.le-systeme-solaire.net/rest/bodies/"

    headers = {
        "Authorization": f"Bearer {SOLAR_API_KEY}"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="행성 목록을 가져오지 못했습니다."
        )

    data = response.json()

    planets = []

    for body in data["bodies"]:
        if body.get("isPlanet") == True:
            planets.append({
                "name": body.get("englishName"),
                "gravity": body.get("gravity"),
                "mean_radius_km": body.get("meanRadius"),
                "average_temperature_k": body.get("avgTemp"),
                "orbital_period_days": body.get("sideralOrbit"),
                "moons": len(body.get("moons") or [])
            })


    planets.sort(
        key=lambda planet: PLANET_ORDER.index(planet["name"])
    )

    return planets

@app.get("/planet-image/{planet_name}")
async def get_planet_image(planet_name: str):

    url = "https://images-api.nasa.gov/search"

    params = {
    "q": NASA_SEARCH_TERMS.get(
        planet_name.lower(),
        f"{planet_name} planet"
    ),
    "media_type": "image"
}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="NASA 이미지를 가져오지 못했습니다."
        )

    data = response.json()

    items = data["collection"]["items"]

    if len(items) == 0:
        raise HTTPException(
            status_code=404,
            detail="이미지를 찾지 못했습니다."
        )

    selected_item = None

    for item in items:
        title = item["data"][0]["title"].lower()
        description = item["data"][0].get("description", "").lower()

        if (
            planet_name.lower() in title
            and (
                "planet" in title
                or "planet" in description
                or "surface" in title
                or "surface" in description
            )
        ):
            selected_item = item
            break

    if selected_item is None:
        selected_item = items[0]

    image_url = selected_item["links"][0]["href"]
    title = selected_item["data"][0]["title"]

    return {
        "planet": planet_name,
        "title": title,
        "image_url": image_url
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="NASA 이미지를 가져오지 못했습니다."
        )

    data = response.json()

    items = data["collection"]["items"]

    if len(items) == 0:
        raise HTTPException(
            status_code=404,
            detail="이미지를 찾지 못했습니다."
        )

    first_item = items[0]

    image_url = first_item["links"][0]["href"]
    title = first_item["data"][0]["title"]

    return {
        "planet": planet_name,
        "title": title,
        "image_url": image_url
    }

@app.get("/planet-full/{planet_name}")
async def get_planet_full(planet_name: str):

    # 1. Solar System API에서 행성 정보 가져오기
    planet_id = PLANET_API_IDS.get(
        planet_name.lower(),
        planet_name.lower()
    )

    planet_url = (
        f"https://api.le-systeme-solaire.net/rest/bodies/{planet_id}"
    )

    headers = {
        "Authorization": f"Bearer {SOLAR_API_KEY}"
    }

    async with httpx.AsyncClient() as client:
        planet_response = await client.get(
            planet_url,
            headers=headers
        )

    if planet_response.status_code != 200:
        raise HTTPException(
            status_code=planet_response.status_code,
            detail="행성 정보를 가져오지 못했습니다."
        )

    planet_data = planet_response.json()


    # 2. NASA API에서 행성 이미지 가져오기
    nasa_url = "https://images-api.nasa.gov/search"

    params = {
        "q": NASA_SEARCH_TERMS.get(
            planet_name.lower(),
            f"{planet_name} planet"
        ),
        "media_type": "image"
    }

    async with httpx.AsyncClient() as client:
        nasa_response = await client.get(
            nasa_url,
            params=params
        )

    if nasa_response.status_code != 200:
        raise HTTPException(
            status_code=nasa_response.status_code,
            detail="NASA 이미지를 가져오지 못했습니다."
        )

    nasa_data = nasa_response.json()
    items = nasa_data["collection"]["items"]

    selected_item = None

    for item in items:
        title = item["data"][0]["title"].lower()

        description = item["data"][0].get(
            "description",
            ""
        ).lower()

        if (
            planet_name.lower() in title
            and (
                "planet" in title
                or "planet" in description
                or "surface" in title
                or "surface" in description
            )
        ):
            selected_item = item
            break

    if selected_item is None and len(items) > 0:
        selected_item = items[0]

    image_title = None
    image_url = None

    if selected_item:
        image_title = selected_item["data"][0]["title"]
        image_url = selected_item["links"][0]["href"]


    # 3. 두 API 결과 합치기
    return {
        "name": planet_data.get("englishName"),
        "gravity": planet_data.get("gravity"),
        "mean_radius_km": planet_data.get("meanRadius"),
        "average_temperature_k": planet_data.get("avgTemp"),
        "orbital_period_days": planet_data.get("sideralOrbit"),
        "rotation_hours": planet_data.get("sideralRotation"),
        "moons": len(planet_data.get("moons") or []),
        "image_title": image_title,
        "image_url": image_url
    }