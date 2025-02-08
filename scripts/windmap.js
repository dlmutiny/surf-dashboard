let map; // Global map variable

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded. Initializing map...");

    // Initialize Leaflet Map
    map = L.map("windMap").setView([37, -122], 5);
    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png").addTo(map);

    console.log("Map initialized successfully.");

    // Fetch wind data and update overlay
    updateWindOverlay();
});

async function updateWindOverlay() {
    console.log("Fetching Wind Data...");

    if (!map) {
        console.error("Map is not initialized yet!");
        return;
    }

    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=wind_speed_10m,winddirection_10m&timezone=auto");
        const data = await response.json();
        console.log("Wind Data Received:", data);

        if (!data.hourly || !data.hourly.wind_speed_10m || !data.hourly.winddirection_10m) {
            console.error("Invalid wind data format:", data);
            return;
        }

        // Convert wind speed & direction into u and v components
        const uData = data.hourly.wind_speed_10m.map((speed, i) => 
            parseFloat((speed * Math.cos(data.hourly.winddirection_10m[i] * Math.PI / 180)).toFixed(2))
        );

        const vData = data.hourly.wind_speed_10m.map((speed, i) => 
            parseFloat((speed * Math.sin(data.hourly.winddirection_10m[i] * Math.PI / 180)).toFixed(2))
        );

        // Ensure arrays are properly formatted
        if (!Array.isArray(uData) || !Array.isArray(vData)) {
            console.error("❌ Wind component data is NOT an array:", { uData, vData });
            return;
        }

        const windData = {
            uComponent: {
                header: { parameterCategory: 2, parameterNumber: 2, dx: 0.5, dy: 0.5, lo1: -125, la1: 35, nx: 11, ny: 9 },
                data: Array.from(uData) // Ensure it's an array
            },
            vComponent: {
                header: { parameterCategory: 2, parameterNumber: 3, dx: 0.5, dy: 0.5, lo1: -125, la1: 35, nx: 11, ny: 9 },
                data: Array.from(vData) // Ensure it's an array
            }
        };

        console.log("Processing Wind Data for Overlay...");
        console.log("Wind Data Structure Before Passing to Leaflet-Velocity:", windData);

        // Ensure Leaflet-Velocity is properly loaded
        if (typeof L.velocityLayer !== "function") {
            console.error("❌ Leaflet-Velocity is NOT loaded correctly.");
            return;
        }

        // Remove previous wind layers before adding a new one
        if (window.currentWindLayer) {
            map.removeLayer(window.currentWindLayer);
        }

        // Add wind layer
        window.currentWindLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Global Wind",
                position: "bottomleft",
                emptyString: "No wind data"
            },
            data: windData
        });

        window.currentWindLayer.addTo(map);
        console.log("✅ Wind Overlay Updated Successfully!");

    } catch (error) {
        console.error("❌ Error fetching wind data:", error);
    }
}
