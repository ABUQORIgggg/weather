const CACHE_NAME = 'Mars Weather app';
const urlsToCache = [
    './index.html',
    './style.css',
    './images/logo.png',
    './images/camalac.png',
    './images/cloudly-rain.png',
    './images/cloudly.png',
    './images/lightning.png',
    './images/night.png',
    './images/overcast.png',
    './images/rain-lighting.png',
    './images/rain.png',
    './images/snow-rain.png',
    './images/sunny.png',
    './images/snow.png',
    './8504201-removebg-preview.png',
    './main.html',
    './main.js',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});