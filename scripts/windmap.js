const windyAPIKey = "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH";

function initializeWindyMap() {
    if (typeof windyInit === "undefined") {
        console.error("Windy API is not loaded correctly.");
        return;
    }

    windyInit(
        {
            key: windyAPIKey,
            lat: 36.95,
            lon: -121.96,
            zoom: 7,
            overlay: "wind",
        },
        (windyAPI) => {
            const { map } = windyAPI;
            console.log("Windy Map initialized successfully!", map);
        }
    );
}

// Wait for Windy API to load before initializing
window.onload = initializeWindyMap;

