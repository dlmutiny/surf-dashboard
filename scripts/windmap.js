function initializeWindyMap() {
    if (typeof windyInit !== "function") {
        console.error("Windy API is not loaded correctly.");
        return;
    }

    windyInit({
        key: 'y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH', // Windy API Key
        lat: 30, // Center on the Pacific Ocean
        lon: -160,
        zoom: 1, // More zoomed out
        overlay: 'wind'
    }, (windyAPI) => {
        console.log("✅ Windy Map initialized successfully!");
    });
}

window.onload = initializeWindyMap;
