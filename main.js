let degree = document.querySelector('#degree')
let lon = document.querySelector('lon')
let lat = document.querySelector('lat')
let wnd = document.querySelector('#wind span')
let desc = document.querySelector('#description')
let wrapper = document.querySelector('.swiper-wrapper')
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
            // If lat and lon are available, use them
            url = `${API_URL}point?lat=${lat}&lon=${lon}&sections=${sections}&timezone=Asia%2FTashkent&language=en&units=auto&key=${API_KEY}`;
        } else {
            throw new Error("Either place_id or lat+lon must be specified.");
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data.hourly.data)
        data.hourly.data.map(item => {
            let slide = document.createElement('div')
            let time = document.createElement('p')
            let gettime = item.date.slice(11, 16)
            let img = document.createElement('img')
            let temp = document.createElement('p')

            if (item.weather === "overcast" || item.weather === "cloudy" || item.weather === 'partly_clear') { img.setAttribute('src', './images/cloudly.png') || img.setAttribute('src', './images/overcast.png') }
            if (item.weather === "sun") { g.setAttribute('src', './images/sun.png') }

            img.classList.add('max-w-[80px]')
            time.innerHTML = gettime
            temp.innerHTML = item.temperature

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


