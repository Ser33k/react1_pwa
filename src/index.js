import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { dbService } from './services/db';

// Inicjalizacja bazy danych przed renderowaniem aplikacji
const initializeApp = async () => {
  try {
    // Sprawdź i zainicjalizuj bazę danych
    const dbInfo = await dbService.checkDatabase();
    console.log('Baza danych zainicjalizowana:', dbInfo);

    // Renderuj aplikację
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Rejestracja Service Workera
    serviceWorkerRegistration.register();
  } catch (error) {
    console.error('Błąd podczas inicjalizacji bazy danych:', error);
    // Pokaż informację o błędzie
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <div className="p-4 text-center">
        <h1 className="text-xl text-red-600">Błąd inicjalizacji bazy danych</h1>
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
