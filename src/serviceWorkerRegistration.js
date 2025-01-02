export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
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
        })
        .catch(error => {
          console.error('Błąd podczas rejestracji Service Workera:', error);
        });

      // Nasłuchiwanie wiadomości od Service Workera
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_STARTED') {
          console.log('Rozpoczęto synchronizację');
        } else if (event.data.type === 'SYNC_COMPLETED') {
          console.log('Zakończono synchronizację');
        }
      });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
} 