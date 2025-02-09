const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const NOAA_BUOY_URL = "https://www.ndbc.noaa.gov/data/realtime2/46284.txt";

// Endpoint to fetch NOAA buoy data and bypass CORS issues
app.get('/api/noaa-buoy', async (req, res) => {
    try {
        const response = await axios.get(NOAA_BUOY_URL);
        res.send(response.data);
    } catch (error) {
        console.error("Error fetching NOAA buoy data:", error);
        res.status(500).send("Failed to fetch buoy data");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://74.207.247.30:${PORT}`);
});
