// Load Windy-Style Wind Visualization Using Leaflet-Velocity
let map = L.map("windMap", {
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

// Wind Overlay Variable
let windLayer;

// Function to Fetch and Render Wind Data
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

        // Extract wind speed and direction arrays
        const windSpeedArray = windData.hourly.windspeed_10m;
        const windDirectionArray = windData.hourly.winddirection_10m;

        // Set a fixed grid for visualization
        const latStart = 36.5, latEnd = 38.5, lonStart = -123.5, lonEnd = -121.5;
        const gridStep = 0.5;
        let gridData = [];

        // Generate wind grid points
        for (let lat = latStart; lat <= latEnd; lat += gridStep) {
            for (let lon = lonStart; lon <= lonEnd; lon += gridStep) {
                const randomIndex = Math.floor(Math.random() * windSpeedArray.length);
                const windSpeed = windSpeedArray[randomIndex];
                const windDir = windDirectionArray[randomIndex];

                // Convert to U/V components
                const u = windSpeed * Math.cos((windDir * Math.PI) / 180);
                const v = windSpeed * Math.sin((windDir * Math.PI) / 180);

                gridData.push({ lat, lon, u, v });
            }
        }

        // Format data properly for Leaflet-Velocity
        const velocityData = {
            data: [
                {
                    header: { parameterNumberName: "eastward_wind", dx: gridStep, dy: gridStep, lo1: lonStart, la1: latStart },
                    data: gridData.map((point) => point.u)
                },
                {
                    header: { parameterNumberName: "northward_wind", dx: gridStep, dy: gridStep, lo1: lonStart, la1: latStart },
                    data: gridData.map((point) => point.v)
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

// Update Wind Overlay Every 10 Minutes
updateWindOverlay();
setInterval(updateWindOverlay, 600000);
