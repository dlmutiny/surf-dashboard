const windyAPIKey = "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH";

function initializeWindyMap() {
    // Check if Windy API is available
    if (typeof windyInit === "undefined") {
        console.error("Windy API is not loaded correctly.");
        return;
    }

    // Initialize Windy map
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
            console.log("✅ Windy Map initialized successfully!", map);
        }
    );
}

// Ensure Windy loads before initializing the map
window.onload = function () {
    setTimeout(initializeWindyMap, 1000); // Small delay to allow Windy to load
};

