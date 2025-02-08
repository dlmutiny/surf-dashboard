const surfSpots = [
    { name: "The Hook", swell: ["W", "NW", "S"], wind: ["E", "NW", "glassy"], tide: ["incoming", "medium"] },
    { name: "Jack’s (38th St.)", swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["low"] },
    { name: "Capitola", swell: ["S", "SSW", "W"], wind: ["NW", "N", "glassy"], tide: ["medium"] },
    { name: "Pleasure Point", swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "medium"] },
    { name: "26th Ave.", swell: ["SW", "W", "NW"], wind: ["E"], tide: ["low", "incoming"] },
    { name: "Manresa", swell: ["W", "NW", "SW"], wind: ["E", "glassy"], tide: ["incoming", "any"] },
    { name: "Steamer Lane", swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "low", "medium"] },
    { name: "Indicators", swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "low", "medium"] },
    { name: "Cowells", swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: ["low", "incoming"] },
    { name: "Four Mile", swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: ["incoming", "high"] },
    { name: "Waddell Creek", swell: ["NW", "W", "N", "E"], wind: ["E"], tide: ["incoming", "high"] }
];

const NOAA_API_URL = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/surf";

// CORS Proxy (For testing only, remove if using a backend)
const proxy = "https://cors-anywhere.herokuapp.com/";

async function fetchNOAAData() {
    try {
        const response = await fetch(proxy + NOAA_API_URL);
        const data = await response.json();
        console.log("NOAA Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching NOAA data:", error);
        return null;
    }
}

async function fetchWindyData() {
    const WINDY_API_URL = `https://api.windy.com/api/point-forecast/v2?lat=36.985695&lon=-122.00287&model=gfs&parameters=wind,swell&key=YOUR_WINDY_API_KEY`;

    try {
        const response = await fetch(WINDY_API_URL);
        const data = await response.json();
        console.log("Windy API Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching Windy API data:", error);
        return null;
    }
}

async function displaySurfAlerts() {
    const noaaData = await fetchNOAAData();
    const windyData = await fetchWindyData();

    if (!noaaData || !windyData) {
        console.error("Failed to retrieve data.");
        return;
    }

    const currentSwell = windyData.swell; // Placeholder, adjust based on API response
    const currentWind = windyData.wind; // Placeholder, adjust based on API response
    const currentTide = noaaData.tide; // Placeholder, adjust based on API response

    let bestSpot = null;
    let bestScore = 0;

    surfSpots.forEach(spot => {
        let score = 0;

        if (spot.swell.includes(currentSwell)) score += 2;
        if (spot.wind.includes(currentWind)) score += 2;
        if (spot.tide.includes(currentTide)) score += 1;

        if (score > bestScore) {
            bestScore = score;
            bestSpot = spot;
        }
    });

    const alertList = document.getElementById("alertList");
    alertList.innerHTML = ""; 

    if (bestSpot) {
        let alertItem = document.createElement("li");
        alertItem.innerHTML = `<strong>${bestSpot.name}</strong> - Best spot based on current conditions!`;
        alertList.appendChild(alertItem);
    } else {
        let alertItem = document.createElement("li");
        alertItem.innerHTML = "No optimal surf spots found based on current conditions.";
        alertList.appendChild(alertItem);
    }
}

window.onload = displaySurfAlerts;
