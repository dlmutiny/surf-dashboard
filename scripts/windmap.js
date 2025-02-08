const WINDY_API_KEY = "y1esYKpYs4uYBBhxZtIH3nJ90gvCU7JH";

windyInit({
    key: WINDY_API_KEY,
    lat: 36.95,
    lon: -121.96,
    zoom: 10,
    overlay: "wind",
}, windyAPI => {
    const { map } = windyAPI;
    console.log("Windy Map initialized successfully!");
});
