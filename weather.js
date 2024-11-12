document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '878be5c615fdbdf3d09136969e033125';
    let unit = 'metric';

    const searchButton = document.getElementById('search-button');
    const currentLocationButton = document.getElementById('current-location');
    const toggleUnitButton = document.getElementById('toggle-unit');
    const cityInput = document.getElementById('city-input');
    const locationElement = document.getElementById('location');
    const weatherIcon = document.getElementById('weather-icon');
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');
    const weatherConditionElement = document.getElementById('weather-condition');
    const forecastCards = document.getElementById('forecast-cards');

    const getWeatherData = (city) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)
            .then(response => response.json())
            .then(data => {
                locationElement.textContent = data.name;
                weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                temperatureElement.textContent = `Temperature: ${data.main.temp}°${unit === 'metric' ? 'C' : 'F'}`;
                humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
                windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`;
                weatherConditionElement.textContent = data.weather[0].description;
            })
            .catch(error => console.error('Error fetching weather data:', error));
    };



    const getForecastData = (city) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`)
            .then(response => response.json())
            .then(data => {
                const forecastData = data.list;
                forecastCards.innerHTML = '';
                for (let i = 0; i < forecastData.length; i += 8) {
                    const day = forecastData[i];
                    const card = document.createElement('div');
                    card.classList.add('forecast-card');
                    card.innerHTML = `
    <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon">
    <p>${day.main.temp_min}° / ${day.main.temp_max}°</p>
  `;
                    forecastCards.appendChild(card);
                }
            })
            .catch(error => console.error('Error fetching forecast data:', error));
    };

    searchButton.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            getWeatherData(city);
            getForecastData(city);
        }
    });

    currentLocationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`)
                    .then(response => response.json())
                    .then(data => {
                        const city = data.name;
                        getWeatherData(city);
                        getForecastData(city);
                    })
                    .catch(error => console.error('Error fetching location weather:', error));
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    });

    toggleUnitButton.addEventListener('click', () => {
        unit = unit === 'metric' ? 'imperial' : 'metric';
        toggleUnitButton.textContent = unit === 'metric' ? '℃ / ℉' : '℉ / ℃';
    });
});
