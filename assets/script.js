// HTML References
var submitForm = document.querySelector('#submitForm');
var submitInput = document.querySelector('#submitInput');

// Global variables
const link = 'https://api.openweathermap.org';
const apiKey = `d91f911bcf2c0f925fb6535547a5ddc9`;

// day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Current weather
const currentWeather = (city, weather, timezone) => {
  // import elements
  const locationDoc = document.getElementById('locationTitle');
  const dateDoc = document.getElementById('locationDate');
  const weatherIconDoc = document.getElementById('weatherIcon');
  const tempDoc = document.getElementById('currentWeatherTemp');
  const windDoc = document.getElementById('currentWeatherWind');
  const humidityDoc = document.getElementById('currentWeatherHumidity');
  const uvDoc = document.getElementById('currentWeatherUV');
  const uvBtn = document.getElementById('uv-btn');

  // sets data to variables
  let date = dayjs().tz(timezone).format('M/D/YYYY');
  let temp = weather.temp;
  let wind = weather.wind_speed;
  let humidity = weather.humidity;
  let uv = weather.uvi;
  let icon = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  let iconDescription = weather.weather[0].description;

  // sets innerHTML to data
  locationDoc.innerHTML = city;
  dateDoc.innerHTML = date;
  tempDoc.innerHTML = temp;
  windDoc.innerHTML = wind;
  humidityDoc.innerHTML = humidity;
  uvDoc.innerHTML = uv;

  weatherIconDoc.setAttribute('src', icon);
  weatherIconDoc.setAttribute('alt', iconDescription);

  console.log('uv is: ', uv);
  // sets color of UV Index for severity
  if (uv > 11) {
    uvBtn.style.backgroundColor = 'purple';
  } else if (uv > 8 && uv < 11) {
    uvBtn.style.backgroundColor = 'red';
  } else if (uv > 6 && uv < 8) {
    uvBtn.style.backgroundColor = 'orange';
  } else if (uv > 3 && uv < 6) {
    uvBtn.style.backgroundColor = 'yellow';
  } else {
    uvBtn.style.backgroundColor = 'lightgreen';
  }
};

// Forecasted Weather
const weatherForecast = (forecast, timezone) => {
  // Day One
  const dateDoc0 = document.getElementById('locationDateDay-One');
  const weatherIconDoc0 = document.getElementById('weatherIconDay-One');
  const tempDoc0 = document.getElementById('currentWeatherTempDay-One');
  const windDoc0 = document.getElementById('currentWeatherWindDay-One');
  const humidityDoc0 = document.getElementById('currentWeatherHumidityDay-One');

  // Day Two
  const dateDoc1 = document.getElementById('locationDateDay-Two');
  const weatherIconDoc1 = document.getElementById('weatherIconDay-Two');
  const tempDoc1 = document.getElementById('currentWeatherTempDay-Two');
  const windDoc1 = document.getElementById('currentWeatherWindDay-Two');
  const humidityDoc1 = document.getElementById('currentWeatherHumidityDay-Two');
  // Day Three
  const dateDoc2 = document.getElementById('locationDateDay-Three');
  const weatherIconDoc2 = document.getElementById('weatherIconDay-Three');
  const tempDoc2 = document.getElementById('currentWeatherTempDay-Three');
  const windDoc2 = document.getElementById('currentWeatherWindDay-Three');
  const humidityDoc2 = document.getElementById(
    'currentWeatherHumidityDay-Three',
  );
  // Day Four
  const dateDoc3 = document.getElementById('locationDateDay-Four');
  const weatherIconDoc3 = document.getElementById('weatherIconDay-Four');
  const tempDoc3 = document.getElementById('currentWeatherTempDay-Four');
  const windDoc3 = document.getElementById('currentWeatherWindDay-Four');
  const humidityDoc3 = document.getElementById(
    'currentWeatherHumidityDay-Four',
  );
  // Day Five
  const dateDoc4 = document.getElementById('locationDateDay-Five');
  const weatherIconDoc4 = document.getElementById('weatherIconDay-Five');
  const tempDoc4 = document.getElementById('currentWeatherTempDay-Five');
  const windDoc4 = document.getElementById('currentWeatherWindDay-Five');
  const humidityDoc4 = document.getElementById(
    'currentWeatherHumidityDay-Five',
  );

  for (i = 0; i < 5; i++) {
    console.log('forecast test: ', forecast[i]);
    let date = dayjs()
      .tz(timezone)
      .add(i + 1, 'day')
      .format('M/D/YYYY');
    console.log('timezone test: ', date);

    dateDoc0.innerHTML = date;
    tempDoc0.innerHTML = temp;
    windDoc0.innerHTML = wind;
    humidityDoc0.innerHTML = humidity;
    weatherIconDoc0.setAttribute('src', icon);
    weatherIconDoc0.setAttribute('alt', iconDescription);
  }
};

// Sends data to functions current and forecast
const displayData = (city, data) => {
  currentWeather(city, data.current, data.timezone);
  weatherForecast(data.daily, data.timezone);
};

// Gets weather location
const getWeather = location => {
  let { lat } = location;
  let { lon } = location;
  let city = location.name;

  // fetches data and then calls functions with said data
  fetch(
    `${link}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`,
  )
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      console.log(city, data);
      displayData(city, data);
    })
    .catch(err => {
      console.log(err);
    });
};

// Checks to see if location exists in OpenWeather's database
const searchInput = name => {
  fetch(`${link}/geo/1.0/direct?q=${name}&limit=5&appid=${apiKey}`)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      if (!data[0]) {
        alert(`No location by the name ${name}`);
      } else {
        getWeather(data[0]);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

//  sets the default action that belongs to the event to not occur
defaultPrevention = e => {
  if (!submitInput.value) {
    return;
  } else {
    e.preventDefault();
    let name = submitInput.value.trim();
    searchInput(name);
    searchInput.value = '';
  }
};

// takes everything in submitForm and runs it through defaultPrevention to preventDefault and send data of userInput onwards
submitForm.addEventListener('submit', defaultPrevention);
