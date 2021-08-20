const FILES_TO_CACHE=[
    "../models/transaction.js",
    "./css/style.css",
    "./js/idb.js",
    "./index.js",
    "./index.html",
    "./mainfest.json",
    "../routes/api.js"
];

const APP_PREFIX = 'BudgetTracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function (evt){
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function (cache){
            console.log('installing cache: '+ CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function (evt){
    evt.waitUntil(
        caches.keys().then(function (keyList){
            let cacheKeepList = keyList.filter(function (key){
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function(key, i){
                    if(cacheKeepList.indexOf(key) === -1){
                        console.log('deleting cache: '+ keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', function (evt){
    console.log('fetch request:' + evt.request.url)
    evt.respondWith(
        caches.match(evt.request).then(function (request){
            if(request){
                console.log('responding with cache: '+ evt.request.url);
                return request
            } else {
                console.log('file is not cached, fetching: '+ evt.request.url);
                return fetch(evt.request)
            }
        })
    )
})