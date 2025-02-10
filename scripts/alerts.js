document.addEventListener('DOMContentLoaded', async function () {
    const surfSpots = [
        {
            name: "The Hook",
            lat: 36.9604,
            lng: -121.9673,
            swell: ["W", "NW", "S"],
            wind: ["E", "NW"],
            tide: ["incoming", "medium"],
            minPeriod: 10
        },
        {
            name: "Jack’s (38th St.)",
            lat: 36.9581,
            lng: -121.9685,
            swell: ["SSW", "SW", "W", "NW"],
            wind: ["NE", "N", "NW"],
            tide: ["low"],
            minPeriod: 10
        },
        {
            name: "Capitola",
            lat: 36.9762,
            lng: -121.9536,
            swell: ["S", "SSW", "W"],
            wind: ["NW", "N"],
            tide: ["medium"],
            minPeriod: 10
        },
        {
            name: "Pleasure Point",
            lat: 36.9565,
            lng: -121.9647,
            swell: ["SSW", "SW", "W", "WNW"],
            wind: ["NE", "N", "NW"],
            tide: ["incoming", "medium"],
            minPeriod: 10
        },
        {
            name: "26th Ave.",
            lat: 36.9625,
            lng: -121.9615,
            swell: ["SW", "W", "NW"],
            wind: ["E"],
            tide: ["low", "incoming"],
            minPeriod: 10
        },
        {
            name: "Manresa",
            lat: 36.8795,
            lng: -121.8415,
            swell: ["W", "NW", "SW"],
            wind: ["E"],
            tide: ["incoming", "medium"],
            minPeriod: 10
        },
        {
            name: "Steamer Lane",
            lat: 36.9514,
            lng: -122.0256,
            swell: ["W", "S", "NW"],
            wind: ["NE", "N", "NW"],
            tide: ["incoming", "low", "medium"],
            minPeriod: 12
        },
        {
            name: "Indicators",
            lat: 36.9518,
            lng: -122.0268,
            swell: ["W", "S", "NW"],
            wind: ["NE", "N", "NW"],
            tide: ["incoming", "low", "medium"],
            minPeriod: 12
        },
        {
            name: "Cowells",
            lat: 36.9526,
            lng: -122.0251,
            swell: ["W", "NW", "S"],
            wind: ["N", "NW"],
            tide: ["low", "incoming"],
            minPeriod: 10
        },
        {
            name: "Four Mile",
            lat: 37.0069,
            lng: -122.1704,
            swell: ["NW", "W", "WSW"],
            wind: ["NW", "N", "NE"],
            tide: ["incoming", "high"],
            minPeriod: 12
        },
        {
            name: "Waddell Creek",
            lat: 37.0992,
            lng: -122.2753,
            swell: ["W", "NW", "N"],
            wind: ["E"],
            tide: ["incoming", "high"],
            minPeriod: 10
        }
    ];

    async function fetchSurfData(lat, lng) {
        try {
            const response = await fetch(`https://experimentalsurfboards.com/surf-forecast/?lat=${lat}&lng=${lng}&source=sg`);
            const data = await response.json();
            return data.hours[0]; // Get the latest forecast data
        } catch (error) {
            console.error("Error fetching surf data:", error);
            return null;
        }
    }

    function convertDegreesToDirection(degrees) {
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return directions[Math.round(degrees / 22.5) % 16];
    }

    async function updateSurfAlerts() {
        const alertsContainer = document.getElementById("alerts-container");
        alertsContainer.innerHTML = "<p>Loading surf conditions...</p>";

        const spotData = await Promise.all(surfSpots.map(async (spot) => {
            const conditions = await fetchSurfData(spot.lat, spot.lng);
            if (!conditions) return null;

            const windDirection = convertDegreesToDirection(conditions.windDirection.noaa);
            const swellDirection = convertDegreesToDirection(conditions.swellDirection.noaa);
            const period = conditions.swellPeriod.noaa;
            const waveHeight = conditions.waveHeight.noaa;

            let matchScore = 0;

            if (spot.swell.includes(swellDirection)) matchScore += 3;
            if (spot.wind.includes(windDirection) || windDirection === "glassy") matchScore += 2;
            if (spot.tide.includes("incoming")) matchScore += 2; // Placeholder since tide data is not included
            if (period >= spot.minPeriod) matchScore += 2;
            if (waveHeight >= 1.0) matchScore += 1; // Adjust threshold as needed

            return {
                name: spot.name,
                matchScore,
                conditions: {
                    waveHeight,
                    swellDirection,
                    period,
                    windDirection
                }
            };
        }));

        const sortedSpots = spotData.filter(Boolean).sort((a, b) => b.matchScore - a.matchScore);

        alertsContainer.innerHTML = "";
        sortedSpots.forEach((spot) => {
            const spotElement = document.createElement("div");
            spotElement.className = "alert-item";
            spotElement.innerHTML = `
                <h3>${spot.name}</h3>
                <p>🔥 Match Score: ${spot.matchScore}</p>
            `;
            alertsContainer.appendChild(spotElement);
        });

        if (sortedSpots.length === 0) {
            alertsContainer.innerHTML = "<p>No matching surf conditions found.</p>";
        }
    }

    updateSurfAlerts();
    setInterval(updateSurfAlerts, 30 * 60 * 1000); // Update every 30 minutes
});
