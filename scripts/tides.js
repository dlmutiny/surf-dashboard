async function checkTideConditions() {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(`${API_CONFIG.noaaTidesURL}?begin_date=${today}&range=24&station=9413745&product=predictions&datum=STND&interval=h&units=english&time_zone=gmt&format=json`);
    const data = await response.json();
    if (!data.predictions) return;

    let tideBox = document.getElementById("tideBox");
    tideBox.innerHTML = `<strong>Tide: ${data.predictions[0].v} ft</strong>`;
}

checkTideConditions();
setInterval(checkTideConditions, 600000);
