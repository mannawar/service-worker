const cacheName = 'v2';


//call install event
self.addEventListener('install', e => {
  console.log('Service Worker: installed');
});

//call activate event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  //Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName) {
            console.log('service worker: clearing old cache');
            return caches.delete(cache);
          }
        })
      )
    })
  )
});

//call fetch event
self.addEventListener('fetch', e => {
  console.log('service Worker: Fetching');
  e.respondWith(
    fetch(e.request)
      .then(res => {
        //Make copy/clone of response
        const resClone = res.clone();
        //Open Cache
        caches
          .open(cacheName)
          .then(cache => {
            //Add response to cache
            cache.put(e.request, resClone);

        });
        return res;
      }).catch(err => caches.match(e.request).then(res => res))
  );
});