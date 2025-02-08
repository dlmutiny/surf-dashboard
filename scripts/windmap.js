document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM fully loaded. Initializing map...");

    // Initialize the map
    var map = L.map('windMap').setView([37.5, -122.5], 6);
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a> contributors'
    }).addTo(map);

    console.log("Map initialized successfully.");

    // Function to fetch wind data
    async function fetchWindData() {
        console.log("Fetching Wind Data...");
        try {
            const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37.5&longitude=-122.5&hourly=windspeed_10m,winddirection_10m&timezone=auto");
            const data = await response.json();
            console.log("Wind Data Received:", data);
            return data;
        } catch (error) {
            console.error("Error fetching wind data:", error);
        }
    }

    // Function to update wind overlay
    async function updateWindOverlay() {
        console.log("Processing Wind Data for Overlay...");
        const windData = await fetchWindData();
        
        if (!windData || !windData.hourly) {
            console.error("Invalid wind data structure:", windData);
            return;
        }

        // Example transformation of API data into Leaflet-Velocity format
        let uComponent = {
            header: {
                parameterCategory: 2,
                parameterNumber: 2,
                dx: 0.5,
                dy: 0.5,
                lo1: -125,
                la1: 35,
                nx: 11,
                ny: 9
            },
            data: windData.hourly.windspeed_10m.map(speed => speed / 3.6) // Convert km/h to m/s
        };

        let vComponent = {
            header: {
                parameterCategory: 2,
                parameterNumber: 3,
                dx: 0.5,
                dy: 0.5,
                lo1: -125,
                la1: 35,
                nx: 11,
                ny: 9
            },
            data: windData.hourly.winddirection_10m.map(direction => direction) // Just passing the direction
        };

        console.log("Checking Data Lengths: uComp=" + uComponent.data.length + " vComp=" + vComponent.data.length + " Expected=" + windData.hourly.time.length);
        
        if (!Array.isArray(uComponent.data) || !Array.isArray(vComponent.data)) {
            console.error("Wind data is not an array:", { uComponent, vComponent });
            return;
        }

        console.log("Wind Data Structure Before Passing to Leaflet-Velocity:", { uComponent, vComponent });

        let velocityLayer = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Wind",
                position: "bottomleft",
                emptyString: "No wind data"
            },
            data: {
                uComponent,
                vComponent
            },
            maxVelocity: 15
        });

        map.addLayer(velocityLayer);
        console.log("Wind Overlay Updated Successfully!");
    }

    updateWindOverlay();
});
