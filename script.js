const apiKey = "b097b2f0d6c7369bd12a3879084b67b9"; // Replace with your OpenWeather key

function setBackground(condition) {
  const app = document.getElementById("appContainer");
  app.className = "app-container"; // Reset classes

  if (condition.includes("rain")) {
    app.classList.add("rainy");
  } else if (condition.includes("cloud")) {
    app.classList.add("cloudy");
  } else if (condition.includes("clear") || condition.includes("sun")) {
    app.classList.add("sunny");
  } else {
    app.classList.add("default");
  }
}

function displayWeather(data) {
  const iconCode = data.weather[0].icon;
  const condition = data.weather[0].main.toLowerCase();
  const localTime = new Date((data.dt + data.timezone) * 1000).toUTCString().slice(0, -7);

  document.getElementById("locationName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("dateTime").textContent = `Local time: ${localTime}`;
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("temp").textContent = data.main.temp.toFixed(1);
  document.getElementById("weather").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind.speed;

  setBackground(condition);
}

async function fetchWeather(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather data not found");
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    alert(err.message);
  }
}

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city.");
    return;
  }
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function getLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      fetchWeather(url);
    },
    () => {
      alert("Unable to retrieve your location.");
    }
  );
}
