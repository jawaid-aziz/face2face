import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Lobby } from './screens/Lobby';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Lobby/>}/>
      </Routes>
    </div>
  );
}

export default App;
