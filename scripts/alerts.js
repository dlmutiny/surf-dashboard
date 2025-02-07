async function checkSurfSpots() {
    // Fetch marine data (wave height & period)
const marineResponse = await fetch(
    "https://marine-api.open-meteo.com/v1/marine?latitude=37&longitude=-122&hourly=wave_height,wave_period&timezone=auto"
);
const marineData = await marineResponse.json();

// Fetch wind data from Open-Meteo Weather API
const windResponse = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto"
);
const windData = await windResponse.json();

// Extract wave data
const waveHeight = marineData.hourly?.wave_height || [];
const wavePeriod = marineData.hourly?.wave_period || [];

// Extract wind data
const windSpeed = windData.hourly?.windspeed_10m || [];
const windDirection = windData.hourly?.winddirection_10m || [];

    const data = await response.json();
    if (!data.hourly || !data.hourly.wave_height) return;

    let alerts = [];
    if (data.hourly.wave_height[0] > 5) alerts.push("🔥 Good waves at Steamer Lane!");
    if (data.hourly.wind_speed[0] < 10) alerts.push("💨 Light offshore wind - clean conditions!");

    document.getElementById("alertBox").innerHTML = alerts.join("<br>");
}

checkSurfSpots();
setInterval(checkSurfSpots, 600000);
