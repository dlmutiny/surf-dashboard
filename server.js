const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// NOAA Buoy Data Route
app.get('/api/noaa-buoy', async (req, res) => {
    try {
        const buoyUrl = 'https://www.ndbc.noaa.gov/data/realtime2/46284.txt';
        const response = await axios.get(buoyUrl);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching NOAA buoy data:', error.message);
        res.status(500).json({ error: 'Failed to fetch buoy data' });
    }
});

// Default Route
app.get('/', (req, res) => {
    res.send('Surf Forecast API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
