const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for frontend requests
app.use(cors());

// Stormglass API Key
const STORMGLASS_API_KEY = '711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003';

// Cache for tide data (since it doesn't need to be fetched repeatedly)
let cachedTideData = null;
let lastTideFetchTime = 0;

// Fetch Surf Forecast Data
app.get('/surf-forecast', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ error: 'Missing lat/lng parameters' });
    }

    try {
        const response = await axios.get(`https://api.stormglass.io/v2/weather/point`, {
            params: {
                lat,
                lng,
                params: 'windDirection,swellHeight,swellDirection',
            },
            headers: { Authorization: STORMGLASS_API_KEY },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching surf forecast:', error);
        res.status(500).json({ error: 'Failed to fetch surf forecast' });
    }
});

// Fetch Tide Data (Cache this to avoid multiple requests)
app.get('/tide-data', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ error: 'Missing lat/lng parameters' });
    }

    const now = Date.now();
    if (cachedTideData && now - lastTideFetchTime < 6 * 60 * 60 * 1000) {
        // Use cached tide data (valid for 6 hours)
        return res.json(cachedTideData);
    }

    try {
        const response = await axios.get(`https://api.stormglass.io/v2/tide/extremes/point`, {
            params: { lat, lng },
            headers: { Authorization: STORMGLASS_API_KEY },
        });

        cachedTideData = response.data;
        lastTideFetchTime = now;
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching tide data:', error);
        res.status(500).json({ error: 'Failed to fetch tide data' });
    }
});

app.listen(PORT, () => {
    console.log(`Surf Forecast API is running on port ${PORT}`);
});
