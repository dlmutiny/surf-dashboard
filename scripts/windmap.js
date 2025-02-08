document.addEventListener("DOMContentLoaded", async function () {
    console.log("Initializing Windy Map...");

    if (typeof windyInit !== "function") {
        console.error("❌ Windy API failed to load.");
        return;
    }

    const options = {
        key: "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH", // Replace with your Windy API key
        verbose: true,
        lat: 36.985695,
        lon: -122.00287,
        zoom: 7,
        layer: "wind",
    };

    windyInit(options, function (windyAPI) {
        console.log("✅ Windy Map Loaded Successfully!");
        
        const { map, store } = windyAPI;

        // Center map on default location
        map.setView([36.985695, -122.00287], 7);

        // Set wind layer
        store.set("overlay", "wind");
    });
});
