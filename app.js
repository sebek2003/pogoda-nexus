// =========================
// WEATHER NEON X
// =========================

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

const hourlyEl = document.getElementById("hourlyForecast");
const dailyEl = document.getElementById("dailyForecast");

const themeBtn = document.getElementById("themeBtn");
const searchBtn = document.getElementById("searchBtn");
const citySearch = document.getElementById("citySearch");

const modal = document.getElementById("hourModal");
const modalInfo = document.getElementById("modalInfo");
const modalHour = document.getElementById("modalHour");
const closeModal = document.getElementById("closeModal");

let weatherData = null;
let currentLat = 53.1325;
let currentLon = 23.1688;
let currentCityName = "Białystok";

// =========================
// STARS
// =========================

const starsContainer = document.getElementById("stars");

if (starsContainer) {
    for (let i = 0; i < 180; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        starsContainer.appendChild(star);
    }
}

// =========================
// THEME
// =========================

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    if (themeBtn) themeBtn.textContent = "☀️";
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");
        if (document.body.classList.contains("light")) {
            localStorage.setItem("theme", "light");
            themeBtn.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "dark");
            themeBtn.textContent = "🌙";
        }
    });
}

// =========================
// MODAL
// =========================

if (closeModal) {
    closeModal.addEventListener("click", () => {
        modal.classList.remove("active");
    });
}

if (modal) {
    modal.addEventListener("click", e => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
}

// =========================
// WEATHER ICONS SVG
// =========================

function iconSVG(type) {
    switch (type) {
        case "sun":
            return `
            <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="#FFD54A">
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 100 100"
                        to="360 100 100"
                        dur="20s"
                        repeatCount="indefinite"/>
                </circle>
            </svg>
            `;
        case "cloud":
            return `
            <svg viewBox="0 0 200 200">
                <g>
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="-4 0;4 0;-4 0"
                        dur="5s"
                        repeatCount="indefinite"/>
                    <ellipse cx="100" cy="105" rx="55" ry="30" fill="#cbd5e1"/>
                    <ellipse cx="75" cy="90" rx="30" ry="25" fill="#cbd5e1"/>
                    <ellipse cx="125" cy="88" rx="35" ry="28" fill="#cbd5e1"/>
                </g>
            </svg>
            `;
        case "rain":
            return `
            <svg viewBox="0 0 200 200">
                <ellipse cx="100" cy="85" rx="55" ry="30" fill="#cbd5e1"/>
                <ellipse cx="70" cy="72" rx="25" ry="22" fill="#cbd5e1"/>
                <ellipse cx="130" cy="72" rx="28" ry="24" fill="#cbd5e1"/>
                <g fill="#60a5fa">
                    <circle cx="80" cy="130" r="5">
                        <animate attributeName="cy" values="120;155;120" dur="1.2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="100" cy="135" r="5">
                        <animate attributeName="cy" values="125;160;125" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="120" cy="130" r="5">
                        <animate attributeName="cy" values="120;155;120" dur="1.4s" repeatCount="indefinite"/>
                    </circle>
                </g>
            </svg>
            `;
        case "storm":
            return `
            <svg viewBox="0 0 200 200">
                <ellipse cx="100" cy="85" rx="55" ry="30" fill="#9ca3af"/>
                <polygon points="95,105 120,105 103,135 125,135 85,180 100,145 80,145" fill="#FFD54A">
                    <animate
                        attributeName="opacity"
                        values="1;.3;1"
                        dur=".8s"
                        repeatCount="indefinite"/>
                </polygon>
            </svg>
            `;
        default:
            return `
            <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="40" fill="#FFD54A"/>
            </svg>
            `;
    }
}

// =========================
// WEATHER INTERPRETATION
// =========================

function getWeatherInfo(code) {
    if (code === 0) {
        return { name: "Słonecznie", icon: "sun" };
    }
    if ([1, 2, 3].includes(code)) {
        return { name: "Zachmurzenie", icon: "cloud" };
    }
    if ([61, 63, 65, 80, 81, 82].includes(code)) {
        return { name: "Deszcz", icon: "rain" };
    }
    if (code >= 95) {
        return { name: "Burza", icon: "storm" };
    }
    return { name: "Pogoda", icon: "sun" };
}

// =========================
// SHOW HOUR (MODAL)
// =========================

function showHour(i) {
    if (!weatherData) return;

    const hour = new Date(weatherData.hourly.time[i]);

    if (modalHour) {
        modalHour.textContent = hour.getHours() + ":00";
    }

    if (modalInfo) {
        modalInfo.innerHTML = `
            <div class="modal-row">
                <span>🌡️ Temperatura</span>
                <span>${Math.round(weatherData.hourly.temperature_2m[i])}°C</span>
            </div>
            <div class="modal-row">
                <span>🤔 Odczuwalna</span>
                <span>${Math.round(weatherData.hourly.apparent_temperature[i])}°C</span>
            </div>
            <div class="modal-row">
                <span>💧 Wilgotność</span>
                <span>${weatherData.hourly.relative_humidity_2m[i]}%</span>
            </div>
            <div class="modal-row">
                <span>💨 Wiatr</span>
                <span>${Math.round(weatherData.hourly.wind_speed_10m[i])} km/h</span>
            </div>
            <div class="modal-row">
                <span>☔ Opady</span>
                <span>${weatherData.hourly.precipitation[i]} mm</span>
            </div>
        `;
    }

    if (modal) {
        modal.classList.add("active");
    }
}

// Umożliwienie wywołania funkcji z poziomu atrybutu "onclick" w HTML
window.showHour = showHour;

// =========================
// LOAD WEATHER
// =========================

async function loadWeather(
    lat = 53.1325,
    lon = 23.1688,
    cityName = "Białystok"
) {
    currentLat = lat;
    currentLon = lon;
    currentCityName = cityName;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=7&timezone=auto`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        weatherData = data;

        const weather = getWeatherInfo(data.current.weather_code);

        if (cityEl) cityEl.textContent = cityName;
        if (tempEl) tempEl.textContent = Math.round(data.current.temperature_2m) + "°";
        if (descEl) descEl.textContent = weather.name;
        if (humidityEl) humidityEl.textContent = data.current.relative_humidity_2m;
        if (windEl) windEl.textContent = Math.round(data.current.wind_speed_10m);
       document.getElementById("sunrise").textContent =
new Date(data.daily.sunrise[0])
.toLocaleTimeString("pl-PL",{
    hour:"2-digit",
    minute:"2-digit"
});

document.getElementById("sunset").textContent =
new Date(data.daily.sunset[0])
.toLocaleTimeString("pl-PL",{
    hour:"2-digit",
    minute:"2-digit"
});
        const weatherIconEl = document.getElementById("weatherIcon");
        if (weatherIconEl) {
            weatherIconEl.innerHTML = iconSVG(weather.icon);
        }

        // HOURLY FORECAST
        if (hourlyEl) {
            hourlyEl.innerHTML = "";
            const currentHourIndex = new Date().getHours();

            for (let i = currentHourIndex; i < currentHourIndex + 24; i++) {
                const info = getWeatherInfo(data.hourly.weather_code[i]);
                const hour = new Date(data.hourly.time[i]);
                const sunsetHour =
new Date(data.daily.sunset[0]).getHours();

const sunriseHour =
new Date(data.daily.sunrise[0]).getHours();

let isNight =
hour.getHours() >= sunsetHour ||
hour.getHours() < sunriseHour;
                const today = new Date();

                const dayDiff = Math.floor(
                    (new Date(hour.getFullYear(), hour.getMonth(), hour.getDate()) -
                     new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000
                );
                
                let dayLabel = "";
                if (dayDiff === 0) {
                    dayLabel = "Dzisiaj";
                } else if (dayDiff === 1) {
                    dayLabel = "Jutro";
                } else {
                    dayLabel = ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sb"][hour.getDay()];
                }

                hourlyEl.innerHTML += `
                <div class="hour-card" onclick="showHour(${i})">
                    <div class="hour-time">${dayLabel}</div>
                    <div style="font-size:12px; opacity:.7; margin-top:4px;">
                        ${hour.getHours()}:00
                    </div>
                    <div class="hour-icon">
                        ${isNight ? "🌙" :
info.icon === "sun" ? "☀️" :
info.icon === "cloud" ? "☁️" :
info.icon === "rain" ? "🌧️" : "⛈️"}
                    </div>
                    <div class="hour-temp">
                        ${Math.round(data.hourly.temperature_2m[i])}°
                    </div>
                </div>
                `;
            }
        }

        // DAILY FORECAST
        if (dailyEl) {
            dailyEl.innerHTML = "";
            const days = ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sb"];

            for (let i = 0; i < 7; i++) {
                const day = new Date(data.daily.time[i]);
                const info = getWeatherInfo(data.daily.weather_code[i]);

                dailyEl.innerHTML += `
                <div class="day-card">
                    <div class="day-name">${days[day.getDay()]}</div>
                    <div class="day-icon">
                        ${info.icon === "sun" ? "☀️" : info.icon === "cloud" ? "☁️" : info.icon === "rain" ? "🌧️" : "⛈️"}
                    </div>
                    <div class="day-max">${Math.round(data.daily.temperature_2m_max[i])}°</div>
                    <div class="day-min">${Math.round(data.daily.temperature_2m_min[i])}°</div>
                </div>
                `;
            }
        }
    } catch (err) {
        console.error("Błąd podczas pobierania pogody:", err);
    }
}

// =========================
// SEARCH
// =========================

async function searchCity() {
    if (!citySearch) return;
    const query = citySearch.value.trim();
    if (!query) return;

    try {
        const geo = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=50&language=pl&format=json`
        );
        const data =
await geo.json();

console.log(data);

        if (!data.results?.length) {
            alert("Nie znaleziono lokalizacji");
            return;
        }

        if (data.results.length === 1) {
            const city = data.results[0];
            loadWeather(city.latitude, city.longitude, city.name);
            return;
        }

        let text = "Wybierz lokalizację:\n\n";
        data.results.slice(0, 15).forEach((city, index) => {
            text += `${index + 1}. ${city.name}${city.admin1 ? ", " + city.admin1 : ""}${city.country ? ", " + city.country : ""}\n`;
        });

        const selected = parseInt(prompt(text));
        if (isNaN(selected) || selected < 1 || selected > Math.min(data.results.length, 15)) {
            return;
        }

        const city = data.results[selected - 1];
        loadWeather(city.latitude, city.longitude, city.name);
    } catch (err) {
        console.error("Błąd podczas wyszukiwania miasta:", err);
    }
}

if (searchBtn) {
    searchBtn.addEventListener("click", searchCity);
}

if (citySearch) {
    citySearch.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            searchCity();
        }
    });
}

function refreshLocation(){

    navigator.geolocation.getCurrentPosition(

        async position => {

            const lat =
            position.coords.latitude;

            const lon =
            position.coords.longitude;

            console.log(
                "LAT:", lat,
                "LON:", lon,
                "ACCURACY:", position.coords.accuracy
            );

            try{

                const geo =
                await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
                );

                const data =
                await geo.json();

                const cityName =
                data.address.village ||
                data.address.hamlet ||
                data.address.suburb ||
                data.address.town ||
                data.address.city ||
                data.display_name.split(",")[0];

                loadWeather(
                    lat,
                    lon,
                    cityName
                );

            }catch(error){

                console.log(error);

                loadWeather(
                    lat,
                    lon,
                    "Moja lokalizacja"
                );
            }

        },

        error => {

            console.log(error);

            loadWeather();
        },

        {
            enableHighAccuracy:true,
            timeout:15000,
            maximumAge:0
        }
    );
}

refreshLocation();

// =========================
// AUTO REFRESH 5 MIN
// =========================

setInterval(() => {

    refreshLocation();

}, 300000);