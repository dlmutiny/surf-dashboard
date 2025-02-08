const surfSpots = [
    { name: "The Hook", swell: ["W", "NW", "S"], wind: ["E", "NW", "glassy"], tide: ["incoming", "medium"] },
    { name: "Jack’s (38th St.)", swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["low"] },
    { name: "Capitola", swell: ["S", "SSW", "W"], wind: ["NW", "N", "glassy"], tide: ["medium"] },
    { name: "Pleasure Point", swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "medium"] },
    { name: "26th Ave.", swell: ["SW", "W", "NW"], wind: ["E"], tide: ["low", "incoming"] },
    { name: "Manresa", swell: ["W", "NW", "SW"], wind: ["E", "glassy"], tide: ["any", "incoming"] },
    { name: "Steamer Lane", swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "low", "medium"] },
    { name: "Indicators", swell: ["W", "S", "NW"], wind: ["NE", "N", "NW", "glassy"], tide: ["incoming", "low", "medium"] },
    { name: "Cowells", swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: ["low", "incoming"] },
    { name: "Four Mile", swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: ["incoming", "high"] },
    { name: "Waddell Creek", swell: ["W", "NW", "N", "E"], wind: ["E"], tide: ["incoming", "high"] },
];

async function fetchNOAAData() {
    const noaaUrl = "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/surf"; // Placeholder, replace with actual endpoint
    try {
        let response = await fetch(noaaUrl);
        let data = await response.json();
        console.log("NOAA Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching NOAA data:", error);
        return null;
    }
}

async function fetchWindyData() {
    const windyUrl = "https://api.windy.com/v4/forecast?key=y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH"; // Replace with your API key
    try {
        let response = await fetch(windyUrl);
        let data = await response.json();
        console.log("Windy Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching Windy data:", error);
        return null;
    }
}

function getColorRank(score) {
    if (score === 3) return "🟢 Excellent";
    if (score === 2) return "🟡 Good";
    if (score === 1) return "🟠 Fair";
    return "🔴 Poor";
}

function generateSurfAlerts(windData, swellData) {
    let alerts = [];
    
    surfSpots.forEach(spot => {
        let score = 0;
        let reasons = [];

        // Check swell direction
        if (spot.swell.includes(swellData.direction)) {
            score++;
            reasons.push("✔️ Favorable swell direction");
        } else {
            reasons.push("❌ Swell direction is not ideal");
        }

        // Check wind direction
        if (spot.wind.includes(windData.direction)) {
            score++;
            reasons.push("✔️ Favorable wind conditions");
        } else {
            reasons.push("❌ Wind may cause chop or unfavorable conditions");
        }

        // Check tide condition
        if (spot.tide.includes(swellData.tide)) {
            score++;
            reasons.push("✔️ Optimal tide level");
        } else {
            reasons.push("❌ Tide is not ideal for this spot");
        }

        // Generate alert
        alerts.push({
            spot: spot.name,
            rank: getColorRank(score),
            reasons: reasons.join(", ")
        });
    });

    return alerts;
}

async function displaySurfAlerts() {
    const windData = await fetchWindyData();
    const swellData = await fetchNOAAData();

    if (!windData || !swellData) {
        console.error("Failed to retrieve data.");
        return;
    }

    const alerts = generateSurfAlerts(windData, swellData);
    
    let alertContainer = document.createElement("div");
    alertContainer.innerHTML = `<h2>Surf Alerts</h2>`;

    alerts.forEach(alert => {
        let alertElement = document.createElement("p");
        alertElement.innerHTML = `<strong>${alert.spot}:</strong> ${alert.rank}<br>${alert.reasons}`;
        alertContainer.appendChild(alertElement);
    });

    document.body.appendChild(alertContainer);
}

// Run alerts function after the page loads
window.onload = displaySurfAlerts;
