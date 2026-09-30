/**
 * Live Server 전용 비동기 스크립트 (fetch, Promise, async/await, Promise.all, AbortController)
 * Open-Meteo 무료 API 활용 (CORS 허용 & API Key 불필요)
 */

// 1. 도시별 좌표 정보 데이터베이스
const CITIES = {
  seoul: { name: '서울 (Seoul)', lat: 37.5665, lon: 126.9780 },
  tokyo: { name: '도쿄 (Tokyo)', lat: 35.6895, lon: 139.6917 },
  newyork: { name: '뉴욕 (New York)', lat: 40.7128, lon: -74.0060 },
  london: { name: '런던 (London)', lat: 51.5074, lon: -0.1278 },
  paris: { name: '파리 (Paris)', lat: 48.8566, lon: 2.3522 }
};

// UI DOM 요소
const terminalLog = document.getElementById('terminalLog');
const buzzerCard = document.getElementById('buzzerCard');
const buzzerTitle = document.getElementById('buzzerTitle');
const buzzerBadge = document.getElementById('buzzerBadge');
const buzzerDesc = document.getElementById('buzzerDesc');
const weatherResult = document.getElementById('weatherResult');
const resultGrid = document.getElementById('resultGrid');

// 콘솔 로그 출력 헬퍼 함수
function log(msg) {
  const time = new Date().toLocaleTimeString();
  terminalLog.textContent += `\n[${time}] ${msg}`;
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function clearLog() {
  terminalLog.textContent = '> 로그가 초기화되었습니다.';
}

// 진동벨 카드 상태 업데이트 UI 함수
function setBuzzerState(state, title, desc, badgeClass) {
  buzzerCard.className = `buzzer-box mb-4 ${state}`;
  buzzerTitle.textContent = title;
  buzzerDesc.textContent = desc;
  buzzerBadge.className = `badge ${badgeClass}`;
  buzzerBadge.textContent = state.toUpperCase();
}

/**
 * [핵심 함수] 특정 도시의 날씨를 가져오는 비동기 함수
 * fetch + Promise 반환 + AbortController 타임아웃
 */
async function fetchCityWeather(cityKey, signal) {
  const city = CITIES[cityKey] || CITIES.seoul;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

  // fetch()는 주문서를 보내고 'Promise(진동벨)'를 즉시 반환합니다.
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`HTTP 에러 발생: ${response.status}`);
  }

  // JSON 파싱 (이 작업도 await로 완료 대기)
  const data = await response.json();

  return {
    city: city.name,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m
  };
}

// ---------------------------------------------------------------------
// 1. 단일 도시 조회: async/await 기본 실습
// ---------------------------------------------------------------------
document.getElementById('btnFetchSingle').addEventListener('click', async () => {
  const cityKey = document.getElementById('citySelect').value;
  const cityInfo = CITIES[cityKey];

  weatherResult.classList.add('d-none');
  resultGrid.innerHTML = '';

  // 진동벨 발급 (Pending)
  setBuzzerState(
    'pending',
    '⏳ 진동벨 발급: Pending (대기 중)',
    `${cityInfo.name} 기상청에 주문 완료. 응답을 기다리는 중...`,
    'bg-warning text-dark'
  );
  log(`[주문] fetch() 실행 -> ${cityInfo.name} 날씨 요청 시작`);

  // 타임아웃용 AbortController (5초 초과 시 주문 취소)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    // await를 사용하여 진동벨이 울릴 때까지 다음 줄로 넘어가지 않고 대기!
    const weather = await fetchCityWeather(cityKey, controller.signal);
    clearTimeout(timer);

    // 진동벨 울림 (Fulfilled)
    setBuzzerState(
      'fulfilled',
      '✅ 진동벨 울림: Fulfilled (완료)',
      `${weather.city} 날씨 데이터 수령 성공!`,
      'bg-success'
    );
    log(`[수령 완료] 기온: ${weather.temperature}℃ | 습도: ${weather.humidity}% | 풍속: ${weather.windSpeed}km/h`);

    resultGrid.innerHTML = `
      <div class="col-4">
        <div class="text-muted small">현재 기온</div>
        <h3 class="fw-bold text-primary mt-1">${weather.temperature} ℃</h3>
      </div>
      <div class="col-4">
        <div class="text-muted small">습도</div>
        <h3 class="fw-bold text-info mt-1">${weather.humidity} %</h3>
      </div>
      <div class="col-4">
        <div class="text-muted small">풍속</div>
        <h3 class="fw-bold text-secondary mt-1">${weather.windSpeed} km/h</h3>
      </div>
    `;
    weatherResult.classList.remove('d-none');

  } catch (error) {
    clearTimeout(timer);
    const errorMsg = error.name === 'AbortError' ? '5초 타임아웃으로 주문 취소됨' : error.message;
    setBuzzerState('rejected', '❌ 주문 실패: Rejected (거부)', `에러: ${errorMsg}`, 'bg-danger');
    log(`[오류 발생] ${errorMsg}`);
  }
});

// ---------------------------------------------------------------------
// 2. 전체 도시 병렬 조회: Promise.all 실습 (속도 최적화)
// ---------------------------------------------------------------------
document.getElementById('btnFetchAll').addEventListener('click', async () => {
  weatherResult.classList.add('d-none');
  resultGrid.innerHTML = '';

  const cityKeys = Object.keys(CITIES);

  setBuzzerState(
    'pending',
    '⏳ 진동벨 5개 발급: Pending (동시 병렬 대기)',
    '서울, 도쿄, 뉴욕, 런던, 파리 5개 도시를 한 번에 동시에 주문했습니다.',
    'bg-warning text-dark'
  );
  log(`[병렬 주문] Promise.all([서울, 도쿄, 뉴욕, 런던, 파리]) 동시 시작!`);

  const startTime = performance.now();

  try {
    // 5개의 fetch 작업을 동시에 출발시킴 (배열 생성)
    const promises = cityKeys.map((key) => fetchCityWeather(key));

    // Promise.all로 5개의 진동벨이 모두 울릴 때까지 한 번만 await
    const results = await Promise.all(promises);
    const duration = (performance.now() - startTime).toFixed(0);

    setBuzzerState(
      'fulfilled',
      '✅ 5개 도시 일괄 수령 성공! (Fulfilled)',
      `총 소요 시간: 단 ${duration}ms (직렬 실행 대비 압도적 단축)`,
      'bg-success'
    );
    log(`[일괄 완료] 5개 도시 날씨를 병렬로 ${duration}ms 만에 전부 수령 완료!`);

    resultGrid.innerHTML = results.map(item => `
      <div class="col">
        <div class="card p-2 shadow-none border bg-light">
          <div class="small fw-semibold text-truncate">${item.city.split(' ')[0]}</div>
          <div class="h5 fw-bold text-primary my-1">${item.temperature}℃</div>
          <div class="small text-muted">${item.humidity}%</div>
        </div>
      </div>
    `).join('');
    weatherResult.classList.remove('d-none');

  } catch (error) {
    setBuzzerState('rejected', '❌ 동시 주문 실패', error.message, 'bg-danger');
    log(`[오류 발생] ${error.message}`);
  }
});
