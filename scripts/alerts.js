const surfSpots = [
    { name: "The Hook", lat: 36.9514, lng: -121.9664, swell: ["W", "NW", "S"], wind: ["E", "NW", "glassy"], tide: "incoming to medium" },
    { name: "Jack’s (38th St.)", lat: 36.9525, lng: -121.9652, swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "low tide" },
    { name: "Capitola", lat: 36.9741, lng: -121.9535, swell: ["S", "SSW", "W"], wind: ["NW", "N", "glassy"], tide: "medium" },
    { name: "Pleasure Point", lat: 36.9532, lng: -121.9643, swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "glassy"], tide: "incoming, medium" },
    { name: "26th Ave.", lat: 36.9547, lng: -121.9603, swell: ["SW", "W", "NW"], wind: ["E"], tide: "low tide pushing back in" },
    { name: "Manresa", lat: 36.9401, lng: -121.8723, swell: ["W", "NW", "SW"], wind: ["E", "glassy"], tide: "incoming" },
    { name: "Steamer Lane", lat: 36.9512, lng: -122.0262, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "incoming, low to medium" },
    { name: "Indicators", lat: 36.9504, lng: -122.0285, swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: "incoming, low to medium" },
    { name: "Cowells", lat: 36.9511, lng: -122.0268, swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: "low to incoming" },
    { name: "Four Mile", lat: 37.0168, lng: -122.1561, swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: "incoming to high" },
    { name: "Waddell Creek", lat: 37.1016, lng: -122.2737, swell: ["NW", "W", "N"], wind: ["E"], tide: "incoming to high" }
];

async function fetchStormglassData(lat, lng) {
    const response = await fetch(`http://localhost:3000/tide-data?lat=${lat}&lng=${lng}`);
    const data = await response.json();
    return data;
}

async function displaySurfAlerts() {
    const alertsContainer = document.getElementById("surf-alerts");
    alertsContainer.innerHTML = '';

    for (const spot of surfSpots) {
        try {
            const tideData = await fetchStormglassData(spot.lat, spot.lng);
            const latestTide = tideData.data[0];

            const alertBox = document.createElement("div");
            alertBox.className = "alert-box";
            alertBox.innerHTML = `
                <h3>${spot.name}</h3>
                <p>Tide: ${latestTide.height}m (${latestTide.type})</p>
            `;

            alertsContainer.appendChild(alertBox);
        } catch (error) {
            console.error(`Error fetching data for ${spot.name}:`, error);
        }
    }
}

displaySurfAlerts();
setInterval(displaySurfAlerts, 1800000); // Auto-refresh every 30 minutes
