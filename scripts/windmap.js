// Load Windy Wind Plugin
const windyScript = document.createElement("script");
windyScript.src = "./scripts/windy-plugin-wind.js";
document.head.appendChild(windyScript);

const map = L.map("windMap", {
    center: [37, -122], 
    zoom: 5,
    zoomControl: false,
    preferCanvas: true,
    maxZoom: 10,
    minZoom: 3
}).setView([37, -122], 5);

// Add OpenStreetMap Tiles as Base Layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 10
}).addTo(map);

// Initialize Windy Wind Plugin
windyScript.onload = () => {
    console.log("✅ Windy Plugin Loaded");

    // Create Wind Layer
    const windLayer = new WindyPluginWind({
        map: map, // Attach to Leaflet Map
        apiKey: "YOUR_WINDY_API_KEY", // Get Free API Key from Windy.com
        opacity: 0.7, // Adjust transparency
        particleColor: "rgba(255, 255, 255, 0.8)", // White wind particles
        speedFactor: 0.02, // Adjust animation speed
        lineWidth: 1.5, // Thickness of wind lines
    });

    windLayer.addTo(map);
    console.log("✅ Windy-Style Wind Overlay Added");
};

// Refresh Wind Data Every 10 Minutes
setInterval(() => {
    console.log("🔄 Refreshing Wind Overlay...");
    windyScript.onload();
}, 600000);
