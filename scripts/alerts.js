const API_KEY = "711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003";
const stormglassEndpoint = "https://api.stormglass.io/v2/weather/point";

const surfSpots = [
    { name: "The Hook", lat: 36.9514, lng: -121.9664, idealSwell: ["W", "NW", "S"], idealWind: ["E", "NW"], idealTide: "incoming to medium" },
    { name: "Jack’s (38th St.)", lat: 36.9525, lng: -121.9652, idealSwell: ["SSW", "SW", "W", "NW"], idealWind: ["NE", "N", "NW"], idealTide: "low tide" },
    { name: "Capitola", lat: 36.9741, lng: -121.9535, idealSwell: ["S", "SSW", "W"], idealWind: ["NW", "N"], idealTide: "Medium" },
    { name: "Pleasure Point", lat: 36.9532, lng: -121.9643, idealSwell: ["SSW", "SW", "W", "WNW"], idealWind: ["NE", "N", "NW"], idealTide: "incoming, medium tide" },
    { name: "26th Ave.", lat: 36.9535, lng: -121.9601, idealSwell: ["SW", "W", "NW"], idealWind: ["E"], idealTide: "low tide pushing back in" },
    { name: "Manresa", lat: 36.9386, lng: -121.8445, idealSwell: ["W", "NW", "SW"], idealWind: ["E"], idealTide: "incoming" },
    { name: "Steamer Lane", lat: 36.9511, lng: -122.0257, idealSwell: ["W", "S", "NW"], idealWind: ["NE", "N", "NW"], idealTide: "Incoming, low to medium" },
    { name: "Indicators", lat: 36.9513, lng: -122.0276, idealSwell: ["W", "S", "NW"], idealWind: ["NE", "N", "NW"], idealTide: "Incoming, low to medium" },
    { name: "Cowells", lat: 36.9515, lng: -122.0248, idealSwell: ["W", "NW", "S"], idealWind: ["N", "NW"], idealTide: "Low to incoming" },
    { name: "Four Mile", lat: 37.0063, lng: -122.1794, idealSwell: ["NW", "W", "WSW"], idealWind: ["NW", "N", "NE"], idealTide: "Incoming to high" },
    { name: "Waddell Creek", lat: 37.1011, lng: -122.2736, idealSwell: ["N", "NW", "W", "E"], idealWind: ["E"], idealTide: "Incoming to high" },
];

async function fetchStormglassData(lat, lng) {
    const params = "swellDirection,windDirection";
    const url = `${stormglassEndpoint}?lat=${lat}&lng=${lng}&params=${params}`;

    try {
        const response = await fetch(url, {
            headers: { "Authorization": API_KEY }
        });

        if (!response.ok) throw new Error("Failed to fetch Stormglass data");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Stormglass data:", error);
        return null;
    }
}

async function displaySurfAlerts() {
    const alertsDiv = document.getElementById("alerts");
    alertsDiv.innerHTML = "<h2>Surf Spot Alerts</h2>";

    for (const spot of surfSpots) {
        const data = await fetchStormglassData(spot.lat, spot.lng);
        if (!data) continue;

        const windDirection = data.hours[0]?.windDirection?.noaa || "Unknown";
        const swellDirection = data.hours[0]?.swellDirection?.noaa || "Unknown";

        const windIdeal = spot.idealWind.includes(windDirection) ? "✔️ Wind is ideal" : "❌ Wind not ideal";
        const swellIdeal = spot.idealSwell.includes(swellDirection) ? "✔️ Swell is ideal" : "⚠️ Swell direction unknown";

        alertsDiv.innerHTML += `
            <div>
                <h3>${spot.name}</h3>
                <p>${windIdeal} (${windDirection}°), ${swellIdeal} (${swellDirection}°)</p>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", displaySurfAlerts);
