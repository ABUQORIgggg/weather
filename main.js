let degree = document.querySelector('#degree')
let lon = document.querySelector('lon')
let lat = document.querySelector('lat')
let wnd = document.querySelector('#wind span')
let desc = document.querySelector('#description')
let wrapper = document.querySelector('.swiper-wrapper')
let today = document.querySelector('#today')
console.log(wrapper)
const API_KEY = "06z87yaos4kclazy07jxupkbgulmnpkqmjv27k3r";
const API_URL = "https://www.meteosource.com/api/v1/free/";
let city = "Tashkent";
let language = "en";
let sections = "all"
async function fetchData() {
    try {
        const response = await fetch(`${API_URL}find_places?text=${city}&language=${language}&key=${API_KEY}`);
        const data = await response.json();
        fetchWeather(data[0].place_id, data[0].lat, data[0].lon, sections)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the async function
fetchData();

async function fetchWeather(place_id, lat, lon, sections) {
    try {
        let url;
        if (place_id) {
            // If place_id is available, use it
            url = `${API_URL}point?place_id=${place_id}&sections=${sections}&timezone=Asia%2FTashkent&language=en&units=auto&key=${API_KEY}`;
        } else if (lat && lon) {
            // If lat and lon are available, use them+
            url = `${API_URL}point?lat=${lat}&lon=${lon}&sections=${sections}&timezone=Asia%2FTashkent&language=en&units=auto&key=${API_KEY}`;
        } else {
            throw new Error("Either place_id or lat+lon must be specified.");
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data.hourly.data)

        let dateis = data.hourly.data[0]
        let currentTime = new Date()

        data.hourly.data.map(item => {
            let slide = document.createElement('div')
            let time = document.createElement('p')
            let gettime = item.date.slice(11, 16)
            let local = item.date.slice(11, 13)
            let img = document.createElement('img')
            let temp = document.createElement('p')

            console.log(currentTime.getHours() == local)
            if (item.weather === "overcast" || item.weather === "cloudy" || item.weather === 'partly_clear') { img.setAttribute('src', './images/cloudly.png') || img.setAttribute('src', './images/overcast.png') }
            if (item.weather === "mostly_clear" && currentTime.getHours() == local) { img.setAttribute('src', './images/night.png')  }
            if (item.weather === "sun" || item.weather === "partly_sunny") { img.setAttribute('src', './images/sunny.png') }
            if (item.weather === "fog") { img.setAttribute('src', './images/wind.png') }
            if (item.weather === "light_rain") { img.setAttribute('src', './images/rain-lighting.png') }
            if (item.weather === "rain") { img.setAttribute('src', './images/rain.png') }
            if (item.weather === "mostly_cloudy") { img.setAttribute('src', './images/overcast.png') }

            img.classList.add('max-w-[80px]')
            time.innerHTML = gettime
            temp.innerHTML = item.temperature + "°"
            function WaitMonth() {
                let t = item.date.slice(5, 7)
                if (t == "12") {
                    return "December"
                } else if (t == "11") {
                    return "November"
                } else if (t == "10") {
                    return "October"
                } else if (t == "9") {
                    return "September"
                } else if (t == "8") {
                    return "August"
                } else if (t == "7") {
                    return "July"
                } else if (t == "6") {
                    return "Juny"
                } else if (t == "5") {
                    return "May"
                } else if (t == "4") {
                    return "April"
                } else if (t == "3") {
                    return "March"
                } else if (t == "2") {
                    return "February"
                } else {
                    return "January"
                }
            }
            function WaitingDay() {
                let t = dateis.date.slice(8, 10)

                if (t.includes("T")) {
                    return t = t.slice(0, t.indexOf("T"));
                }

                return t
            }
            today.innerHTML = WaitMonth() + ", " + WaitingDay()
            

            slide.classList.add('swiper-slide', 'w-full', 'flex', 'flex-col', 'items-center', 'py-5')

            slide.append(time, img, temp)
            wrapper.append(slide)
        })
        desc.innerHTML = data.current.summary
        degree.innerHTML = data.current.temperature + "°"
        wnd.innerHTML = data.current.wind.speed + ' speed'
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Add a loading indicator and result container to your HTML
let loadingContainer = document.querySelector('#loading-container');
let resultContainer = document.querySelector('#result-container');

async function fetchData() {
    try {
        const response = await fetch('your-api-endpoint');
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors, e.g., show an error message
    } finally {
        // Hide loading container after fetching data
        loadingContainer.style.display = 'none';
    }
}

// Call the async function
fetchData();

function updateUI(data) {
    // Update your UI with the fetched data
    // For example, you can append data to resultContainer
    resultContainer.innerHTML = JSON.stringify(data, null, 2);
}


