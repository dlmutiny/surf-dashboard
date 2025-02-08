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

// Force a tile refresh to fix missing sections
map.on("load", function () {
    setTimeout(() => {
        map.invalidateSize();
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                layer.redraw();
            }
        });
    }, 1000);
});

// Fetch and visualize wind data
async function updateWindMap() {
    console.log("Updating Wind Map...");
    try {
        // Fetch Marine Data (Wave Height & Wave Period)
        const marineResponse = await fetch(
            "https://marine-api.open-meteo.com/v1/marine?latitude=37&longitude=-122&hourly=wave_height,wave_period&timezone=auto"
        );
        const marineData = await marineResponse.json();

        // Fetch Wind Data Separately from Weather API
        const windResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto"
        );
        const windData = await windResponse.json();

        if (!marineData.hourly || !marineData.hourly.wave_height) {
            console.error("❌ Wave height data is missing!");
            return;
        }

        if (!windData.hourly || !windData.hourly.windspeed_10m) {
            console.error("❌ Wind data is missing!");
            return;
        }

        // Extract Wind Data
        const windSpeed = windData.hourly.windspeed_10m[0]; // Latest wind speed
        const windDirection = windData.hourly.winddirection_10m[0]; // Latest wind direction

        // Add Wind Visualization (Remove Old Markers First)
        map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) {
                map.removeLayer(layer);
            }
        });

        // Add a marker for wind direction
        L.circleMarker([37, -122], {
            radius: windSpeed / 3,
            color: `hsl(${240 - windSpeed * 10}, 100%, 50%)`,
            fillOpacity: 0.7,
        }).addTo(map)
        .bindPopup(`💨 Wind: ${windSpeed} km/h<br>🧭 Direction: ${windDirection}°`);
        console.log("Wind Map Updated Successfully!");

    } catch (error) {
        console.error("⚠️ Wind map update failed:", error);
    }
}

// Initial wind map load and update every 10 minutes
updateWindMap();
setInterval(updateWindMap, 600000);
