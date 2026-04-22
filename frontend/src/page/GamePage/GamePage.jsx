import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { connectSocket, sendMessage, subscribe } from '../../services/socket';
import GameLayout from '../../components/Layout/GameLayout/GameLayout';
import CanvasBoard from '../../components/CanvasBoard/CanvasBoard';
import './GamePage.css';

const AVATAR_COLORS = [
    'linear-gradient(135deg, #0d9488, #6366f1)',
    'linear-gradient(135deg, #f97316, #ef4444)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #22d3ee, #3b82f6)',
    'linear-gradient(135deg, #10b981, #14b8a6)',
    'linear-gradient(135deg, #f59e0b, #f97316)',
];

const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const GamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { gameData, updateGameData } = useGame();
    const [players, setPlayers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        // Use location.state if available (fresh navigation), otherwise fall back
        // to sessionStorage via gameData (browser refresh)
        const navState = location.state || {};
        const username = navState.username || gameData.username;
        const roomId = navState.roomId || gameData.roomId;
        const isHost = navState.isHost ?? gameData.isHost;

        if (!username || !roomId) {
            console.warn("No active session found. Redirecting to room entry.");
            navigate('/room');
            return;
        }

        // Sync context if we came from navigation state
        if (navState.username) {
            updateGameData({ username, roomId, isHost: !!isHost });
        }

        connectSocket(() => {
            setConnectionStatus('connected');
            sendMessage('/app/join', { username, roomId });

            subscribe(`/topic/players/${roomId}`, (playerList) => {
                setPlayers(playerList);
            });

            subscribe(`/topic/chat/${roomId}`, (msg) => {
                setMessages(prev => [...prev, msg]);
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendChat = () => {
        if (chatInput.trim()) {
            sendMessage('/app/chat', {
                sender: gameData.username,
                message: chatInput.trim(),
                roomId: gameData.roomId
            });
            setChatInput('');
        }
    };

    if (!gameData.username || !gameData.roomId) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Connecting to room…</p>
            </div>
        );
    }

    return (
        <GameLayout
            left={
                <div className="sidebar-content" id="game-left-sidebar">
                    {/* User Profile */}
                    <div className="user-profile">
                        <div className="user-avatar" style={{ background: getAvatarColor(gameData.username) }}>
                            {gameData.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{gameData.username}</span>
                            <span className={`user-status ${connectionStatus}`}>
                                <span className="status-dot"></span>
                                {connectionStatus === 'connecting' ? 'Connecting...' : 'Online'}
                            </span>
                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="session-info">
                        <div className="info-item">
                            <label>Room Code</label>
                            <span className="room-code-display">{gameData.roomId}</span>
                        </div>
                        <div className="info-item">
                            <label>Role</label>
                            <span className={`role-badge ${gameData.isHost ? 'host' : 'guest'}`}>
                                {gameData.isHost ? '👑 Host' : '🎨 Guest'}
                            </span>
                        </div>
                    </div>

                    <div className="sidebar-divider" />

                    {/* Players List */}
                    <div className="sidebar-section">
                        <h2 className="section-title">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Players
                            <span className="count-badge">{players.length}</span>
                        </h2>
                        <div className="players-list">
                            {players.length > 0 ? (
                                players.map((player, index) => (
                                    <div key={index} className="player-badge" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <span className="player-avatar" style={{ background: getAvatarColor(player.username) }}>
                                            {player.username.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="player-name">{player.username}</span>
                                        {player.username === gameData.username && (
                                            <span className="you-tag">You</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="empty-state">Waiting for players…</p>
                            )}
                        </div>
                    </div>
                </div>
            }
            center={
                <div className="game-center-container">
                    {connectionStatus === 'connected' ? (
                        <CanvasBoard roomId={gameData.roomId} />
                    ) : (
                        <div className="canvas-loading">
                            <div className="loading-spinner"></div>
                            <p>Connecting to whiteboard…</p>
                        </div>
                    )}
                </div>
            }
            right={
                <div className="sidebar-content" id="game-right-sidebar">
                    <h2 className="section-title">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4h12v7a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Chat
                    </h2>
                    <div className="chat-container">
                        <div className="chat-messages" id="chat-messages-list">
                            {messages.length === 0 && (
                                <div className="chat-empty">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.3">
                                        <path d="M4 8h24v14a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M4 8a2 2 0 012-2h20a2 2 0 012 2" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M10 14h12M10 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                    <p>No messages yet</p>
                                </div>
                            )}
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-bubble ${msg.sender === 'System' ? 'system-msg' : ''} ${msg.sender === gameData.username ? 'own-msg' : ''}`}>
                                    {msg.sender !== 'System' && msg.sender !== gameData.username && (
                                        <span className="chat-sender">{msg.sender}</span>
                                    )}
                                    <span className="chat-text">{msg.message}</span>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Type a message…"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSendChat();
                                }}
                                className="chat-input"
                                id="chat-input"
                            />
                            <button onClick={handleSendChat} className="chat-send-btn" disabled={!chatInput.trim()} id="chat-send-btn">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M2 9l14-7-4 16-4-6z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            }
        />
    );
};

export default GamePage;
