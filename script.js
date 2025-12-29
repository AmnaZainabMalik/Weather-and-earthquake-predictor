document.getElementById('getWeatherBtn').addEventListener('click', getWeather);

async function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = '27c6a4d1d2db7d4eebec056fd2bb789c'; // Replace with your OpenWeatherMap API Key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    if (city === '') {
        alert("Please enter a city name.");
        return;
    }

    try {
        // Fetch weather data
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === '404') {
            alert("City not found. Please try again.");
            return;
        }

        const { name, main, weather, wind } = weatherData;

        // Display weather data
        document.getElementById('cityName').textContent = `Weather in ${name}`;
        document.getElementById('temperature').textContent = `Temperature: ${main.temp}°C`;
        document.getElementById('description').textContent = `Condition: ${weather[0].description}`;
        document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
        document.getElementById('windSpeed').textContent = `Wind Speed: ${wind.speed} m/s`;
        document.getElementById('windDirection').textContent = `Wind Direction: ${wind.deg}°`;

        // Get latitude and longitude for earthquake prediction
        const lat = weatherData.coord.lat;
        const lon = weatherData.coord.lon;

        // Fetch earthquake data
        const earthquakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradius=100`;
        const earthquakeResponse = await fetch(earthquakeUrl);
        const earthquakeData = await earthquakeResponse.json();

        // Calculate earthquake chance based on recent events in the area
        const recentEarthquakes = earthquakeData.features.length;
        const earthquakeChance = calculateEarthquakeChance(recentEarthquakes);

        // Display earthquake chance
        document.getElementById('earthquakeChance').textContent = `Earthquake Chance: ${earthquakeChance}%`;

    } catch (error) {
        console.error(error);
        alert("Error fetching data. Please try again.");
    }
}

function calculateEarthquakeChance(recentEarthquakes) {
    // If there are recent earthquakes in the area, increase the chance
    if (recentEarthquakes >= 5) {
        return 50;
    } else if (recentEarthquakes >= 2) {
        return 30;
    } else if (recentEarthquakes >= 1) {
        return 10;
    } else {
        return 0;
    }
}
