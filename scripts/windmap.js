// Include Leaflet-Velocity Library
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

        // Prepare data for Leaflet-Velocity
        const windSpeed = windData.hourly.windspeed_10m;
        const windDirection = windData.hourly.winddirection_10m;
        const lat = 37;
        const lon = -122;

        const uData = windSpeed.map((speed, i) => speed * Math.cos((windDirection[i] * Math.PI) / 180));
        const vData = windSpeed.map((speed, i) => speed * Math.sin((windDirection[i] * Math.PI) / 180));

        // Remove old wind layer
        if (windLayer) {
            map.removeLayer(windLayer);
        }

        // Create new Wind Layer using Leaflet-Velocity
        windLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Global Wind",
                position: "bottomleft",
                emptyString: "No wind data",
                angleConvention: "from",
                showDirectionLabel: true
            },
            data: {
                u: uData,
                v: vData,
                lat: lat,
                lon: lon
            }
        });

        windLayer.addTo(map);
        console.log("✅ Wind Overlay Updated Successfully!");
    } catch (error) {
        console.error("⚠️ Wind Overlay Update Failed:", error);
    }
}

// Refresh Wind Overlay Every 10 Minutes
updateWindOverlay();
setInterval(updateWindOverlay, 600000);
