async function checkSurfSpots() {
    const response = await fetch(`${API_CONFIG.openMeteoURL}?latitude=37&longitude=-122&hourly=wind_speed,wind_direction,wave_height,wave_period&timezone=auto`);
    const data = await response.json();
    if (!data.hourly || !data.hourly.wave_height) return;

    let alerts = [];
    if (data.hourly.wave_height[0] > 5) alerts.push("🔥 Good waves at Steamer Lane!");
    if (data.hourly.wind_speed[0] < 10) alerts.push("💨 Light offshore wind - clean conditions!");

    document.getElementById("alertBox").innerHTML = alerts.join("<br>");
}

checkSurfSpots();
setInterval(checkSurfSpots, 600000);
