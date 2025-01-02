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

    if (dbInfo.error) {
      console.warn('Aplikacja uruchomiona z ograniczoną funkcjonalnością:', dbInfo.error);
    }

    // Renderuj aplikację
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <App />
    );
  } catch (error) {
    console.error('Błąd krytyczny podczas inicjalizacji bazy danych:', error);
    // Możesz tutaj wyrenderować komponent z informacją o błędzie
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <div className="p-4 text-center">
        <h1 className="text-xl text-red-600">Błąd inicjalizacji aplikacji</h1>
        <p className="text-gray-600">Spróbuj odświeżyć stronę</p>
      </div>
    );
  }
};

// Uruchom inicjalizację
initializeApp();

// Rejestracja Service Workera
serviceWorkerRegistration.register();

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
