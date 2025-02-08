// Ensure Leaflet is loaded before defining the map
if (typeof L === 'undefined') {
    console.error("Leaflet is not loaded.");
} else {
    console.log("Leaflet loaded successfully.");
}

// Initialize map only if not already defined
if (typeof map === 'undefined') {
    var map = L.map('map').setView([37, -122], 5);
}

// Set up OpenTopoMap
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '© OpenTopoMap contributors'
}).addTo(map);

// Function to update wind overlay
async function updateWindOverlay() {
    console.log("Fetching Wind Data...");

    try {
        let response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto");
        let data = await response.json();

        console.log("Wind Data Received:", data);

        if (!data || !data.hourly || !data.hourly.windspeed_10m || !data.hourly.winddirection_10m) {
            console.error("Invalid wind data format received.");
            return;
        }

        console.log("Processing Wind Data for Overlay...");

        // Convert API wind data to Leaflet-Velocity format
        let uComponent = {
            header: { parameterCategory: 2, parameterNumber: 2, dx: 0.5, dy: 0.5, lo1: -125, la1: 35, nx: 11, ny: 9 },
            data: data.hourly.windspeed_10m.map((speed, i) => speed * Math.cos(data.hourly.winddirection_10m[i] * Math.PI / 180))
        };

        let vComponent = {
            header: { parameterCategory: 2, parameterNumber: 3, dx: 0.5, dy: 0.5, lo1: -125, la1: 35, nx: 11, ny: 9 },
            data: data.hourly.windspeed_10m.map((speed, i) => speed * Math.sin(data.hourly.winddirection_10m[i] * Math.PI / 180))
        };

        console.log("Checking Data Lengths: uComp=", uComponent.data.length, " vComp=", vComponent.data.length, " Expected=", data.hourly.windspeed_10m.length);
        console.log("Wind Data Structure Before Passing to Leaflet-Velocity:", { uComponent, vComponent });

        // Ensure Leaflet-Velocity is available
        if (typeof L.velocityLayer === 'undefined') {
            console.error("Leaflet-Velocity is not loaded.");
            return;
        }

        var velocityLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Global Wind",
                position: "bottomleft",
                emptyString: "No wind data"
            },
            data: { uComponent, vComponent }
        });

        velocityLayer.addTo(map);
        console.log("Wind Overlay Updated Successfully!");

    } catch (error) {
        console.error("Error fetching wind data:", error);
    }
}

// Call function to update wind overlay
updateWindOverlay();
