//  y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH


document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded. Initializing Windy map...");

    if (typeof windyInit !== "function") {
        console.error("Windy API is not loaded. Check if libBoot.js is included correctly.");
        return;
    }

    const options = {
        key: "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH", // Replace with your API Key
        lat: 36.985695, // Example: Santa Cruz, CA
        lon: -122.00287,
        zoom: 8,
        overlay: "wind",
    };

    windyInit(options, (windyAPI) => {
        console.log("Windy API successfully initialized!");
        
        const { map } = windyAPI;
        console.log("Windy Map initialized successfully.");

        // Optional: Add other overlays if needed
        const overlays = windyAPI.store.get("overlays");
        console.log("Available Overlays:", overlays);
    });
});
