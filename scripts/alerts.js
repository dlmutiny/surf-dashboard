const STORMGLASS_API_KEY = "711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003";
const surfSpots = [
    { name: "The Hook", lat: 36.9514, lon: -121.9664, swell: ["W", "NW", "S"], wind: ["E", "NW", "Glassy"], tide: ["Incoming", "Medium"] },
    { name: "Jack’s (38th St.)", lat: 36.9525, lon: -121.9652, swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "Glassy"], tide: ["Low"] },
    { name: "Capitola", lat: 36.9741, lon: -121.9535, swell: ["S", "SSW", "W"], wind: ["NW", "N", "Glassy"], tide: ["Medium"] },
    { name: "Pleasure Point", lat: 36.9532, lon: -121.9643, swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "Glassy"], tide: ["Incoming", "Medium"] },
    { name: "26th Ave.", lat: 36.9547, lon: -121.9603, swell: ["SW", "W", "NW"], wind: ["E"], tide: ["Low Incoming"] },
    { name: "Manresa", lat: 36.9401, lon: -121.8723, swell: ["W", "NW", "SW"], wind: ["E", "Glassy"], tide: ["Incoming", "All Tides"] },
    { name: "Steamer Lane", lat: 36.9512, lon: -122.0262, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "Glassy"], tide: ["Incoming", "Low", "Medium"] },
    { name: "Indicators", lat: 36.9518, lon: -122.0332, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "Glassy"], tide: ["Incoming", "Low", "Medium"] },
    { name: "Cowells", lat: 36.9516, lon: -122.0258, swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: ["Low", "Incoming"] },
    { name: "Four Mile", lat: 37.0054, lon: -122.1775, swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: ["Incoming", "High"] },
    { name: "Waddell Creek", lat: 37.0995, lon: -122.2736, swell: ["N", "NE", "E", "W", "NW"], wind: ["E"], tide: ["Incoming", "High"] }
];

function degreesToCardinal(deg) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(deg / 22.5) % 16];
}

async function fetchStormglassData(lat, lon) {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=windDirection,swellDirection,tide`;
    try {
        const response = await fetch(url, {
            headers: { "Authorization": STORMGLASS_API_KEY }
        });
        const data = await response.json();
        return data.hours[0];
    } catch (error) {
        console.error("Error fetching Stormglass data:", error);
        return null;
    }
}

async function displaySurfAlerts() {
    const alertsList = document.getElementById("alerts-list");
    alertsList.innerHTML = "";

    for (const spot of surfSpots) {
        const data = await fetchStormglassData(spot.lat, spot.lon);
        if (!data) continue;

        const windDirection = degreesToCardinal(data.windDirection?.noaa || 0);
        const swellDirection = degreesToCardinal(data.swellDirection?.noaa || 0);
        const tideCondition = spot.tide.includes("Incoming") ? "Incoming" : "Unknown";

        const windIdeal = spot.wind.includes(windDirection);
        const swellIdeal = spot.swell.includes(swellDirection);

        if (windIdeal && swellIdeal) {
            const alertDiv = document.createElement("div");
            alertDiv.className = "alert";
            alertDiv.innerHTML = `
                <h3>${spot.name}</h3>
                ✅ Wind is ideal (${windDirection}). ⚠️ Swell direction ${swellDirection}. 🌊 Tide: ${tideCondition}.
            `;
            alertsList.appendChild(alertDiv);
        }
    }
}

document.addEventListener("DOMContentLoaded", displaySurfAlerts);
