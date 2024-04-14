// Grundläggande import från React
import React from 'react';
// Importerar komponenter från react-router-dom för att hantera navigation och routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Importerar de olika sidkomponenterna som används i applikationen
import Start from './components/Start.js';
import Create from './components/Create.js';
import Profile from './components/Profile.js';
import Edit from './components/Edit.js';
// Importerar en central CSS-fil som påverkar hela applikationens utseende
import './App.css';

// Huvudkomponenten för applikationen som definierar routes och renderar komponenter baserat på URL:en
function App() {
  return (
     // Router-komponenten omsluter hela routing-strukturen
    <Router>
      {/* Routes-komponenten omsluter alla Route-komponenter */}
     <Routes>
       {/* Varje Route-komponent definierar en path och den komponent som ska renderas. id är en parameter som tas emot av komponenten */}
  <Route path="/" element={<Start />} /> {/* Renderar Start-komponenten */}
  <Route path="/create" element={<Create />} /> {/* Renderar Create-komponenten för att skapa en ny hund */}
  <Route path="/profile/:id" element={<Profile />} /> {/* Renderar Profile-komponenten som visar en hundprofil */}
  <Route path="/edit/:id" element={<Edit />} /> {/* Renderar Edit-komponenten för att redigera en hund */}
</Routes>

    </Router>
  );
}

export default App;
