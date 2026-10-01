# OpenWeather FastAPI 비동기 실습

FastAPI와 OpenWeather API를 이용해 날씨 정보를 조회하면서  
JavaScript의 비동기 처리 방식인 **Promise(.then)**, **async/await**, **Promise.all()**을 연습하는 프로젝트입니다.

브라우저가 OpenWeather API를 직접 호출하지 않고,

```text
브라우저
↓
FastAPI
↓
OpenWeather API
↓
FastAPI
↓
브라우저