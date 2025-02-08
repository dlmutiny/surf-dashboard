console.log("Initializing Windy Map...");

// Ensure Windy API is loaded
if (typeof W === "undefined") {
    console.error("Windy API is not loaded. Check if libBoot.js is included correctly.");
} else {
    console.log("Windy API loaded successfully!");
}

// Windy API Configuration
const options = {
    key: 'y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH', // Replace with actual Windy API key
    lat: 36.985695,
    lon: -122.00287,
    zoom: 5,
};

// Initialize Windy API
windyInit(options, function (windyAPI) {
    console.log("Windy API successfully initialized!");

    const { map, store } = windyAPI;

    if (!map) {
        console.error("Windy Map could not be initialized!");
        return;
    }

    console.log("Windy Map initialized successfully.");

    // Add Wind Layer
    store.set("overlay", "wind");
});
