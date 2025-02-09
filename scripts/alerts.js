//const BASE_URL = "http://74.207.247.30:3000";  // Change this to your server IP

async function fetchBuoyData() {
    try {
        const response = await fetch('/api/noaa-buoy');
        if (!response.ok) throw new Error('Failed to fetch buoy data');

        const data = await response.text();
        return parseBuoyData(data);
    } catch (error) {
        console.error('Error fetching NOAA buoy data:', error);
        return null;
    }
}

function parseBuoyData(data) {
    const lines = data.trim().split("\n");
    const latestData = lines[1].split(/\s+/); // Extract latest reading

    const buoyInfo = {
        time: `${latestData[0]}-${latestData[1]}-${latestData[2]} ${latestData[3]}:${latestData[4]} UTC`,
        windDirection: convertWindDirection(parseFloat(latestData[5])),
        windSpeed: parseFloat(latestData[6]), // Wind speed in m/s
        waveHeight: parseFloat(latestData[8]), // Significant wave height in meters
        swellPeriod: parseFloat(latestData[9]), // Swell period in seconds
        swellDirection: convertWindDirection(parseFloat(latestData[10])),
        secondarySwellPeriod: parseFloat(latestData[11]),
        secondarySwellDirection: convertWindDirection(parseFloat(latestData[12])),
        tideStatus: determineTideStatus(latestData[13]),
        nextTideTime: latestData[14]
    };

    return buoyInfo;
}

function convertWindDirection(degrees) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function determineTideStatus(value) {
    if (value.includes("H")) return "High";
    if (value.includes("L")) return "Low";
    if (value.includes("I")) return "Incoming";
    if (value.includes("O")) return "Outgoing";
    return "Unknown";
}

async function updateSurfAlerts() {
    const buoyData = await fetchBuoyData();
    if (!buoyData) return;

    const spots = [
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

    const rankedSpots = spots.map(spot => {
        let score = 0;
        if (spot.idealSwells.includes(buoyData.swellDirection)) score += 2;
        if (spot.idealWinds.includes(buoyData.windDirection)) score += 2;
        if (buoyData.swellPeriod >= spot.minPeriod) score += 2; // Swell period must meet the minPeriod requirement
        if (buoyData.tideStatus.includes(spot.idealTide)) score += 1;

        return { ...spot, score };
    }).sort((a, b) => b.score - a.score);

    displayAlerts(rankedSpots, buoyData);
}

function displayAlerts(spots, buoyData) {
    const alertContainer = document.getElementById("surf-alerts");
    alertContainer.innerHTML = "";

    spots.forEach(spot => {
        const alertItem = document.createElement("div");
        alertItem.className = "alert-item";
        alertItem.innerHTML = `
            <h3>${spot.name} - Score: ${spot.score}</h3>
            <p>Primary Swell: ${buoyData.swellDirection} at ${buoyData.swellPeriod}s</p>
            <p>Secondary Swell: ${buoyData.secondarySwellDirection} at ${buoyData.secondarySwellPeriod}s</p>
            <p>Wind: ${buoyData.windDirection} at ${buoyData.windSpeed} m/s</p>
            <p>Wave Height: ${buoyData.waveHeight}m</p>
            <p>Tide: ${buoyData.tideStatus} (Next: ${buoyData.nextTideTime})</p>
            <p>Min Period for Spot: ${spot.minPeriod}s</p>
        `;
        alertContainer.appendChild(alertItem);
    });
}

document.addEventListener("DOMContentLoaded", updateSurfAlerts);

