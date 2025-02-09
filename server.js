const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// NOAA Buoy Data Route
app.get('/api/noaa-buoy', async (req, res) => {
    try {
        const response = await fetch('https://www.ndbc.noaa.gov/data/realtime2/46284.txt');
        if (!response.ok) {
            throw new Error('Failed to fetch NOAA buoy data');
        }
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching NOAA buoy data:', error);
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
