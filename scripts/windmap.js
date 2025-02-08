const WINDY_API_KEY = "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH";

async function initializeWindyMap() {
    if (typeof windyInit === "undefined") {
        console.error("Windy API is not loaded correctly.");
        return;
    }

    windyInit({
        key: WINDY_API_KEY,
        lat: 36.9514,
        lon: -121.9664,
        zoom: 7,
        overlay: 'wind',
    }, windyAPI => {
        console.log("Windy Map Initialized!");
    });
}

document.addEventListener("DOMContentLoaded", initializeWindyMap);
