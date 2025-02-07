const map = L.map("windMap", { center: [37, -122], zoom: 5 });

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "© ESRI"
}).addTo(map);

async function updateWindMap() {
    try {
        const marineResponse = await fetch(
    "https://marine-api.open-meteo.com/v1/marine?latitude=37&longitude=-122&hourly=wave_height,wave_period&timezone=auto"
);
const marineData = await marineResponse.json();

const windResponse = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto"
);
const windData = await windResponse.json();

// Extract marine data
const waveHeight = marineData.hourly?.wave_height || [];
const wavePeriod = marineData.hourly?.wave_period || [];

// Extract wind data
const windSpeed = windData.hourly?.windspeed_10m || [];
const windDirection = windData.hourly?.winddirection_10m || [];

        const data = await response.json();
        if (!data.hourly || !data.hourly.wind_speed) return;

        map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) map.removeLayer(layer);
        });

        data.hourly.wind_speed.forEach((speed, i) => {
            let lat = 37 + (Math.random() * 5 - 2.5);
            let lon = -122 + (Math.random() * 5 - 2.5);
            L.circleMarker([lat, lon], { radius: speed / 3, color: `hsl(${240 - speed * 10}, 100%, 50%)`, fillOpacity: 0.7 }).addTo(map);
        });

    } catch (error) {
        console.error("Wind map update failed:", error);
    }
}

updateWindMap();
setInterval(updateWindMap, 600000);
