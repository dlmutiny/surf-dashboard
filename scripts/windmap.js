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

        // Extract wind speed and direction arrays
        const windSpeedArray = windData.hourly.windspeed_10m;
        const windDirectionArray = windData.hourly.winddirection_10m;

        // Define Grid
        const latStart = 35.0, latEnd = 39.0, lonStart = -125.0, lonEnd = -120.0;
        const gridStep = 0.5;
        let uComp = [], vComp = [], gridData = [];

        // Generate wind grid
        for (let lat = latStart; lat <= latEnd; lat += gridStep) {
            for (let lon = lonStart; lon <= lonEnd; lon += gridStep) {
                const index = Math.floor(Math.random() * windSpeedArray.length);
                const windSpeed = windSpeedArray[index];
                const windDir = windDirectionArray[index];

                // Convert wind speed and direction to U/V components
                const u = windSpeed * Math.cos((windDir * Math.PI) / 180);
                const v = windSpeed * Math.sin((windDir * Math.PI) / 180);

                uComp.push(u);
                vComp.push(v);
                gridData.push({ lat, lon, u, v });
            }
        }

        // Format data for Leaflet-Velocity
        const velocityData = {
            uComponent: {
                header: { parameterCategory: 2, parameterNumber: 2, dx: gridStep, dy: gridStep, lo1: lonStart, la1: latStart },
                data: uComp
            },
            vComponent: {
                header: { parameterCategory: 2, parameterNumber: 3, dx: gridStep, dy: gridStep, lo1: lonStart, la1: latStart },
                data: vComp
            }
        };

        // Remove old wind layer if present
        if (windLayer) {
            map.removeLayer(windLayer);
        }

        // Create Wind Layer using Leaflet-Velocity
        windLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Global Wind",
                position: "bottomleft",
                emptyString: "No wind data",
                angleConvention: "from",
                showDirectionLabel: true
            },
            data: velocityData,
            minVelocity: 0,
            maxVelocity: 50,
            velocityScale: 0.01
        }).addTo(map);

        console.log("✅ Wind Overlay Updated Successfully!");
    } catch (error) {
        console.error("⚠️ Wind Overlay Update Failed:", error);
    }
}

// Refresh Wind Overlay Every 10 Minutes
updateWindOverlay();
setInterval(updateWindOverlay, 600000);
