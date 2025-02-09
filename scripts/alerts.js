const stormglassApiKey = "711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003";

// Surf spots and ideal conditions
const surfSpots = [
    { name: "The Hook", lat: 36.9514, lng: -121.9664, swell: ["W", "NW", "S"], wind: ["E", "NW", "Glassy"], tide: "Incoming to Medium" },
    { name: "Jack’s (38th St.)", lat: 36.9525, lng: -121.9652, swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "Glassy"], tide: "Low Tide" },
    { name: "Capitola", lat: 36.9741, lng: -121.9535, swell: ["S", "SSW", "W"], wind: ["NW", "N", "Glassy"], tide: "Medium" },
    { name: "Pleasure Point", lat: 36.9532, lng: -121.9643, swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "Glassy"], tide: "Incoming, Medium" },
    { name: "26th Ave.", lat: 36.9547, lng: -121.9603, swell: ["SW", "W", "NW"], wind: ["E"], tide: "Low tide pushing in" },
    { name: "Manresa", lat: 36.9401, lng: -121.8723, swell: ["W", "NW", "SW"], wind: ["E", "Glassy"], tide: "Incoming" },
    { name: "Steamer Lane", lat: 36.9512, lng: -122.0262, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "Glassy"], tide: "Incoming, Low to Medium" },
    { name: "Indicators", lat: 36.9504, lng: -122.0285, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "Glassy"], tide: "Incoming, Low to Medium" },
    { name: "Cowells", lat: 36.9511, lng: -122.0268, swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: "Low to Incoming" },
    { name: "Four Mile", lat: 37.0168, lng: -122.1561, swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: "Incoming to High" },
    { name: "Waddell Creek", lat: 37.1016, lng: -122.2737, swell: ["Anything except SW"], wind: ["E"], tide: "Incoming to High" }
];

// Convert degrees to compass directions
function convertDegreesToCompass(degrees) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(degrees / 22.5) % 16];
}

// Fetch tide data from Stormglass
async function fetchTideData(spot) {
    try {
        const response = await fetch(`http://localhost:3000/tide-data?lat=${spot.lat}&lng=${spot.lng}`);
        const data = await response.json();
        console.log(`🌊 Tide data for ${spot.name}:`, data);
        return data;
    } catch (error) {
        console.error(`🚨 Error fetching tide data for ${spot.name}:`, error);
        return null;
    }
}


// Fetch surf forecast from Stormglass
async function fetchStormglassData(spot) {
    try {
        const url = `https://api.stormglass.io/v2/weather/point?lat=${spot.lat}&lng=${spot.lng}&params=windDirection,swellDirection`;

        const response = await fetch(url, {
            headers: { "Authorization": stormglassApiKey }
        });

        const data = await response.json();
        console.log(`🌊 Raw Stormglass API response for ${spot.name}:`, data);

        if (!response.ok || !data.hours || data.hours.length === 0) {
            console.warn(`⚠ No valid surf data for ${spot.name}`);
            return null;
        }

        // Fetch tide height data
        const tideData = await fetchStormglassTide(spot);

        return { surf: data.hours[0], tide: tideData };
    } catch (error) {
        console.error(`🚨 Error fetching Stormglass data for ${spot.name}:`, error);
        return null;
    }
}

// Display surf alerts
async function displaySurfAlerts() {
    const alertsContainer = document.getElementById("alerts");
    alertsContainer.innerHTML = ""; // Clear previous alerts

    for (const spot of surfSpots) {
        const forecast = await fetchStormglassData(spot);
        if (!forecast) continue;

        const windDir = convertDegreesToCompass(forecast.surf.windDirection.noaa);
        const swellDir = convertDegreesToCompass(forecast.surf.swellDirection.noaa);

        // Extract tide info
        const tideInfo = forecast.tide ? forecast.tide.map(t => `${t.type} at ${new Date(t.time).toLocaleTimeString()}`).join(", ") : "No tide data";

        // Check if conditions match
        const isIdealWind = spot.wind.includes(windDir) || spot.wind.includes("Glassy");
        const isIdealSwell = spot.swell.includes(swellDir);
        const isIdealTide = forecast.tide ? forecast.tide.some(t => spot.tide.includes(t.type)) : false;

        if (isIdealWind && isIdealSwell && isIdealTide) {
            const alertHTML = `
                <div class="alert">
                    <h3>${spot.name}</h3>
                    ✅ Wind: ${windDir} | ✅ Swell: ${swellDir} | ✅ Tide: ${tideInfo}
                </div>
            `;
            alertsContainer.innerHTML += alertHTML;
        }
    }
}

// Auto-refresh alerts every 30 minutes
setInterval(displaySurfAlerts, 30 * 60 * 1000);
window.onload = displaySurfAlerts;
