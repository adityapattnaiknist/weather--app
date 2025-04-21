const API_KEY = "1896b38d2fe1d2d36da39d2475ef3fa6"; // Replace with your actual OpenWeatherMap API key

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

function fetchWeatherByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(err => console.error(err));
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
    document.getElementById("weatherResult").innerHTML = `<p>Weather data not available.</p>`;
  }
}
