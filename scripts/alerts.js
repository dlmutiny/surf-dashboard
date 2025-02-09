const BASE_URL = "http://74.207.247.30:3000";  // Change this to your server IP

const surfSpots = [
    { name: "The Hook", lat: 36.9514, lng: -121.9664, swell: ["W", "NW", "S"], wind: ["E", "NW", "glassy"], tide: "incoming to medium" },
    { name: "Jack’s (38th St.)", lat: 36.9525, lng: -121.9652, swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "low tide" },
    { name: "Capitola", lat: 36.9741, lng: -121.9535, swell: ["S", "SSW", "W"], wind: ["NW", "N", "glassy"], tide: "medium" },
    { name: "Pleasure Point", lat: 36.9532, lng: -121.9643, swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "glassy"], tide: "incoming, medium" },
    { name: "26th Ave.", lat: 36.9547, lng: -121.9603, swell: ["SW", "W", "NW"], wind: ["E"], tide: "low tide pushing back in" },
    { name: "Manresa", lat: 36.9401, lng: -121.8723, swell: ["W", "NW", "SW"], wind: ["E", "glassy"], tide: "incoming" },
    { name: "Steamer Lane", lat: 36.9512, lng: -122.0262, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "incoming, low to medium" },
    { name: "Indicators", lat: 36.9504, lng: -122.0285, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "incoming, low to medium" },
    { name: "Cowells", lat: 36.9511, lng: -122.0268, swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: "low to incoming" },
    { name: "Four Mile", lat: 37.0168, lng: -122.1561, swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: "incoming to high" },
    { name: "Waddell Creek", lat: 37.1016, lng: -122.2737, swell: ["NW", "W", "N"], wind: ["E"], tide: "incoming to high" }
];

let tideData = null; // Store tide data once for all spots

async function fetchTideData() {
    try {
        const response = await fetch(`${BASE_URL}/tide-data?lat=36.9514&lng=-121.9664`);
        tideData = await response.json();

        console.log("Fetched Tide Data:", tideData);
    } catch (error) {
        console.error("Error fetching tide data:", error);
    }
}

async function fetchSurfData() {
    for (const spot of surfSpots) {
        try {
            const response = await fetch(`${BASE_URL}/surf-forecast?lat=${spot.lat}&lng=${spot.lng}`);
            const data = await response.json();

            const windDirection = data.hours[0]?.windDirection?.noaa;
            const swellHeight = data.hours[0]?.swellHeight?.noaa;
            const swellDirection = data.hours[0]?.swellDirection?.noaa;

            if (!windDirection || !swellHeight || !swellDirection) {
                console.warn(`No valid data for ${spot.name}`);
                continue;
            }

            displayAlert(spot.name, windDirection, swellDirection, swellHeight, getTideInfo());
        } catch (error) {
            console.error(`Error fetching data for ${spot.name}:`, error);
        }
    }
}

// Convert wind/swell degrees to cardinal directions
function convertWindDirection(degrees) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(degrees / 45) % 8];
}

// Convert meters to feet
function metersToFeet(meters) {
    return (meters * 3.28084).toFixed(2);
}

// Determine tide status
function getTideInfo() {
    if (!tideData || !tideData.data) return "Error loading tide";

    const now = new Date();
    let closestTide = tideData.data.reduce((prev, curr) => {
        return Math.abs(new Date(curr.time) - now) < Math.abs(new Date(prev.time) - now) ? curr : prev;
    });

    const tideHeightFeet = metersToFeet(closestTide.height);
    const tideType = closestTide.type.charAt(0).toUpperCase() + closestTide.type.slice(1); // Capitalize tide type

    return `${tideType} tide at ${tideHeightFeet} ft`;
}

// Display alerts
function displayAlert(name, windDir, swellDir, swellHeight, tideInfo) {
    const alertContainer = document.getElementById("alerts-container");
    if (!alertContainer) return;

    const alert = document.createElement("div");
    alert.className = "alert-box";
    alert.innerHTML = `
        <strong>${name} ❌ Not Ideal</strong><br>
        🌬️ Wind: ${convertWindDirection(windDir)} (${windDir}°)<br>
        🌊 Swell: ${convertWindDirection(swellDir)} (${swellDir}°) | ${metersToFeet(swellHeight)} ft<br>
        🌊 Tide: ${tideInfo}
    `;

    alertContainer.appendChild(alert);
}

// Auto-refresh every 30 minutes
setInterval(fetchSurfData, 1800000);

// Fetch tide data once on load
fetchTideData().then(fetchSurfData);
