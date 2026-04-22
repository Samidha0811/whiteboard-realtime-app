import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Login from './page/Login/Login';
import Home from './page/Home/Home';
import JoinRoom from './page/JoinRoom/JoinRoom';
import GamePage from './page/GamePage/GamePage';
import './App.css';

const THEME_CONFIG = {
  light: {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Light'
  },
  dark: {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15 10.6A7 7 0 117.4 3a5.5 5.5 0 007.6 7.6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Dark'
  },
  custom: {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="7" cy="7" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="11" cy="8" r="1.5" fill="currentColor" opacity="0.3"/>
        <circle cx="9" cy="12" r="1.5" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
    label: 'Sunset'
  }
};

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('drawsync-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('drawsync-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'custom'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <GameProvider>
      <Router>
        <div className="app-container">
          <button
            className="theme-toggle glass"
            onClick={toggleTheme}
            title={`Switch theme (${THEME_CONFIG[theme].label})`}
            id="theme-toggle-btn"
          >
            <span className="theme-icon" key={theme}>
              {THEME_CONFIG[theme].icon}
            </span>
          </button>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/room" element={<JoinRoom />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
