const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Stormglass API Configuration
const STORMGLASS_API_KEY = '711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003'; // Replace with your actual API key
const BASE_URL = 'https://api.stormglass.io/v2';

// Cache tide data to minimize API requests
let cachedTideData = null;
let lastTideFetchTime = null;
const TIDE_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
    res.send('Surf Forecast API is running!');
});

// Surf Forecast API
app.get('/surf-forecast', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Missing lat/lng parameters' });
    }

    try {
        const response = await axios.get(`${BASE_URL}/weather/point`, {
            params: {
                lat,
                lng,
                params: 'windDirection,swellHeight,swellDirection',
            },
            headers: {
                'Authorization': STORMGLASS_API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching surf forecast:', error.message);
        res.status(500).json({ error: 'Failed to fetch surf forecast data' });
    }
});

// Tide Data API (Only fetch once every 6 hours)
app.get('/tide-data', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Missing lat/lng parameters' });
    }

    // Check if cached data is valid
    if (cachedTideData && lastTideFetchTime && (Date.now() - lastTideFetchTime) < TIDE_CACHE_DURATION) {
        console.log('Returning cached tide data');
        return res.json(cachedTideData);
    }

    try {
        const response = await axios.get(`${BASE_URL}/tide/extremes/point`, {
            params: { lat, lng },
            headers: { 'Authorization': STORMGLASS_API_KEY },
        });

        cachedTideData = response.data;
        lastTideFetchTime = Date.now();

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching tide data:', error.message);
        res.status(500).json({ error: 'Failed to fetch tide data' });
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

