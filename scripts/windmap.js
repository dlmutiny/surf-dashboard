const options = {
    key: 'y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH',  // Replace with your actual Windy API key
    lat: 35, 
    lon: -140, 
    zoom: 1, // Zoomed out to show more of the Pacific Ocean
    layer: 'wind'
};

function initializeWindyMap(retries = 5) {
    if (typeof windyInit === 'undefined') {
        console.error("❌ Windy API is not loaded correctly. Retrying...");
        if (retries > 0) {
            setTimeout(() => initializeWindyMap(retries - 1), 2000);
        }
        return;
    }

    windyInit(options, windyAPI => {
        const { map } = windyAPI;
        console.log("✅ Windy Map initialized successfully!", map);
    });
}

// Ensure Windy script is loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initializeWindyMap, 1000);
});
