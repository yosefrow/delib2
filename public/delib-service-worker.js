var dataCacheName = 'Delib-v1';
var cacheName = 'Delib-Cache-1';
var filesToCache = [
    '/css/',
    '/js/'
];

self.addEventListener('install', function(e) {
    console.log('[DelibServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[DelibServiceWorke r] Caching App Shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[DelibServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                console.log('[DelibServiceWorker] Removing old cache', key);
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});


self.addEventListener('fetch', function(e) {
    // console.log('[DelibServiceWorker] Fetch', e.request.url);
    var dataUrl = 'https://synthesistalyaron.firebaseapp.com/';
    if (e.request.url.indexOf(dataUrl) === 0) {
        // console.log('insidde!!!~');
        e.respondWith(
            fetch(e.request)
                .then(function(response) {
                    return caches.open(dataCacheName).then(function(cache) {
                        cache.put(e.request.url, response.clone());
                        console.log('[DelibServiceWorker] Fetched & Cached Data');
                        return response;
                    });
                })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
});

self.addEventListener('push', function(event) {
    console.log('Push message', event);
    var notificaionData = event.data.toJSON();
    var title = notificaionData.title;

    event.waitUntil(
        self.registration.showNotification("blarr", {
            'body': 'The Message',
            'icon': 'images/icon.png'
        }));
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification click: tag', event.notification.tag);
    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    event.notification.close();

    var url = 'https://synthesistalyaron.firebaseapp.com/';
    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(
        clients.matchAll({
                type: 'window'
            })
            .then(function(windowClients) {
                console.log('WindowClients', windowClients);
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    console.log('WindowClient', client);
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});
