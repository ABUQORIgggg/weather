// Add a loading indicator to your HTML
let loadingIndicator = document.querySelector('#loading');
let degree = document.querySelector('#degree');
let lon = document.querySelector('lon');
let lat = document.querySelector('lat');
let wnd = document.querySelector('#wind span');
let desc = document.querySelector('#description');
let wrapper = document.querySelector('.swiper-wrapper');
let today = document.querySelector('#today');
console.log(wrapper);
const API_KEY = "06z87yaos4kclazy07jxupkbgulmnpkqmjv27k3r";
const API_URL = "https://www.meteosource.com/api/v1/free/";
let city = "Tashkent";
let language = "en";
let sections = "all";

// Display loading indicator initially
loadingIndicator.style.display = 'block';

async function fetchData() {
    try {
        const response = await fetch(`${API_URL}find_places?text=${city}&language=${language}&key=${API_KEY}`);
        const data = await response.json();
        fetchWeather(data[0].place_id, data[0].lat, data[0].lon, sections);
    } catch (error) {
        console.error("Error fetching data:", error);
        // Hide loading indicator in case of an error
        loadingIndicator.style.display = 'none';
    }
}

// Call the async function
fetchData();

async function fetchWeather(place_id, lat, lon, sections) {
    try {
        let url;
        if (place_id) {
            url = `${API_URL}point?place_id=${place_id}&sections=${sections}&timezone=Asia%2FTashkent&language=en&units=auto&key=${API_KEY}`;
        } else if (lat && lon) {
            url = `${API_URL}point?lat=${lat}&lon=${lon}&sections=${sections}&timezone=Asia%2FTashkent&language=en&units=auto&key=${API_KEY}`;
        } else {
            throw new Error("Either place_id or lat+lon must be specified.");
        }

        const response = await fetch(url);
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Hide loading indicator in case of an error
        loadingIndicator.style.display = 'none';
    }
}

function updateUI(data) {
    console.log(data.hourly.data);

    // Hide loading indicator as data is available
    loadingIndicator.style.display = 'none';

    // ... (your existing logic for updating UI)

    let todayDate = new Date();
    today.innerHTML = todayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}
