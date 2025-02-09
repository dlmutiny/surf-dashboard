const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;
const STORMGLASS_API_KEY = "711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003"; // Replace with your actual API key

// Enable CORS
app.use(cors());

// API Route for Fetching Tide Data
app.get("/tide-data", async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: "Missing lat/lng parameters" });
        }

        const response = await axios.get(
            `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}`,
            { headers: { Authorization: STORMGLASS_API_KEY } }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching tide data:", error.response ? error.response.data : error);
        res.status(500).json({ error: "Failed to fetch tide data" });
    }
});

// Start the Server
app.listen(PORT, () => console.log(`🌊 Tide Data Proxy running on http://localhost:${PORT}`));
