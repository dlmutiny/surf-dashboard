document.addEventListener("DOMContentLoaded", function () {
    console.log("Fetching Wind Data...");
    fetch("https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto")
        .then(response => response.json())
        .then(data => {
            console.log("Wind Data Received:", data);
            updateWindOverlay(data);
        })
        .catch(error => console.error("Error fetching wind data:", error));
});

async function updateWindOverlay(data) {
    console.log("Processing Wind Data for Overlay...");
    
    const uComponent = {
        "header": {
            "parameterCategory": 2,
            "parameterNumber": 2,
            "dx": 0.5,
            "dy": 0.5,
            "lo1": -125,
            "la1": 35,
            "nx": 11,
            "ny": 9
        },
        "data": data.hourly.windspeed_10m.map((speed, index) => {
            return speed * Math.cos(data.hourly.winddirection_10m[index] * (Math.PI / 180));
        })
    };

    const vComponent = {
        "header": {
            "parameterCategory": 2,
            "parameterNumber": 3,
            "dx": 0.5,
            "dy": 0.5,
            "lo1": -125,
            "la1": 35,
            "nx": 11,
            "ny": 9
        },
        "data": data.hourly.windspeed_10m.map((speed, index) => {
            return speed * Math.sin(data.hourly.winddirection_10m[index] * (Math.PI / 180));
        })
    };
    
    console.log("Checking Data Lengths: uComp=", uComponent.data.length, "vComp=", vComponent.data.length, "Expected=", data.hourly.windspeed_10m.length);
    console.log("Wind Data Structure Before Passing to Leaflet-Velocity:", { uComponent, vComponent });

    if (!Array.isArray(uComponent.data) || !Array.isArray(vComponent.data)) {
        console.error("Error: Wind data is not in array format!");
        return;
    }

    const velocityLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
            velocityType: "Global Wind",
            position: "bottomleft",
            emptyString: "No wind data",
            angleConvention: "bearingCW",
            speedUnit: "m/s"
        },
        data: [uComponent, vComponent],
        maxVelocity: 15
    });

    map.addLayer(velocityLayer);
    console.log("✅ Wind Overlay Updated Successfully!");
}
