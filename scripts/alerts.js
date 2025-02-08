const stormglassApiKey = "711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003";
const surfSpots = [
    { name: "The Hook", lat: 36.9514, lon: -121.9664, swell: ["W", "NW", "S"], wind: ["E", "NW", "glassy"], tide: ["incoming", "medium"] },
    { name: "Jack’s (38th St.)", lat: 36.9525, lon: -121.9652, swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["low"] },
    { name: "Capitola", lat: 36.9741, lon: -121.9535, swell: ["S", "SSW", "W"], wind: ["NW", "N", "glassy"], tide: ["medium"] },
    { name: "Pleasure Point", lat: 36.9532, lon: -121.9643, swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "medium"] },
    { name: "26th Ave.", lat: 36.9605, lon: -121.9577, swell: ["SW", "W", "NW"], wind: ["E"], tide: ["low", "incoming"] },
    { name: "Manresa", lat: 36.8793, lon: -121.8426, swell: ["W", "NW", "SW"], wind: ["E", "glassy"], tide: ["any", "incoming"] },
    { name: "Steamer Lane", lat: 36.9510, lon: -122.0256, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "low", "medium"] },
    { name: "Indicators", lat: 36.9517, lon: -122.0269, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "low", "medium"] },
    { name: "Cowells", lat: 36.9529, lon: -122.0263, swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: ["low", "incoming"] },
    { name: "Four Mile", lat: 37.0286, lon: -122.1704, swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: ["incoming", "high"] },
    { name: "Waddell Creek", lat: 37.0935, lon: -122.2830, swell: ["NW", "N", "E", "W"], wind: ["E"], tide: ["incoming", "high"] }
];

async function fetchStormglassData(lat, lon) {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=swellDirection,windDirection,tideHeight`;
    
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": stormglassApiKey
            }
        });

        if (!response.ok) throw new Error("Failed to fetch Stormglass data");

        const data = await response.json();
        return {
            swellDirection: data.hours[0]?.swellDirection?.sg || "No Data",
            windDirection: data.hours[0]?.windDirection?.sg || "No Data",
            tideHeight: data.hours[0]?.tideHeight?.sg || "No Data"
        };
    } catch (error) {
        console.error("Error fetching Stormglass data:", error);
        return null;
    }
}

function getIdealMatch(spot, data) {
    const isIdealSwell = spot.swell.includes(convertDirection(data.swellDirection));
    const isIdealWind = spot.wind.includes(convertDirection(data.windDirection));
    const isIdealTide = spot.tide.includes("incoming") || spot.tide.includes("medium"); 

    return {
        swell: isIdealSwell ? "✔️ Swell is ideal" : "⚠️ Small swell",
        wind: isIdealWind ? "✔️ Wind is ideal" : "❌ Wind not ideal",
        tide: isIdealTide ? "✔️ Tide is good" : "⚠️ Check tide"
    };
}

function convertDirection(deg) {
    if (deg === "No Data") return "No Data";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
}

async function displaySurfAlerts() {
    const alertContainer = document.getElementById("surf-alerts");
    if (!alertContainer) {
        console.error("Error: #surf-alerts container not found.");
        return;
    }

    alertContainer.innerHTML = "<h2>Surf Spot Alerts</h2>";

    for (const spot of surfSpots) {
        const data = await fetchStormglassData(spot.lat, spot.lon);
        if (!data) continue;

        const match = getIdealMatch(spot, data);

        alertContainer.innerHTML += `
            <div class="surf-spot">
                <strong>${spot.name}</strong>: ${match.swell}, ${match.wind}, ${match.tide}
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", displaySurfAlerts);
