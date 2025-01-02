const CACHE_NAME = 'pos-cache-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/js/vendors~main.chunk.js',
  '/manifest.json',
  OFFLINE_URL
];

self.addEventListener('install', (event) => {
  console.log('Instalowanie Service Workera...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache otwarty');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignoruj żądania do chrome-extension i innych nieobsługiwanych schematów
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('Znaleziono w cache:', event.request.url);
          return response;
        }

        console.log('Pobieranie z sieci:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            if (event.request.url.startsWith('http')) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('Cachowanie:', event.request.url);
                  cache.put(event.request, responseToCache);
                })
                .catch(error => {
                  console.error('Błąd podczas cachowania:', error);
                });
            }

            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              console.log('Wczytywanie strony offline');
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Aktywacja Service Workera...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Usuwanie starego cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    console.log('Rozpoczęcie synchronizacji transakcji');
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_STARTED'
      });
    });

    // Tutaj dodamy później logikę synchronizacji
    
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED'
      });
    });
  } catch (error) {
    console.error('Błąd podczas synchronizacji:', error);
  }
} 