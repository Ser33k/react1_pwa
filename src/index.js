import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { dbService } from './services/db';

// Inicjalizacja aplikacji
const initializeApp = async () => {
  try {
    // Najpierw rejestrujemy Service Worker
    console.log('Rozpoczęcie rejestracji Service Workera...');
    await serviceWorkerRegistration.register();
    
    // Następnie inicjalizujemy bazę danych
    console.log('Rozpoczęcie inicjalizacji bazy danych...');
    const dbInfo = await dbService.checkDatabase();
    console.log('Baza danych zainicjalizowana:', dbInfo);

    // Na końcu renderujemy aplikację
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

  } catch (error) {
    console.error('Błąd podczas inicjalizacji aplikacji:', error);
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <div className="p-4 text-center">
        <h1 className="text-xl text-red-600">Błąd inicjalizacji aplikacji</h1>
        <p className="text-gray-600 mt-2">Spróbuj odświeżyć stronę</p>
        <pre className="mt-4 p-2 bg-gray-100 rounded text-left text-sm overflow-auto">
          {error.message}
        </pre>
      </div>
    );
  }
};

// Uruchom inicjalizację
initializeApp();
