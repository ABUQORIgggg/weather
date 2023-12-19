
let url = `https://api.openweathermap.org/data/2.5/weather?q=Tashkent&units=metric&appid=33dedde6287575d237be2e1c44271762`

fetch(url)
    .then(javob => javob.json())
    .then(malumot => console.log(malumot))



