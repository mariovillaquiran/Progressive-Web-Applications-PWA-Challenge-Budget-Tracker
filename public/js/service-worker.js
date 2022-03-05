const { response } = require("express")

var CACHE_NAME = "my-site-cache",
const DATA_CACHE_NAME = "data-cache"

var UrlToCache = [
    "/",
    "/db.js",
    "/manifest.json",
    "/styles.css", 
    "/icons/icon-192x192.png", 
    "/icons/icon-512x512.png", 
]
self.addEventListener("install",function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll(UrlToCache)
        })
    )
})
self.addEventListener("fetch",function(){
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache=>{
                return fetch(event.request)
                .then(response=>{
                if (response.status = 200) {
                  cache.push(event.request.url,response.clone())  
                }  
                    return response
                })
                .catch(err=>{
                    return cache.match(event.request)
                })
            }).catch(err=>console.log(err))
        )
    }
})
event.respondWith(fetch(event.request).catch(function(){
    return caches.match(event.request).then(function(){
        if (response) {
            return response
        } else {
            return caches.match("/")
        }
    })
}))