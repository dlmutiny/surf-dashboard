async function updateForecastChart() {
    const response = await fetch(`${API_CONFIG.openMeteoURL}?latitude=37&longitude=-122&hourly=wave_height,wave_period&timezone=auto`);
    const data = await response.json();
    if (!data.hourly || !data.hourly.wave_height) return;

    new Chart(document.getElementById("forecastChart").getContext("2d"), {
        type: "line",
        data: { labels: Array.from({ length: 24 }, (_, i) => `${i}h`), datasets: [{ label: "Wave Height (ft)", data: data.hourly.wave_height, borderColor: "white" }] },
        options: { scales: { x: { display: false } }, plugins: { legend: { display: false } } }
    });
}

updateForecastChart();
setInterval(updateForecastChart, 600000);
