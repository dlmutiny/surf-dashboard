async function checkSurfSpots() {
    try {
        console.log("Fetching Surf Data...");
        const marineResponse = await fetch(
            "https://marine-api.open-meteo.com/v1/marine?latitude=37&longitude=-122&hourly=wave_height,wave_period&timezone=auto"
        );
        const marineData = await marineResponse.json();
        console.log("✅ Marine Data Received:", marineData);

        const windResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto"
        );
        const windData = await windResponse.json();
        console.log("✅ Wind Data Received:", windData);

        if (!marineData.hourly || !marineData.hourly.wave_height) {
            console.error("❌ Wave height data is missing!");
            return;
        }
        if (!windData.hourly || !windData.hourly.windspeed_10m) {
            console.error("❌ Wind data is missing!");
            return;
        }

        const waveHeight = marineData.hourly.wave_height[0];
        const windSpeed = windData.hourly.windspeed_10m[0];

        console.log(`✅ Wave Height: ${waveHeight}m, Wind Speed: ${windSpeed} km/h`);

        let alerts = [];
        if (waveHeight >= 5) {
            alerts.push("🔥 Good waves at Steamer Lane! (5ft+)");
        }
        if (windSpeed < 10) {
            alerts.push("💨 Light offshore wind - Clean conditions!");
        }

        showAlerts(alerts);
    } catch (error) {
        console.error("⚠️ Error fetching surf conditions:", error);
    }
}

// Function to show alerts
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

