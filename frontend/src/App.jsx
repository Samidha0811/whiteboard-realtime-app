import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './page/Login/Login';
import Home from './page/Home/Home';
import Button from './components/Button/Button';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Apply theme class to root element
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'custom'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="theme-switcher">
          <Button onClick={toggleTheme} className="theme-toggle-btn">
            {theme.toUpperCase()} MODE
          </Button>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
