let canvas, gl, particles = [];

const map = L.map("windMap", {
    center: [37, -122], 
    zoom: 5,
    zoomControl: false,
    preferCanvas: true,
    maxZoom: 10,
    minZoom: 3
}).setView([37, -122], 5);

// Add OpenStreetMap Tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 10
}).addTo(map);

// Initialize WebGL Canvas
function initWindCanvas() {
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.zIndex = "999";
    document.body.appendChild(canvas);
    
    gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("WebGL is not supported!");
        return;
    }
}

// Generate Particles
function generateParticles(numParticles) {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 2 + 1,
            direction: Math.random() * 360
        });
    }
}

// Render Particles (Wind Effect)
function renderParticles() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    particles.forEach(p => {
        p.x += p.speed * Math.cos((p.direction * Math.PI) / 180);
        p.y += p.speed * Math.sin((p.direction * Math.PI) / 180);

        // Wrap particles when they go off the screen
        if (p.x > canvas.width) p.x = 0;
        if (p.y > canvas.height) p.y = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y < 0) p.y = canvas.height;

        // Draw the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(renderParticles);
}

// Fetch Wind Data and Adjust Particle Direction and Speed
async function updateWindOverlay() {
    try {
        console.log("Fetching Wind Data...");
        const windResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=37&longitude=-122&hourly=windspeed_10m,winddirection_10m&timezone=auto"
        );
        const windData = await windResponse.json();
        console.log("✅ Wind Data Received:", windData);

        if (!windData.hourly || !windData.hourly.windspeed_10m) {
            console.error("❌ Wind Data Missing!");
            return;
        }

        const windSpeed = windData.hourly.windspeed_10m[0];
        const windDirection = windData.hourly.winddirection_10m[0];

        // Adjust particle speeds and directions based on wind data
        particles.forEach(p => {
            p.speed = windSpeed / 5 + Math.random() * 0.5;
            p.direction = windDirection + (Math.random() * 20 - 10); // Add slight randomness
        });

        console.log(`✅ Wind Speed: ${windSpeed} km/h, Direction: ${windDirection}°`);
    } catch (error) {
        console.error("⚠️ Wind Overlay Update Failed:", error);
    }
}

// Initialize Everything
initWindCanvas();
generateParticles(1000);
updateWindOverlay();
renderParticles();

// Update Wind Data Every 10 Minutes
setInterval(updateWindOverlay, 600000);
