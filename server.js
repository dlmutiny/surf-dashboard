const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Use CORS to allow frontend requests
app.use(cors());

const STORMGLASS_API_KEY = '711783d0-e669-11ef-9159-0242ac130003-71178470-e669-11ef-9159-0242ac130003';

// API route to fetch surf forecast from Stormglass.io
app.get('/surf-forecast', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ error: "Latitude and longitude are required." });
        }

        const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=waveHeight,windSpeed,windDirection,swellHeight,swellPeriod,swellDirection&source=noaa`;

        console.log(`Fetching surf forecast from Stormglass.io: ${url}`);

        const response = await axios.get(url, {
            headers: { 'Authorization': STORMGLASS_API_KEY },
            timeout: 10000
        });

        if (response.status === 200) {
            console.log('Stormglass.io data retrieved successfully.');
            return res.json(response.data);
        } else {
            console.error(`Stormglass.io responded with status: ${response.status}`);
            return res.status(response.status).json({ error: 'Failed to fetch surf forecast' });
        }
    } catch (error) {
        console.error('Error fetching Stormglass.io data:', error.message);
        return res.status(500).json({ error: 'Failed to fetch surf forecast' });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
