let degree = document.querySelector('#degree');
let lon = document.querySelector('lon');
let lat = document.querySelector('lat');
let wnd = document.querySelector('#wind span');
let desc = document.querySelector('#description');
let wrapper = document.querySelector('.swiper-wrapper');
let today = document.querySelector('#today');
const API_KEY = "06z87yaos4kclazy07jxupkbgulmnpkqmjv27k3r";
const API_URL = "https://www.meteosource.com/api/v1/free/";
let city = "Tashkent";
let language = "en";
let sections = "all";

// Add a loading indicator and result container to your HTML
let loadingContainer = document.querySelector('#loading-container');
let resultContainer = document.querySelector('#result-container');

// Function to show loading spinner
function showLoadingSpinner() {
    loadingContainer.style.display = 'flex';
}

// Function to hide loading spinner
function hideLoadingSpinner() {
    loadingContainer.style.display = 'none';
}

function updateUI(data) {
    // Update your UI with the fetched data
    // For example, you can append data to resultContainer
    resultContainer.innerHTML = JSON.stringify(data, null, 2);
}

async function fetchData() {
    try {
        const response = await fetch(`${API_URL}find_places?text=${city}&language=${language}&key=${API_KEY}`);
        const data = await response.json();
        fetchWeather(data[0].place_id, data[0].lat, data[0].lon, sections);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the async function
fetchData();

async function fetchWeather(place_id, lat, lon, sections) {
    try {
        showLoadingSpinner(); // Show loading spinner before fetching data

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

        let dateis = data.hourly.data[0];
        let currentTime = new Date();

        data.hourly.data.map(item => {
            let slide = document.createElement('div');
            let time = document.createElement('p');
            let gettime = item.date.slice(11, 16);
            let local = item.date.slice(11, 13);
            let img = document.createElement('img');
            let temp = document.createElement('p');

            if (item.weather === "overcast" || item.weather === "cloudy" || item.weather === 'partly_clear') {
                img.setAttribute('data-src', './images/cloudly.png') || img.setAttribute('data-src', './images/overcast.png');
            }
            // Add other conditions for different weather types...

            img.classList.add('max-w-[80px]');
            time.innerHTML = gettime;
            temp.innerHTML = item.temperature + "°";

            slide.append(time, img, temp);
            wrapper.append(slide);
        });

        desc.innerHTML = data.current.summary;
        degree.innerHTML = data.current.temperature + "°";
        wnd.innerHTML = data.current.wind.speed + ' speed';

        // Lazy loading for Swiper images
        swiper.lazy.load();
        swiper.update();

        updateUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    } finally {
        hideLoadingSpinner(); // Hide loading spinner after fetching data
    }
}
