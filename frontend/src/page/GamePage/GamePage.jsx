import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import GameLayout from '../../components/Layout/GameLayout/GameLayout';
import './GamePage.css';

const GamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { gameData, updateGameData } = useGame();

    useEffect(() => {
        // Retrieve and validate data from navigation state
        const { username, roomId, isHost } = location.state || {};

        if (!username || !roomId) {
            // Fallback: If no state is present (e.g., direct URL access), redirect to room entry
            console.warn("No active session found. Redirecting to room entry.");
            navigate('/room');
        } else {
            // Sync context with navigation state
            updateGameData({ username, roomId, isHost: !!isHost });
        }
    }, [location.state, updateGameData, navigate]);


    // Ensure we have data before rendering
    if (!gameData.username || !gameData.roomId) {
        return <div className="loading-screen">Redirecting to entry...</div>;
    }

    return (
        <GameLayout
            left={
                <div className="sidebar-content">
                    <div className="user-profile-summary">
                        <div className="avatar-placeholder">
                            {gameData.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{gameData.username}</span>
                            <span className="user-status">Online</span>
                        </div>
                    </div>

                    <div className="session-info">
                        <div className="info-item">
                            <label>Room Code</label>
                            <span className="room-code-display">{gameData.roomId}</span>
                        </div>
                        <div className="info-item">
                            <label>Role</label>
                            <span className="role-badge">{gameData.isHost ? "Host" : "Guest"}</span>
                        </div>
                    </div>

                    <div className="sidebar-divider" />

                    <h2>Players</h2>
                    <p>No other players yet...</p>
                </div>
            }
            center={
                <div className="main-canvas-area">
                    {/* Canvas content is handled by the Center component */}
                </div>
            }
            right={
                <div className="sidebar-content">
                    <h2>Chat</h2>
                    <div className="chat-messages">
                        <div className="system-msg">Welcome, {gameData.username}!</div>
                        <div className="system-msg">Joined room {gameData.roomId}</div>
                    </div>
                </div>
            }
        />
    );
};

export default GamePage;
