const API_KEY = "1896b38d2fe1d2d36da39d2475ef3fa6"; // Replace with your actual OpenWeatherMap API key

// Map state
let map;
let marker;

// World Clock state
const timezoneSelect = document.getElementById("timezone-select");
const clockDiv = document.getElementById("clock");

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  updateClock(); // Initial clock update
  setInterval(updateClock, 1000); // Update clock every second
});

timezoneSelect.addEventListener("change", updateClock);

document.getElementById("getLocationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoordinates(lat, lon);
      },
      error => {
        alert("Location access denied or unavailable.");
      }
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
});

function initMap() {
  map = L.map('map').setView([51.505, -0.09], 2); // Default view
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

function updateClock() {
  const timezone = timezoneSelect.value;
  const now = new Date();
  const options = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  try {
    const timeString = now.toLocaleTimeString('en-US', options);
    clockDiv.textContent = timeString;
  } catch (error) {
    console.error("Invalid timezone for clock:", timezone);
    clockDiv.textContent = "Invalid Timezone";
  }
}

function fetchWeatherByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      displayWeather(data);
      updateMap(lat, lon, data.name);
    })
    .catch(err => {
        console.error("Error fetching weather data:", err)
        document.getElementById("weatherResult").innerHTML = `<p>Could not fetch weather data.</p>`;
    });
}

function updateMap(lat, lon, locationName) {
    if (marker) {
        map.removeLayer(marker);
    }
    map.setView([lat, lon], 13);
    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${locationName}</b>`)
        .openPopup();
}

function displayWeather(data) {
  if (data.cod === 200) {
    document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
      <p>🌡 Temperature: ${data.main.temp}°C</p>
      <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon"/>
    `;
  } else {
    document.getElementById("weatherResult").innerHTML = `<p>Weather data not available for ${data.name}.</p>`;
  }
}
