document.addEventListener("DOMContentLoaded", function () {
    console.log("Fetching Surf Data...");

    fetchNOAAData();
    fetchWindyData();
});

async function fetchNOAAData() {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const noaaUrl = "https://api.weather.gov/gridpoints/MTR/90,120/forecast";  // NOAA API for Santa Cruz

    try {
        const response = await fetch(proxyUrl + noaaUrl);
        if (!response.ok) throw new Error("NOAA API Error: " + response.statusText);

        const data = await response.json();
        console.log("NOAA Data Received:", data);

        displaySurfAlerts(data);
    } catch (error) {
        console.error("Error fetching NOAA data:", error);
    }
}

async function fetchWindyData() {
    const windyUrl = `https://api.windy.com/api/point-forecast/v2?lat=36.985695&lon=-122.00287&model=gfs&parameters=wind,swell&key=y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH`;

    try {
        const response = await fetch(windyUrl);
        if (!response.ok) throw new Error("Windy API Error: " + response.statusText);

        const data = await response.json();
        console.log("Wind Data Received:", data);

        displaySurfAlerts(data);
    } catch (error) {
        console.error("Error fetching Windy API data:", error);
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

    surfSpots.forEach(spot => {
        let matchScore = 0;
        let description = "";

        if (data?.properties?.periods?.[0]?.windDirection) {
            const windDir = data.properties.periods[0].windDirection;
            if (spot.wind.includes(windDir)) {
                matchScore += 1;
                description += `✅ Wind is ideal (${windDir}). `;
            } else {
                description += `❌ Wind not optimal (${windDir}). `;
            }
        }

        if (data?.properties?.periods?.[0]?.waveHeight) {
            const swellHeight = data.properties.periods[0].waveHeight;
            if (swellHeight > 2) {
                matchScore += 1;
                description += `🌊 Swell is solid (${swellHeight} ft). `;
            } else {
                description += `⚠️ Small swell (${swellHeight} ft). `;
            }
        }

        if (data?.properties?.periods?.[0]?.probabilityOfPrecipitation) {
            const rainChance = data.properties.periods[0].probabilityOfPrecipitation;
            if (rainChance < 20) {
                matchScore += 1;
                description += `☀️ Clear skies. `;
            } else {
                description += `🌧️ Possible rain (${rainChance}%). `;
            }
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
