document.addEventListener("DOMContentLoaded", function () {
    console.log("Fetching Surf Data...");

    fetchWeatherGovData();
});

async function fetchWeatherGovData() {
    const apiUrl = "https://api.weather.gov/gridpoints/MTR/90,120/forecast"; // Santa Cruz area

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
        { name: "Waddell Creek", swell: ["NW", "N", "E", "W"], wind: ["E"], tide: ["incoming", "high"] }
    ];

    const alertsList = document.getElementById("alertsList");
    alertsList.innerHTML = "";

    if (!data || !data.properties || !data.properties.periods) {
        console.error("Invalid Weather.gov data format.");
        return;
    }

    const forecast = data.properties.periods[0];  // Latest forecast period
    const windDir = forecast.windDirection || "Unknown";
    let rainChance = "Unknown";
    let swellHeight = "Unknown";

    // **Fix: Extract Rain Probability Properly**
    if (forecast.probabilityOfPrecipitation && forecast.probabilityOfPrecipitation.value !== null) {
        rainChance = `${forecast.probabilityOfPrecipitation.value}%`;
    } else {
        rainChance = "No Data";
    }

    // **Fix: Extract Swell Height Properly**
    if (forecast.waveHeight && forecast.waveHeight.value !== null) {
        swellHeight = `${forecast.waveHeight.value} ft`;
    } else {
        swellHeight = "No Data";
    }

    surfSpots.forEach(spot => {
        let matchScore = 0;
        let description = "";

        // Wind Check
        if (spot.wind.includes(windDir)) {
            matchScore += 1;
            description += `✅ Wind is ideal (${windDir}). `;
        } else {
            description += `❌ Wind not optimal (${windDir}). `;
        }

        // Swell Check
        if (swellHeight !== "No Data" && parseFloat(swellHeight) > 2) {
            matchScore += 1;
            description += `🌊 Swell is solid (${swellHeight}). `;
        } else {
            description += `⚠️ Small swell (${swellHeight}). `;
        }

        // Rain Check
        if (rainChance !== "No Data" && parseFloat(rainChance) < 20) {
            matchScore += 1;
            description += `☀️ Clear skies. `;
        } else {
            description += `🌧️ Possible rain (${rainChance}). `;
        }

        // Set Color Ranking
        let color = "gray";
        if (matchScore >= 3) {
            color = "green";
        } else if (matchScore === 2) {
            color = "yellow";
        } else {
            color = "red";
        }

        // Add to Alerts List
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong style="color:${color}">${spot.name}</strong> - ${description}`;
        alertsList.appendChild(listItem);
    });

    console.log("Surf Alerts Updated!");
}
