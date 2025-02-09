document.addEventListener("DOMContentLoaded", () => {
    fetchStormglassData();
    setInterval(fetchStormglassData, 30 * 60 * 1000); // Auto-refresh every 30 minutes
});

const surfSpots = [
    {
        name: "The Hook",
        lat: 36.9514,
        lng: -121.9664,
        idealSwell: ["W", "NW", "S"],
        idealWind: ["E", "NW", "glassy"],
        idealTide: ["incoming", "medium"]
    },
    {
        name: "Jack’s (38th St.)",
        lat: 36.9525,
        lng: -121.9652,
        idealSwell: ["SSW", "SW", "W", "NW"],
        idealWind: ["NE", "N", "NW", "glassy"],
        idealTide: ["low"]
    },
    {
        name: "Capitola",
        lat: 36.9741,
        lng: -121.9535,
        idealSwell: ["S", "SSW", "W"],
        idealWind: ["NW", "N", "glassy"],
        idealTide: ["medium"]
    },
    {
        name: "Pleasure Point",
        lat: 36.9532,
        lng: -121.9643,
        idealSwell: ["SSW", "SW", "W", "WNW"],
        idealWind: ["NE", "N", "NW", "glassy"],
        idealTide: ["incoming", "medium"]
    },
    {
        name: "26th Ave.",
        lat: 36.9547,
        lng: -121.9603,
        idealSwell: ["SW", "W", "NW"],
        idealWind: ["E"],
        idealTide: ["low", "incoming"]
    },
    {
        name: "Manresa",
        lat: 36.9401,
        lng: -121.8723,
        idealSwell: ["W", "NW", "SW"],
        idealWind: ["E", "glassy"],
        idealTide: ["incoming"]
    },
    {
        name: "Steamer Lane",
        lat: 36.9512,
        lng: -122.0262,
        idealSwell: ["W", "S", "NW"],
        idealWind: ["NE", "N", "NW", "glassy"],
        idealTide: ["low", "medium", "incoming"]
    },
    {
        name: "Indicators",
        lat: 36.9504,
        lng: -122.0285,
        idealSwell: ["W", "S", "NW"],
        idealWind: ["NE", "N", "NW", "glassy"],
        idealTide: ["low", "medium", "incoming"]
    },
    {
        name: "Cowells",
        lat: 36.9511,
        lng: -122.0268,
        idealSwell: ["W", "NW", "S"],
        idealWind: ["N", "NW"],
        idealTide: ["low", "incoming"]
    },
    {
        name: "Four Mile",
        lat: 37.0168,
        lng: -122.1561,
        idealSwell: ["NW", "W", "WSW"],
        idealWind: ["NW", "N", "NE"],
        idealTide: ["incoming", "high"]
    },
    {
        name: "Waddell Creek",
        lat: 37.1016,
        lng: -122.2737,
        idealSwell: ["NW", "W", "N", "S"],
        idealWind: ["E"],
        idealTide: ["incoming", "high"]
    }
];

const stormglassApiKey = "711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003";

async function fetchStormglassData() {
    console.log("Fetching Surf Data...");

    for (const spot of surfSpots) {
        try {
            const response = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${spot.lat}&lng=${spot.lng}&params=windDirection,swellDirection,tideHeight`, {
                headers: { "Authorization": stormglassApiKey }
            });

            if (!response.ok) {
                console.error(`Error fetching Stormglass data: ${response.statusText}`);
                continue;
            }

            const data = await response.json();
            displaySurfAlerts(spot, data);
        } catch (error) {
            console.error("Error fetching Stormglass data:", error);
        }
    }
}

function displaySurfAlerts(spot, data) {
    const windDirection = getWindDirection(data.hours[0]?.windDirection?.noaa);
    const swellDirection = getWindDirection(data.hours[0]?.swellDirection?.noaa);
    const tideHeight = data.hours[0]?.tideHeight?.noaa ?? "Unknown";

    const windMatch = spot.idealWind.includes(windDirection);
    const swellMatch = spot.idealSwell.includes(swellDirection);
    const tideMatch = spot.idealTide.includes("incoming") || spot.idealTide.includes("medium");

    if (windMatch && swellMatch && tideMatch) {
        createAlertOverlay(spot.name, windDirection, swellDirection, tideHeight);
    }
}

function createAlertOverlay(spotName, wind, swell, tide) {
    const alertContainer = document.getElementById("surf-alerts");
    
    if (!alertContainer) return;

    const alertBox = document.createElement("div");
    alertBox.className = "alert-box";
    alertBox.innerHTML = `
        <strong>${spotName}</strong><br>
        ✅ Wind: ${wind} | 🌊 Swell: ${swell} | 🌊 Tide: ${tide} ft
    `;

    alertContainer.appendChild(alertBox);
}

// Convert degrees to cardinal direction
function getWindDirection(degrees) {
    if (degrees === undefined) return "Unknown";

    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}
