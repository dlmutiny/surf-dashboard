const NOAA_API_URL = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/surf.json";
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
const WINDY_API_URL = "https://api.windy.com/api/point-forecast/v2";
const WINDY_API_KEY = "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH";

const surfSpots = [
    { name: "The Hook", swell: ["W", "NW", "S"], wind: ["E", "NW", "glassy"], tide: ["incoming", "medium"] },
    { name: "Jack’s (38th St.)", swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["low"] },
    { name: "Capitola", swell: ["S", "SSW", "W"], wind: ["NW", "N", "glassy"], tide: ["medium"] },
    { name: "Pleasure Point", swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "medium"] },
    { name: "26th Ave.", swell: ["SW", "W", "NW"], wind: ["E"], tide: ["low", "incoming"] },
    { name: "Manresa", swell: ["W", "NW", "SW"], wind: ["E", "glassy"], tide: ["any", "incoming"] },
    { name: "Steamer Lane", swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "low", "medium"] },
    { name: "Indicators", swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "low", "medium"] },
    { name: "Cowells", swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: ["low", "incoming"] },
    { name: "Four Mile", swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: ["incoming", "high"] },
    { name: "Waddell Creek", swell: ["W", "NW", "N"], wind: ["E"], tide: ["incoming", "high"] },
];

async function fetchNOAAData() {
    try {
        const response = await fetch(PROXY_URL + NOAA_API_URL);
        if (!response.ok) throw new Error("Failed to fetch NOAA data");
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

async function fetchWindyData(lat, lon) {
    try {
        const response = await fetch(
            `${WINDY_API_URL}?lat=${lat}&lon=${lon}&model=gfs&parameters=wind,swell&key=${WINDY_API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch Windy API data");
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

async function displaySurfAlerts() {
    console.log("Fetching Surf Spot Alerts...");
    
    const noaaData = await fetchNOAAData();
    const windyData = await fetchWindyData(36.985695, -122.00287);

    if (!noaaData || !windyData) {
        console.error("Failed to retrieve data.");
        return;
    }

    let bestSpot = null;
    let bestScore = 0;
    let bestDescription = "";

    surfSpots.forEach((spot) => {
        let score = 0;

        if (spot.swell.includes(windyData.swell)) score++;
        if (spot.wind.includes(windyData.wind)) score++;
        if (spot.tide.includes(noaaData.tide)) score++;

        if (score > bestScore) {
            bestSpot = spot.name;
            bestScore = score;
            bestDescription = `Best conditions for ${spot.name}: Swell - ${spot.swell.join(
                ", "
            )}, Wind - ${spot.wind.join(", ")}, Tide - ${spot.tide.join(", ")}.`;
        }
    });

    document.getElementById("surfAlerts").innerHTML = bestSpot
        ? `<h2>Best Surf Spot: ${bestSpot}</h2><p>${bestDescription}</p>`
        : `<h2>No ideal conditions found.</h2>`;
}

document.addEventListener("DOMContentLoaded", () => {
    displaySurfAlerts();
});
