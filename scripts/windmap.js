import "leaflet-velocity"; // Wind visualization plugin

const map = L.map("windMap", {
    center: [37, -122], 
    zoom: 5,
    zoomControl: false,
    preferCanvas: true,
    maxZoom: 10,
    minZoom: 3
}).setView([37, -122], 5);

// Add OpenStreetMap Tiles as Base
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 10
}).addTo(map);

// Add Heatmap Overlay (Temperature from OpenWeather)
const heatmapLayer = L.tileLayer(
    "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_OPENWEATHER_API_KEY",
    {
        attribution: "&copy; OpenWeatherMap",
        opacity: 0.5
    }
).addTo(map);

// Wind Velocity Layer (for Windy-Style Overlays)
let windLayer;

async function updateWindOverlay() {
    try {
        console.log("Fetching Wind Data...");
        const windResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto"
        );
        const windData = await windResponse.json();
        console.log("✅ Wind Data Received:", windData);

        if (!windData.hourly || !windData.hourly.windspeed_10m) {
            console.error("❌ Wind Data Missing!");
            return;
        }

        // Convert API Data to Leaflet Velocity Format
        const windSpeed = windData.hourly.windspeed_10m;
        const windDirection = windData.hourly.winddirection_10m;
        const numPoints = windSpeed.length;

        const windArray = [];
        for (let i = 0; i < numPoints; i++) {
            windArray.push({
                lat: 37,
                lon: -122,
                u: windSpeed[i] * Math.cos((windDirection[i] * Math.PI) / 180),
                v: windSpeed[i] * Math.sin((windDirection[i] * Math.PI) / 180)
            });
        }

        console.log("✅ Wind Data Processed for Overlay");

        // Remove existing Wind Layer if present
        if (windLayer) {
            map.removeLayer(windLayer);
        }

        // Create Wind Layer
        windLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Wind",
                position: "bottomleft",
                emptyString: "No wind data",
                angleConvention: "from",
                showDirectionLabel: true
            },
            data: {
                u: windSpeed.map((ws, i) => ws * Math.cos((windDirection[i] * Math.PI) / 180)),
                v: windSpeed.map((ws, i) => ws * Math.sin((windDirection[i] * Math.PI) / 180)),
                lat: 37,
                lon: -122
            }
        }).addTo(map);

        console.log("✅ Wind Overlay Updated Successfully!");
    } catch (error) {
        console.error("⚠️ Wind Overlay Update Failed:", error);
    }
}

// Update Wind Overlay Every 10 Minutes
updateWindOverlay();
setInterval(updateWindOverlay, 600000);
