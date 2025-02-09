const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import CORS

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

app.get('/api/noaa-buoy', async (req, res) => {
    try {
        const buoyDataUrl = 'https://www.ndbc.noaa.gov/data/realtime2/46284.txt';
        console.log(`Fetching NOAA buoy data from: ${buoyDataUrl}`);
        
        const response = await axios.get(buoyDataUrl, { timeout: 10000 });

        if (response.status === 200) {
            console.log('NOAA buoy data retrieved successfully.');
            res.json({ data: response.data });
        } else {
            console.error(`NOAA responded with status: ${response.status}`);
            res.status(response.status).json({ error: 'Failed to fetch buoy data' });
        }
    } catch (error) {
        console.error('Error fetching buoy data:', error.message);
        res.status(500).json({ error: 'Failed to fetch buoy data' });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log(`Server is running on IPv4 port ${PORT}`);
});
