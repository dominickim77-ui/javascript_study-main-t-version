/**
 * Node.js + Express 날씨 비동기 학습 웹서버
 * (fetch · Promise · async · await)
 */

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// 정적 파일 서빙 (public 폴더 내의 index.html 및 CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 도시별 위도/경도 데이터 (Open-Meteo용)
const CITY_COORDINATES = {
  seoul: { name: '서울 (Seoul)', lat: 37.5665, lon: 126.9780 },
  tokyo: { name: '도쿄 (Tokyo)', lat: 35.6895, lon: 139.6917 },
  newyork: { name: '뉴욕 (New York)', lat: 40.7128, lon: -74.0060 },
  london: { name: '런던 (London)', lat: 51.5074, lon: -0.1278 },
  paris: { name: '파리 (Paris)', lat: 48.8566, lon: 2.3522 }
};

/**
 * 헬퍼 함수: Open-Meteo API 호출 (Key 불필요)
 */
async function fetchFromOpenMeteo(cityKey, signal) {
  const city = CITY_COORDINATES[cityKey] || CITY_COORDINATES.seoul;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Open-Meteo 통신 오류 (상태 코드: ${response.status})`);
  }
  const data = await response.json();

  return {
    provider: 'Open-Meteo (무료 공개 API)',
    city: city.name,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    time: data.current.time,
    raw: data.current
  };
}

/**
 * 헬퍼 함수: OpenWeatherMap API 호출 (Key 필요)
 */
async function fetchFromOpenWeather(cityName, apiKey, signal) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=kr`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`OpenWeather 통신 오류 (상태 코드: ${response.status})`);
  }
  const data = await response.json();

  return {
    provider: 'OpenWeatherMap (API Key 인증)',
    city: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0]?.description || '맑음',
    time: new Date().toISOString()
  };
}

// -------------------------------------------------------------
// [API 라우트 1] 단일 도시 날씨 조회 (기본 async/await + fetch)
// -------------------------------------------------------------
app.get('/api/weather', async (req, res) => {
  const city = (req.query.city || 'seoul').toLowerCase();
  const provider = process.env.WEATHER_PROVIDER || 'open-meteo';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  console.log(`[단일 요청] 도시: ${city} | 공급자: ${provider}`);

  // AbortController: 5초 초과 시 요청 자동 중단(타임아웃 리모컨)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    let result;
    if (provider === 'openweathermap' && apiKey && apiKey !== 'your_openweather_api_key_here') {
      result = await fetchFromOpenWeather(city, apiKey, controller.signal);
    } else {
      result = await fetchFromOpenMeteo(city, controller.signal);
    }

    clearTimeout(timeoutId);
    return res.json({ success: true, data: result });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return res.status(504).json({ success: false, error: '날씨 서버 응답 시간 초과 (5초 타임아웃)' });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// [API 라우트 2] 다중 도시 동시 병렬 조회 (Promise.all 실습)
// -------------------------------------------------------------
app.get('/api/weather/compare', async (req, res) => {
  const targetCities = ['seoul', 'tokyo', 'newyork', 'london', 'paris'];
  console.log(`[병렬 요청 - Promise.all] 5개 도시 동시 조회 시작`);

  const startTime = Date.now();

  try {
    // 5개의 fetch 프로미스를 배열로 생성하여 동시에 시작시킵니다.
    const promises = targetCities.map((cityKey) => fetchFromOpenMeteo(cityKey));

    // Promise.all로 모든 결과가 도착할 때까지 한 번에 대기
    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;

    return res.json({
      success: true,
      durationMs: duration,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 서버 기동
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  날씨 비동기 웹서버가 성공적으로 구동되었습니다.`);
  console.log(`  브라우저 접속 주소: http://localhost:${PORT}`);
  console.log(`  제공 모드: ${process.env.WEATHER_PROVIDER || 'open-meteo'}`);
  console.log(`====================================================`);
});
