document.addEventListener("DOMContentLoaded", function () {
    if (!window.W) {
        console.error("Windy API is not loaded. Check if libBoot.js is included correctly.");
        return;
    }

    const options = {
        key: "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH",
        lat: 36.95,
        lon: -122.02,
        zoom: 8,
        overlay: "wind",
    };

    W.map(options).then((windyAPI) => {
        const { map } = windyAPI;
        console.log("Windy Map initialized successfully!");
    });
});
