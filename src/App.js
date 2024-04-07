//App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './components/Start.js';
import Create from './components/Create.js';
import Profile from './components/Profile.js';
import Edit from './components/Edit.js';

function App() {
  return (
    <Router>
     <Routes>
  <Route path="/" element={<Start />} /> 
  <Route path="/create" element={<Create />} />
  <Route path="/profile/:id" element={<Profile />} />
  <Route path="/edit/:id" element={<Edit />} />
</Routes>

    </Router>
  );
}

export default App;
