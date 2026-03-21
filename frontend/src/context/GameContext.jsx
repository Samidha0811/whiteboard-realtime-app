import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameData, setGameData] = useState({
        username: sessionStorage.getItem('username') || '',
        roomId: sessionStorage.getItem('roomId') || '',
        isHost: JSON.parse(sessionStorage.getItem('isHost')) || false,
    });

    // Persist session data to avoid loss on refresh
    useEffect(() => {
        sessionStorage.setItem('username', gameData.username);
        sessionStorage.setItem('roomId', gameData.roomId);
        sessionStorage.setItem('isHost', JSON.stringify(gameData.isHost));
    }, [gameData]);

    const updateGameData = (newData) => {
        setGameData(prev => ({ ...prev, ...newData }));
    };

    const clearGameData = () => {
        setGameData({ username: '', roomId: '', isHost: false });
        sessionStorage.clear();
    };

    return (
        <GameContext.Provider value={{ gameData, updateGameData, clearGameData }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
