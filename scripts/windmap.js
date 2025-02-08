document.addEventListener("DOMContentLoaded", function () {
    console.log("Initializing Windy Map...");

    if (typeof windyInit !== "function") {
        console.error("Windy API is not loaded. Check if libBoot.js is included correctly.");
        return;
    }

    const options = {
        key: "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH", // Your Windy API Key
        lat: 36.9742,  // Centered on Santa Cruz
        lon: -122.031,
        zoom: 10,
        overlay: "wind"
    };

    windyInit(options, (windyAPI) => {
        console.log("Windy API successfully initialized!");

        const { map } = windyAPI;
        console.log("Windy Map initialized successfully!");
    });
});
