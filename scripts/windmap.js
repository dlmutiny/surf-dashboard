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

        // Extract wind data
        const windSpeedArray = windData.hourly.windspeed_10m;
        const windDirectionArray = windData.hourly.winddirection_10m;
        const lat = 37;
        const lon = -122;

        // Structure the wind data correctly for Leaflet-Velocity
        const velocityData = {
            data: [
                {
                    header: { parameterNumberName: "eastward_wind", dx: 0.1, dy: 0.1, lo1: lon, la1: lat },
                    data: windSpeedArray.map((speed, i) => speed * Math.cos((windDirectionArray[i] * Math.PI) / 180))
                },
                {
                    header: { parameterNumberName: "northward_wind", dx: 0.1, dy: 0.1, lo1: lon, la1: lat },
                    data: windSpeedArray.map((speed, i) => speed * Math.sin((windDirectionArray[i] * Math.PI) / 180))
                }
            ]
        };

        // Remove old wind layer if present
        if (windLayer) {
            map.removeLayer(windLayer);
        }

        // Create Wind Layer using Leaflet-Velocity
        windLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Wind",
                position: "bottomleft",
                emptyString: "No wind data",
                angleConvention: "from",
                showDirectionLabel: true
            },
            data: velocityData,
            minVelocity: 0,
            maxVelocity: 50,
            velocityScale: 0.005
        }).addTo(map);

        console.log("✅ Wind Overlay Updated Successfully!");
    } catch (error) {
        console.error("⚠️ Wind Overlay Update Failed:", error);
    }
}

// Refresh Wind Overlay Every 10 Minutes
updateWindOverlay();
setInterval(updateWindOverlay, 600000);
