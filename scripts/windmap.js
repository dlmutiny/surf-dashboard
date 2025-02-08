const windyAPIKey = "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH";

function initializeWindyMap() {
    if (typeof windyInit !== "function") {
        console.error("Windy API is not loaded correctly.");
        return;
    }

    windyInit({
        key: 'y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH', // Your Windy API Key
        lat: 30, // Adjust latitude to view more of the Pacific Ocean
        lon: -160, // Adjust longitude for central Pacific
        zoom: 3, // Lower zoom level to see a wider area
        overlay: 'wind', // Default overlay
    }, function (windyAPI) {
        console.log("✅ Windy Map initialized successfully!");
    });
}


// Delay execution to allow Windy to load
window.onload = function () {
    setTimeout(initializeWindyMap, 2000);
};
