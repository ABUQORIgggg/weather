document.addEventListener('DOMContentLoaded', () => {
    let degree = document.querySelector('#degree');
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

    // Initialize Swiper
    let swiper;

    // Function to show loading spinner or text
    function showLoading() {
        loadingContainer.style.display = 'flex';
        resultContainer.style.display = "none";
    }

    // Function to hide loading spinner and update result text
    function hideLoadingAndShowData() {
        loadingContainer.style.display = 'none';
        resultContainer.style.display = "block";
    }

    function updateUI(data) {
        // Update current weather
        desc.innerHTML = data.current.summary;
        degree.innerHTML = data.current.temperature + "°";
        wnd.innerHTML = data.current.wind.speed + ' m/s'; // Adjust the units if needed
    
        // Update today's date
        let currentDate = new Date();
        today.innerHTML = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
        // Update hourly forecast
        wrapper.innerHTML = ''; // Clear previous forecast
        data.hourly.data.forEach(item => {
            let slide = document.createElement('div');
            let time = document.createElement('p');
            let img = document.createElement('img');
            let temp = document.createElement('p');
    
            // Adjust image source based on weather condition
            // (Replace with your own logic and image URLs)
            img.setAttribute('src', getWeatherImage(item.weather));
            img.classList.add('max-w-[80px]');
    
            time.innerHTML = new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            temp.innerHTML = item.temperature + "°";
    
            slide.classList.add('swiper-slide', 'flex', 'flex-col', 'items-center', 'py-1');
            slide.append(time, img, temp);
            wrapper.append(slide);
        });
    
   
    }
    async function fetchLocation() {
        try {
            const response = await fetch(`${API_URL}find_places?text=${city}&language=${language}&key=${API_KEY}`);
            const data = await response.json();
            console.log(data);
            return { place_id: data[0].place_id, lat: data[0].lat, lon: data[0].lon };
        } catch (error) {
            console.error("Error fetching location data:", error);
            throw error; // Propagate the error to the caller
        }
    }

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
            return data;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            throw error; // Propagate the error to the caller
        }
    }

    async function fetchData() {
        try {
            showLoading();

            const locationData = await fetchLocation();
            const weatherData = await fetchWeather(locationData.place_id, locationData.lat, locationData.lon, sections);
            let dateis = weatherData.hourly.data[0];
            let currentTime = new Date();

            weatherData.hourly.data.forEach(item => {
                let slide = document.createElement('div');
                let time = document.createElement('p');
                let gettime = item.date.slice(11, 16);
                let local = item.date.slice(11, 13);
                let img = document.createElement('img');
                let temp = document.createElement('p');

                if (item.weather === "overcast" || item.weather === "cloudy" || item.weather === 'partly_clear') {
                    img.setAttribute('src', './images/cloudly.png') || img.setAttribute('src', './images/overcast.png');
                }
                if (item.weather === "mostly_clear" && currentTime.getHours() == local) {
                    img.setAttribute('src', './images/night.png');
                }
                if (item.weather === "sun" || item.weather === "partly_sunny") {
                    img.setAttribute('src', './images/sunny.png');
                }
                if (item.weather === "fog") {
                    img.setAttribute('src', './images/wind.png');
                }
                if (item.weather === "light_rain") {
                    img.setAttribute('src', './images/rain-lighting.png');
                }
                if (item.weather === "rain") {
                    img.setAttribute('src', './images/rain.png');
                }
                if (item.weather === "mostly_cloudy") {
                    img.setAttribute('src', './images/overcast.png');
                }

                img.classList.add('max-w-[80px]');
                time.innerHTML = gettime;
                temp.innerHTML = item.temperature + "°";

                function WaitMonth() {
                    let t = item.date.slice(5, 7);
                    function WaitMonth(monthNumber) {
                        const months = [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December"
                        ];

                        return months[monthNumber - 1];
                    }

                    let monthNumber = t;
                    let monthName = WaitMonth(monthNumber);
                    console.log(monthName); // Output: "January"

                    return monthName;
                }

                function WaitingDay() {
                    let t = dateis.date.slice(8, 10);
                    return t;
                }

                today.innerHTML = WaitMonth() + ", " + WaitingDay();

                slide.classList.add('swiper-slide', 'flex', 'flex-col', 'items-center', 'py-1');
                slide.append(time, img, temp);
                wrapper.append(slide);
            });

            desc.innerHTML = weatherData.current.summary;
            degree.innerHTML = weatherData.current.temperature + "°";
            wnd.innerHTML = weatherData.current.wind.speed + ' speed';

            swiper.update();  // Update swiper after adding slides
            updateUI(weatherData);
            hideLoadingAndShowData()
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            hideLoadingAndShowData();
        }
    }

    // Initialize Swiper after DOM content is loaded
    swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: false,

        // Responsive breakpoints

        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });

    // Call the async function
    fetchData();
});


