import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { connectSocket, sendMessage, subscribe } from '../../services/socket';
import GameLayout from '../../components/Layout/GameLayout/GameLayout';
import CanvasBoard from '../../components/CanvasBoard/CanvasBoard';
import './GamePage.css';

const GamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { gameData, updateGameData } = useGame();
    const [players, setPlayers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('connecting');

    useEffect(() => {
        // Retrieve and validate data from navigation state
        const { username, roomId, isHost } = location.state || {};

        if (!username || !roomId) {
            // Fallback: If no state is present (e.g., direct URL access), redirect to room entry
            console.warn("No active session found. Redirecting to room entry.");
            navigate('/room');
            return;
        }

        // Sync context
        updateGameData({ username, roomId, isHost: !!isHost });

        // Connect to WebSocket
        connectSocket(() => {
            setConnectionStatus('connected');

            // 🟢 Send Join Message
            sendMessage('/app/join', { username, roomId });

            // 👂 Subscribe to Players List updates
            subscribe(`/topic/players/${roomId}`, (playerList) => {
                setPlayers(playerList);
            });

            // 💬 Subscribe to Chat
            subscribe(`/topic/chat/${roomId}`, (msg) => {
                setMessages(prev => [...prev, msg]);
            });
        });

    }, [location.state, navigate, updateGameData]);



    // Ensure we have data before rendering
    if (!gameData.username || !gameData.roomId) {
        return <div className="loading-screen">Redirecting to entry...</div>;
    }

    return (
        <GameLayout
            left={
                <div className="sidebar-content">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {gameData.username ? gameData.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{gameData.username}</span>
                            <span className={`user-status ${connectionStatus}`}>
                                {connectionStatus === 'connecting' ? 'Connecting...' : 'Online'}
                            </span>
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
                    <div className="players-list">
                        {players.length > 0 ? (
                            players.map((player, index) => (
                                <div key={index} className="player-badge">
                                    <span className="player-initial">{player.username.charAt(0)}</span>
                                    <span className="player-name">{player.username}</span>
                                </div>
                            ))
                        ) : (
                            <p>No other players yet...</p>
                        )}
                    </div>
                </div>
            }
            center={
                <div className="game-center-container">
                    {connectionStatus === 'connected' ? (
                        <CanvasBoard roomId={gameData.roomId} />
                    ) : (
                        <div className="canvas-loading">
                            <p>Connecting to whiteboard...</p>
                        </div>
                    )}
                </div>
            }
            right={
                <div className="sidebar-content">
                    <h2>Chat</h2>
                    <div className="chat-container">
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender === 'System' ? 'system-msg' : ''}`}>
                                    <strong>{msg.sender}: </strong>
                                    <span>{msg.message}</span>
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        sendMessage('/app/chat', {
                                            sender: gameData.username,
                                            message: e.target.value,
                                            roomId: gameData.roomId
                                        });
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            }
        />
    );
};

export default GamePage;
