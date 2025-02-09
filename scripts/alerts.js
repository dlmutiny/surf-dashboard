const BASE_URL = "http://74.207.247.30:3000";  // Change this to your server IP

const surfSpots = [
        { name: "The Hook", idealSwells: ["W", "NW", "S"], idealWinds: ["E", "NW", "glassy"], idealTide: "incoming to medium", minPeriod: 10 },
        { name: "Jack’s (38th St.)", idealSwells: ["SSW", "SW", "W", "NW"], idealWinds: ["NE", "N", "NW", "glassy"], idealTide: "low", minPeriod: 8 },
        { name: "Capitola", idealSwells: ["S", "SSW", "W"], idealWinds: ["NW", "N", "glassy"], idealTide: "medium", minPeriod: 9 },
        { name: "Pleasure Point", idealSwells: ["SSW", "SW", "W", "WNW"], idealWinds: ["NE", "N", "NW", "glassy"], idealTide: "incoming, medium", minPeriod: 10 },
        { name: "26th Ave.", idealSwells: ["SW", "W", "NW"], idealWinds: ["E"], idealTide: "low pushing in", minPeriod: 9 },
        { name: "Manresa", idealSwells: ["W", "NW", "SW"], idealWinds: ["E", "glassy"], idealTide: "incoming, works on any tide", minPeriod: 7 },
        { name: "Steamer Lane", idealSwells: ["W", "S", "NW"], idealWinds: ["NE", "N", "NW", "glassy"], idealTide: "incoming, low to medium", minPeriod: 11 },
        { name: "Indicators", idealSwells: ["W", "S", "NW"], idealWinds: ["NE", "N", "NW", "glassy"], idealTide: "incoming, low to medium", minPeriod: 10 },
        { name: "Cowells", idealSwells: ["W", "NW", "S"], idealWinds: ["N", "NW"], idealTide: "low to incoming", minPeriod: 9 },
        { name: "Four Mile", idealSwells: ["NW", "W", "WSW"], idealWinds: ["NW", "N", "NE"], idealTide: "incoming to high", minPeriod: 11 },
        { name: "Waddell Creek", idealSwells: ["W", "NW", "N", "E", "S"], idealWinds: ["E"], idealTide: "incoming to high", minPeriod: 9 }
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
