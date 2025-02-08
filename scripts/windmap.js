// Initialize the Leaflet map
const map = L.map("windMap", {
    center: [37, -122], 
    zoom: 5,
    zoomControl: false,
    preferCanvas: true,
    maxZoom: 10,
    minZoom: 3
}).setView([37, -122], 5);

// Add OpenStreetMap Tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 10
}).addTo(map);

// Function to fetch and visualize wind data
async function updateWindMap() {
    try {
        console.log("Fetching Wind Data...");
        const windResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto"
        );
        const windData = await windResponse.json();
        console.log("✅ Wind Data Received:", windData);

        const windSpeedArray = windData.hourly.windspeed_10m;
        const windDirectionArray = windData.hourly.winddirection_10m;

        if (!windSpeedArray || windSpeedArray.length === 0) {
            console.error("❌ Wind Speed Data Missing!");
            return;
        }

        if (!windDirectionArray || windDirectionArray.length === 0) {
            console.error("❌ Wind Direction Data Missing!");
            return;
        }

        // Extract latest data
        const windSpeed = windSpeedArray[0];
        const windDirection = windDirectionArray[0];

        console.log(`✅ Wind Speed: ${windSpeed} km/h, Direction: ${windDirection}°`);

        // Remove old markers
        map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) {
                map.removeLayer(layer);
            }
        });

        // Add a marker for wind data
        L.circleMarker([37, -122], {
            radius: windSpeed / 3,
            color: `hsl(${240 - windSpeed * 10}, 100%, 50%)`,
            fillOpacity: 0.7,
        }).addTo(map)
        .bindPopup(`💨 Wind: ${windSpeed} km/h<br>🧭 Direction: ${windDirection}°`);

        console.log("✅ Wind Map Updated Successfully!");
    } catch (error) {
        console.error("⚠️ Wind map update failed:", error);
    }
}

// Run updates every 10 minutes
updateWindMap();
setInterval(updateWindMap, 600000);

