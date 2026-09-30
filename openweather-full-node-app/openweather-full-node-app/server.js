require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 서울, 부산, 제주, 광주 좌표 및 쿼리 매핑
const TARGET_CITIES = {
  seoul: { query: 'Seoul,KR', name: '서울' },
  busan: { query: 'Busan,KR', name: '부산' },
  jeju: { query: 'Jeju,KR', name: '제주' },
  gwangju: { query: 'Gwangju,KR', name: '광주' }
};

// 공통 날씨 데이터 포맷터
function formatWeatherData(cityNameKorean, data) {
  return {
    regionName: cityNameKorean,
    cityName: data.name,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0]?.description || '정보 없음',
    icon: data.weather[0]?.icon || '01d'
  };
}

/* =========================================================================
   [방식 1] 순수 Promise (.then / .catch) 기반 단일 조회 라우트
   ========================================================================= */
app.get('/api/weather/promise', (req, res) => {
  const cityKey = (req.query.city || 'seoul').toLowerCase();
  const cityInfo = TARGET_CITIES[cityKey] || TARGET_CITIES.seoul;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(500).json({
      success: false,
      error: '.env 파일에 올바른 OPENWEATHER_API_KEY를 설정하세요.'
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInfo.query}&appid=${apiKey}&units=metric&lang=kr`;

  // fetch()가 반환하는 Promise 객체에 .then()을 체이닝
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`OpenWeather 응답 에러 (HTTP 상태: ${response.status})`);
      }
      return response.json(); // 본문 파싱 Promise 반환
    })
    .then((data) => {
      res.json({
        success: true,
        pattern: 'Promise (.then)',
        data: formatWeatherData(cityInfo.name, data)
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error.message
      });
    });
});

/* =========================================================================
   [방식 2] async / await 기반 단일 조회 라우트
   ========================================================================= */
app.get('/api/weather/async', async (req, res) => {
  const cityKey = (req.query.city || 'seoul').toLowerCase();
  const cityInfo = TARGET_CITIES[cityKey] || TARGET_CITIES.seoul;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(500).json({
      success: false,
      error: '.env 파일에 올바른 OPENWEATHER_API_KEY를 설정하세요.'
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInfo.query}&appid=${apiKey}&units=metric&lang=kr`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeather 응답 에러 (HTTP 상태: ${response.status})`);
    }

    const data = await response.json();
    return res.json({
      success: true,
      pattern: 'async / await',
      data: formatWeatherData(cityInfo.name, data)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* =========================================================================
   [방식 3] Promise.all 기반 4개 도시 일괄 병렬 조회 라우트
   ========================================================================= */
app.get('/api/weather/all', async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(500).json({
      success: false,
      error: '.env 파일에 올바른 OPENWEATHER_API_KEY를 설정하세요.'
    });
  }

  const startTime = Date.now();
  const cityKeys = Object.keys(TARGET_CITIES);

  try {
    // 4개 도시의 fetch 요청 Promise 배열 생성
    const fetchPromises = cityKeys.map((key) => {
      const city = TARGET_CITIES[key];
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.query}&appid=${apiKey}&units=metric&lang=kr`;
      return fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`${city.name} 요청 실패 (${r.status})`);
          return r.json();
        })
        .then((data) => formatWeatherData(city.name, data));
    });

    // 4개 요청을 병렬로 동시에 대기
    const results = await Promise.all(fetchPromises);
    const duration = Date.now() - startTime;

    return res.json({
      success: true,
      durationMs: duration,
      data: results
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  OpenWeather Node.js 서버 실행 완료`);
  console.log(`  주소: http://localhost:${PORT}`);
  console.log(`====================================================`);
});