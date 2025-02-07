const map = L.map("windMap", { center: [37, -122], zoom: 5 });

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "© ESRI"
}).addTo(map);

async function updateWindMap() {
    try {
        const response = await fetch(`${API_CONFIG.openMeteoURL}?latitude=37&longitude=-122&hourly=wind_speed,wind_direction,wave_height,wave_period&timezone=auto`);
        const data = await response.json();
        if (!data.hourly || !data.hourly.wind_speed) return;

        map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) map.removeLayer(layer);
        });

        data.hourly.wind_speed.forEach((speed, i) => {
            let lat = 37 + (Math.random() * 5 - 2.5);
            let lon = -122 + (Math.random() * 5 - 2.5);
            L.circleMarker([lat, lon], { radius: speed / 3, color: `hsl(${240 - speed * 10}, 100%, 50%)`, fillOpacity: 0.7 }).addTo(map);
        });

    } catch (error) {
        console.error("Wind map update failed:", error);
    }
}

updateWindMap();
setInterval(updateWindMap, 600000);
