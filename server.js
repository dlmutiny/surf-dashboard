const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Enable CORS for frontend requests
app.use(cors());

// Proxy endpoint for NOAA buoy data
app.get('/api/noaa-buoy', async (req, res) => {
    const buoyId = req.query.buoy || '46284'; // Default to buoy 46284 if none provided
    const url = `https://www.ndbc.noaa.gov/data/realtime2/${buoyId}.txt`;

    try {
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching NOAA buoy data:', error);
        res.status(500).json({ error: 'Failed to fetch NOAA buoy data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://74.207.247.30:${PORT}`);
});

