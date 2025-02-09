const stormglassApiKey = "711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003";

// Surf spots with lat/lng and preferred conditions
const surfSpots = [
    { name: "The Hook", lat: 36.9514, lng: -121.9664, swell: ["W", "NW", "S"], wind: ["E", "NW", "glassy"], tide: "incoming to medium" },
    { name: "Jack’s (38th St.)", lat: 36.9525, lng: -121.9652, swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "low tide" },
    { name: "Capitola", lat: 36.9741, lng: -121.9535, swell: ["S", "SSW", "W"], wind: ["NW", "N", "glassy"], tide: "Medium" },
    { name: "Pleasure Point", lat: 36.9532, lng: -121.9643, swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "glassy"], tide: "incoming, medium" },
    { name: "26th Ave.", lat: 36.9547, lng: -121.9603, swell: ["SW", "W", "NW"], wind: ["E"], tide: "low tide pushing in" },
    { name: "Manresa", lat: 36.9401, lng: -121.8723, swell: ["W", "NW", "SW"], wind: ["E", "glassy"], tide: "incoming, less tide-sensitive" },
    { name: "Steamer Lane", lat: 36.9512, lng: -122.0262, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "low to medium, incoming" },
    { name: "Indicators", lat: 36.9504, lng: -122.0285, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "low to medium, incoming" },
    { name: "Cowells", lat: 36.9511, lng: -122.0268, swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: "low to incoming" },
    { name: "Four Mile", lat: 37.0168, lng: -122.1561, swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: "incoming to high" },
    { name: "Waddell Creek", lat: 37.1016, lng: -122.2737, swell: ["W", "NW", "N"], wind: ["E"], tide: "incoming to high" }
];

// Convert degrees to cardinal direction
function getWindDirection(degrees) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(degrees / 22.5) % 16];
}

// Fetch Stormglass data for each spot
async function fetchStormglassData(spot) {
    try {
        const url = `https://api.stormglass.io/v2/weather/point?lat=${spot.lat}&lng=${spot.lng}&params=windDirection,swellDirection`;

        const response = await fetch(url, {
            headers: { "Authorization": stormglassApiKey }
        });

        const data = await response.json();
        console.log(`🌊 Raw Stormglass API response for ${spot.name}:`, data);  

        if (!response.ok || !data.hours || data.hours.length === 0) {
            console.warn(`⚠ No valid data for ${spot.name}`);
            return null;
        }

        return data.hours[0];  
    } catch (error) {
        console.error(`🚨 Error fetching Stormglass data for ${spot.name}:`, error);
        return null;
    }
}


// Display surf alerts
async function displaySurfAlerts() {
    console.log("Fetching Surf Data...");
    
    const container = document.getElementById("surf-alerts");
    if (!container) return;
    container.innerHTML = "";

    for (let spot of surfSpots) {
        const data = await fetchStormglassData(spot);

        if (!data) continue;

        const windDir = data.windDirection?.noaa ? getWindDirection(data.windDirection.noaa) : "Unknown";
        const swellDir = data.swellDirection?.noaa ? getWindDirection(data.swellDirection.noaa) : "Unknown";
        const tideHeight = data.tideHeight?.noaa ? `${data.tideHeight.noaa.toFixed(2)}m` : "Unknown";

        const isIdealWind = spot.wind.includes(windDir) || windDir === "glassy";
        const isIdealSwell = spot.swell.includes(swellDir);

        let alertText = `<strong>${spot.name}</strong><br>`;
        alertText += isIdealWind ? "✅ Wind is ideal" : `❌ Wind not ideal (${windDir})`;
        alertText += isIdealSwell ? " ✅ Swell is ideal" : ` ⚠️ Swell direction unknown (${swellDir})`;
        alertText += ` 🌊 Tide: ${tideHeight}`;

        if (isIdealWind && isIdealSwell) {
            let alertBox = document.createElement("div");
            alertBox.className = "surf-alert";
            alertBox.innerHTML = alertText;
            container.appendChild(alertBox);
        }
    }

    console.log("✅ Surf Alerts Updated!");
}

// Auto-refresh every 30 minutes
setInterval(displaySurfAlerts, 30 * 60 * 1000);
window.onload = displaySurfAlerts;
