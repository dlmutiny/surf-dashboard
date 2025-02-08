const WINDY_API_KEY = "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH";

function initializeWindyMap() {
    if (typeof windyInit !== "undefined") {
        windyInit({
            key: WINDY_API_KEY,
            lat: 36.9514,
            lon: -121.9664,
            zoom: 7,
            overlay: 'wind',
        }, windyAPI => {
            console.log("Windy Map Initialized!");
        });
    } else {
        console.error("Windy API is not loaded correctly.");
        setTimeout(initializeWindyMap, 1000);
    }
}

document.addEventListener("DOMContentLoaded", initializeWindyMap);
