const stormglassAPIKey = "711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003";
const surfSpots = [
    { name: "The Hook", lat: 36.9514, lng: -121.9664, swell: ["W", "NW", "S"], wind: ["E", "NW", "Glassy"], tide: "Incoming to Medium" },
    { name: "Jack’s (38th St.)", lat: 36.9525, lng: -121.9652, swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "Glassy"], tide: "Low" },
    { name: "Capitola", lat: 36.9741, lng: -121.9535, swell: ["S", "SSW", "W"], wind: ["NW", "N", "Glassy"], tide: "Medium" },
    { name: "Pleasure Point", lat: 36.9532, lng: -121.9643, swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "Glassy"], tide: "Incoming, Medium" },
    { name: "26th Ave.", lat: 36.9547, lng: -121.9603, swell: ["SW", "W", "NW"], wind: ["E"], tide: "Low to Incoming" },
    { name: "Manresa", lat: 36.9401, lng: -121.8723, swell: ["W", "NW", "SW"], wind: ["E", "Glassy"], tide: "Prefers Incoming" },
    { name: "Steamer Lane", lat: 36.9512, lng: -122.0262, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "Glassy"], tide: "Incoming, Low to Medium" },
];

async function fetchStormglassData(lat, lng) {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=windDirection,swellDirection,swellHeight`;

    try {
        const response = await fetch(url, {
            headers: { "Authorization": stormglassAPIKey },
        });

        if (!response.ok) {
            console.error(`Stormglass API returned ${response.status} for lat:${lat}, lng:${lng}`);
            return null;
        }

        const data = await response.json();
        if (!data.hours || data.hours.length === 0) {
            console.warn(`No valid data from Stormglass for lat:${lat}, lng:${lng}`);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error fetching Stormglass data:", error);
        return null;
    }
}


function convertWindDirection(degrees) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(degrees / 22.5) % 16];
}

async function displaySurfAlerts() {
    const alertsContainer = document.getElementById("surf-alerts");
    alertsContainer.innerHTML = "";

    for (const spot of surfSpots) {
        const data = await fetchStormglassData(spot.lat, spot.lng);
        if (!data || !data.hours) {
            console.warn(`No valid data for ${spot.name}`);
            continue;
        }

        const forecast = data.hours[0]; // Get the latest forecasted hour
        const windDir = forecast.windDirection?.noaa ?? "Unknown";
        const swellDir = forecast.swellDirection?.noaa ?? "Unknown";
        const tideHeight = forecast.tideHeight?.noaa ?? "Unknown";
        const windCardinal = convertWindDirection(windDir);

        const isIdealWind = spot.wind.includes(windCardinal) || spot.wind.includes("Glassy");
        const isIdealSwell = spot.swell.includes(swellDir);
        const isIdealTide = tideHeight !== "Unknown"; // Placeholder logic, can refine further

        if (!isIdealWind || !isIdealSwell || !isIdealTide) continue;

        const spotElement = document.createElement("div");
        spotElement.classList.add("alert-item");
        spotElement.innerHTML = `
            <h3>${spot.name}</h3>
            ${isIdealWind ? "✅ Wind is ideal (" + windCardinal + ")" : "❌ Wind not ideal (" + windCardinal + ")"} 
            ${isIdealSwell ? "✅ Swell is good (" + swellDir + ")" : "⚠️ Swell direction unknown (" + swellDir + ")"}
            🌊 Tide: ${spot.tide} (Current: ${tideHeight}m)
        `;
        alertsContainer.appendChild(spotElement);
    }
    console.log("Surf Alerts Updated!");
}

document.addEventListener("DOMContentLoaded", displaySurfAlerts);
