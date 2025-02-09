const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/tide-data", async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const apiKey = "YOUR_STORMGLASS_API_KEY";

        const response = await axios.get(
            `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}`,
            { headers: { Authorization: apiKey } }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tide data", details: error });
    }
});

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
