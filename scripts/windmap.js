const options = {
    key: 'y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH',  // Replace with your actual Windy API key
    lat: 35, 
    lon: -140, 
    zoom: 1, // Zoomed out to show more of the Pacific Ocean
    layer: 'pressure' // Set to pressure for low-pressure visualization
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
        const { map, store } = windyAPI;
        console.log("✅ Windy Map initialized successfully!", map);

        function highlightLowPressure() {
            const pressureData = store.get('pressure'); // Get pressure data
            if (!pressureData) {
                console.warn("⚠️ No pressure data available.");
                return;
            }

            function highlightLowPressure() {
                if (typeof windyAPI === "undefined") {
                    console.error("Windy API not initialized yet.");
                    return;
            }

            console.log("✅ Highlighting low-pressure systems...");

          // Use "isobars" instead of "pressure" as the overlay
            windyAPI.store.set("overlay", "isobars");
        }


            pressureData.forEach(point => {
                const { lat, lon, value } = point;
                if (value < 1010) {  // Low-pressure threshold
                    L.marker([lat, lon], {
                        icon: L.divIcon({
                            className: 'low-pressure-marker',
                            html: '<span style="color:red; font-size:16px;">L</span>',
                            iconSize: [20, 20]
                        })
                    }).addTo(map);
                }
            });
        }

        // Run the function after a small delay to ensure data is loaded
        setTimeout(highlightLowPressure, 3000);
    });
}

// Ensure Windy script is loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initializeWindyMap, 1000);
});
