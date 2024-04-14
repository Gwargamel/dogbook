// Importerar React-biblioteket för att använda React-funktioner och komponenter
import React from 'react';
// Importerar ReactDOM för att hantera DOM-relaterade renderingar, specifikt med React 18:s nya klient-API
import ReactDOM from 'react-dom/client';
// Importerar en CSS-fil för global styling som påverkar hela applikationen
import './index.css';
// Importerar huvudkomponenten 'App' från en fil i samma katalog
import App from './App.js';

// Skapar en root-container där React-applikationen kommer att fästas och renderas
const root = ReactDOM.createRoot(document.getElementById('root'));
// Renderar React-applikationen i root-elementet i strikt läge
root.render(
  // React.StrictMode är ett hjälpverktyg som aktiverar ytterligare kontroller och varningar för dess barn
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


