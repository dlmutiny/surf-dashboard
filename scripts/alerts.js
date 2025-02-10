document.addEventListener('DOMContentLoaded', async function () {
    const surfSpots = [
        { name: "The Hook", lat: 36.9604, lng: -121.9673, energyRange: [50, 100], swell: ["W", "NW", "S"], wind: ["E", "NW"], tide: ["incoming", "medium"], minPeriod: 10 },
        { name: "Jack’s (38th St.)", lat: 36.9581, lng: -121.9685, energyRange: [50, 100], swell: ["SSW", "SW", "W", "NW"], wind: ["NE", "N", "NW"], tide: ["low"], minPeriod: 10 },
        { name: "Capitola", lat: 36.9762, lng: -121.9536, energyRange: [30, 80], swell: ["S", "SSW", "W"], wind: ["NW", "N"], tide: ["medium"], minPeriod: 10 },
        { name: "Pleasure Point", lat: 36.9565, lng: -121.9647, energyRange: [50, 120], swell: ["SSW", "SW", "W", "WNW"], wind: ["NE", "N", "NW"], tide: ["incoming", "medium"], minPeriod: 10 },
        { name: "26th Ave.", lat: 36.9625, lng: -121.9615, energyRange: [50, 120], swell: ["SW", "W", "NW"], wind: ["E"], tide: ["low", "incoming"], minPeriod: 10 },
        { name: "Manresa", lat: 36.8795, lng: -121.8415, energyRange: [50, 150], swell: ["W", "NW", "SW"], wind: ["E"], tide: ["incoming", "medium"], minPeriod: 10 },
        { name: "Steamer Lane", lat: 36.9514, lng: -122.0256, energyRange: [100, 200], swell: ["W", "S", "NW"], wind: ["NE", "N", "NW"], tide: ["incoming", "low", "medium"], minPeriod: 12 },
        { name: "Indicators", lat: 36.9518, lng: -122.0268, energyRange: [50, 150], swell: ["W", "S", "NW"], wind: ["NE", "N", "NW"], tide: ["incoming", "low", "medium"], minPeriod: 12 },
        { name: "Cowells", lat: 36.9526, lng: -122.0251, energyRange: [30, 80], swell: ["W", "NW", "S"], wind: ["N", "NW"], tide: ["low", "incoming"], minPeriod: 10 },
        { name: "Four Mile", lat: 37.0069, lng: -122.1704, energyRange: [100, 180], swell: ["NW", "W", "WSW"], wind: ["NW", "N", "NE"], tide: ["incoming", "high"], minPeriod: 12 },
        { name: "Waddell Creek", lat: 37.0992, lng: -122.2753, energyRange: [100, 200], swell: ["W", "NW", "N"], wind: ["E"], tide: ["incoming", "high"], minPeriod: 10 }
    ];

    async function fetchSurfData(lat, lng) {
        try {
            const response = await fetch(`https://experimentalsurfboards.com/surf-forecast/?lat=${lat}&lng=${lng}`);
            const data = await response.json();
            return data.hours[0]; // Get latest forecast data
        } catch (error) {
            console.error("Error fetching surf data:", error);
            return null;
        }
    }

    function calculateWaveEnergy(height, period) {
        return height ** 2 * period;
    }

    function determineEnergyStatus(energy, min, max) {
        if (energy < min * 0.5) return "🟥 Flat";
        if (energy < min) return "🟡 Small";
        if (energy <= max) return "🟢 Optimal";
        return "🟠 Heavy Surf";
    }

    async function updateSurfAlerts() {
        const alertsContainer = document.getElementById("alerts-container");
        alertsContainer.innerHTML = "<p>Loading surf conditions...</p>";

        const spotData = await Promise.all(surfSpots.map(async (spot) => {
            const conditions = await fetchSurfData(spot.lat, spot.lng);
            if (!conditions) return null;

            const waveHeight = conditions.waveHeight.noaa || 0;
            const swellPeriod = conditions.swellPeriod.noaa || 0;
            const swellDirection = conditions.swellDirection.noaa || "N/A";
            const windDirection = conditions.windDirection.noaa || "N/A";
            const energy = calculateWaveEnergy(waveHeight, swellPeriod);
            const energyStatus = determineEnergyStatus(energy, spot.energyRange[0], spot.energyRange[1]);

            let matchScore = 0;
            if (spot.swell.includes(swellDirection)) matchScore += 3;
            if (spot.wind.includes(windDirection) || windDirection === "glassy") matchScore += 2;
            if (energyStatus === "🟢 Optimal") matchScore += 3;
            if (swellPeriod >= spot.minPeriod) matchScore += 2;
            if (waveHeight >= 1.0) matchScore += 1;

            return { name: spot.name, matchScore, conditions: { waveHeight, swellDirection, swellPeriod, windDirection, energyStatus } };
        }));

        const sortedSpots = spotData.filter(Boolean).sort((a, b) => b.matchScore - a.matchScore);
        alertsContainer.innerHTML = "";
        sortedSpots.forEach((spot) => {
            const spotElement = document.createElement("div");
            spotElement.className = "alert-item";
            spotElement.innerHTML = `
                <h3>${spot.name}</h3>
                <p>🔥 Match Score: ${spot.matchScore}</p>
                <p>🌊 Wave Height: ${spot.conditions.waveHeight.toFixed(1)}m</p>
                <p>💨 Wind Direction: ${spot.conditions.windDirection}</p>
                <p>🌊 Swell Direction: ${spot.conditions.swellDirection}</p>
                <p>⏳ Swell Period: ${spot.conditions.swellPeriod}s</p>
                <p>⚡ Wave Energy: ${spot.conditions.energyStatus}</p>
            `;
            alertsContainer.appendChild(spotElement);
        });

        if (sortedSpots.length === 0) {
            alertsContainer.innerHTML = "<p>No matching surf conditions found.</p>";
        }
    }

    updateSurfAlerts();
    setInterval(updateSurfAlerts, 30 * 60 * 1000); // Update every 30 min
});
