const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register() {
  if ('serviceWorker' in navigator) {
    return new Promise((resolve, reject) => {
      window.addEventListener('load', () => {
        const swUrl = `${window.location.origin}/serviceWorker.js`;

        if (isLocalhost) {
          checkValidServiceWorker(swUrl).then(resolve).catch(reject);
        } else {
          registerValidSW(swUrl).then(resolve).catch(reject);
        }
      });
    });
  }
  return Promise.resolve(); // Jeśli Service Worker nie jest wspierany
}

function registerValidSW(swUrl) {
  return navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker zarejestrowany pomyślnie:', registration);
      
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('Nowa wersja aplikacji jest dostępna');
            } else {
              console.log('Aplikacja jest gotowa do pracy offline');
            }
          }
        });
      });

      return registration;
    });
}

function checkValidServiceWorker(swUrl) {
  return fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        return navigator.serviceWorker.ready.then((registration) => {
          return registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        return registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('Brak połączenia z internetem. Aplikacja działa w trybie offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
} 