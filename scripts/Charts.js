async function fetchTideData(lat, lng) {
    try {
        const response = await fetch(`https://experimentalsurfboards.com/surf-forecast/?lat=${lat}&lng=${lng}`);
        const data = await response.json();
        return data.tide ? data.tide.hours : [];
    } catch (error) {
        console.error("Error fetching tide data:", error);
        return [];
    }
}

async function drawTideChart() {
    const tideData = await fetchTideData(36.9604, -121.9673); // Example: The Hook location
    if (!tideData.length) return;

    const ctx = document.getElementById("tide-chart").getContext("2d");

    const tideTimes = tideData.map(d => new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const tideHeights = tideData.map(d => d.sg || d.noaa);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: tideTimes,
            datasets: [{
                label: "Tide Height (ft)",
                data: tideHeights,
                borderColor: "black",
                backgroundColor: "rgba(0, 0, 255, 0.3)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false },
                x: { display: true }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", drawTideChart);
