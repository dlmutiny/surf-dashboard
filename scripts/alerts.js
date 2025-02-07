async function checkSurfSpots() {
    try {
        // Fetch Marine Data (Wave Height & Wave Period)
        const marineResponse = await fetch(
            "https://marine-api.open-meteo.com/v1/marine?latitude=37&longitude=-122&hourly=wave_height,wave_period&timezone=auto"
        );
        const marineData = await marineResponse.json();

        // Fetch Wind Data Separately from Weather API
        const windResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto"
        );
        const windData = await windResponse.json();

        // Check if responses contain expected data
        if (!marineData.hourly || !marineData.hourly.wave_height) {
            console.error("❌ Wave height data is missing!");
            return;
        }

        if (!windData.hourly || !windData.hourly.windspeed_10m) {
            console.error("❌ Wind data is missing!");
            return;
        }

        // Extract Marine Data
        const waveHeight = marineData.hourly.wave_height[0]; // Latest wave height
        const wavePeriod = marineData.hourly.wave_period[0]; // Latest wave period

        // Extract Wind Data
        const windSpeed = windData.hourly.windspeed_10m[0]; // Latest wind speed
        const windDirection = windData.hourly.winddirection_10m[0]; // Latest wind direction

        let alerts = [];

        // Generate Surf Spot Alerts
        if (waveHeight >= 5) {
            alerts.push("🔥 Good waves at Steamer Lane! (5ft+)");
        } else if (waveHeight < 2) {
            alerts.push("⚠️ Waves are too small for decent surf.");
        }

        if (windSpeed < 10) {
            alerts.push("💨 Light offshore wind - Clean conditions!");
        } else if (windSpeed > 20) {
            alerts.push("⚠️ Strong winds - Could be messy!");
        }

        // Display Alerts
        showAlerts(alerts);

    } catch (error) {
        console.error("⚠️ Error fetching surf conditions:", error);
    }
}

// Display alerts on-screen
function showAlerts(messages) {
    let alertBox = document.getElementById("alertBox");
    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.id = "alertBox";
        alertBox.style.position = "absolute";
        alertBox.style.top = "20px";
        alertBox.style.left = "20px";
        alertBox.style.background = "rgba(0, 0, 0, 0.8)";
        alertBox.style.color = "white";
        alertBox.style.padding = "10px";
        alertBox.style.borderRadius = "5px";
        alertBox.style.zIndex = "1000";
        document.body.appendChild(alertBox);
    }

    alertBox.innerHTML = `<strong>🌊 Surf Conditions:</strong><br>${messages.join("<br>")}`;
    alertBox.style.display = messages.length > 0 ? "block" : "none";
}

// Run every 10 minutes
checkSurfSpots();
setInterval(checkSurfSpots, 600000);
