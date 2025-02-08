document.addEventListener("DOMContentLoaded", function () {
    console.log("Fetching Surf Data...");

    fetchWeatherGovData();
});

async function fetchWeatherGovData() {
    const apiUrl = "https://api.weather.gov/gridpoints/MTR/90,120/forecast";  // Forecast for Santa Cruz area

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Weather.gov API Error: " + response.statusText);

        const data = await response.json();
        console.log("Weather.gov Data Received:", data);

        displaySurfAlerts(data);
    } catch (error) {
        console.error("Error fetching Weather.gov data:", error);
    }
}

function displaySurfAlerts(data) {
    const surfSpots = [
        {
            name: "The Hook",
            swell: ["W", "NW", "S"],
            wind: ["E", "NW", "glassy"],
            tide: ["incoming", "medium"]
        },
        {
            name: "Jack’s (38th St.)",
            swell: ["SSW", "SW", "W", "NW"],
            wind: ["NE", "N", "NW", "glassy"],
            tide: ["low"]
        },
        {
            name: "Pleasure Point",
            swell: ["SSW", "SW", "W", "WNW"],
            wind: ["NE", "N", "NW", "glassy"],
            tide: ["incoming", "medium"]
        }
        // Add other surf spots following the same format
    ];

    const alertsList = document.getElementById("alertsList");
    alertsList.innerHTML = "";

    if (!data || !data.properties || !data.properties.periods) {
        console.error("Invalid Weather.gov data format.");
        return;
    }

    const forecast = data.properties.periods[0];  // Get the latest forecast period
    const windDir = forecast.windDirection || "Unknown";
    const swellHeight = forecast.waveHeight || "Unknown";
    const rainChance = forecast.probabilityOfPrecipitation || "Unknown";

    surfSpots.forEach(spot => {
        let matchScore = 0;
        let description = "";

        if (spot.wind.includes(windDir)) {
            matchScore += 1;
            description += `✅ Wind is ideal (${windDir}). `;
        } else {
            description += `❌ Wind not optimal (${windDir}). `;
        }

        if (swellHeight !== "Unknown" && swellHeight > 2) {
            matchScore += 1;
            description += `🌊 Swell is solid (${swellHeight} ft). `;
        } else {
            description += `⚠️ Small swell (${swellHeight} ft). `;
        }

        if (rainChance !== "Unknown" && rainChance < 20) {
            matchScore += 1;
            description += `☀️ Clear skies. `;
        } else {
            description += `🌧️ Possible rain (${rainChance}%). `;
        }

        let color = "gray";
        if (matchScore >= 3) {
            color = "green";
        } else if (matchScore === 2) {
            color = "yellow";
        } else {
            color = "red";
        }

        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong style="color:${color}">${spot.name}</strong> - ${description}`;
        alertsList.appendChild(listItem);
    });

    console.log("Surf Alerts Updated!");
}
