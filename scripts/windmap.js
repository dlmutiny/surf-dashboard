const options = {
    key: 'y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH',  // Replace with your actual Windy API key
    lat: 35, 
    lon: -140, 
    zoom: 1, // Zoomed out to show more of the Pacific Ocean
    layer: 'wind'
};

function initializeWindyMap() {
    if (typeof windyInit === 'undefined') {
        console.error("Windy API is not loaded correctly.");
        return;
    }

    windyInit(options, windyAPI => {
        const { map } = windyAPI;
        console.log("✅ Windy Map initialized successfully!", map);
    });
}

window.onload = initializeWindyMap;
