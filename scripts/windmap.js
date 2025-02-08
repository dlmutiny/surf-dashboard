document.addEventListener("DOMContentLoaded", async function () {
    console.log("Initializing Windy Map...");

    if (typeof windyInit === "undefined") {
        console.error("Windy API is not loaded. Check if libBoot.js is included correctly.");
        return;
    }

    const options = {
        key: "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH",
        lat: 36.985695,
        lon: -122.00287,
        zoom: 7,
    };

    windyInit(options, (windyAPI) => {
        const { map } = windyAPI;
        console.log("Windy API successfully initialized!");
    });
});
