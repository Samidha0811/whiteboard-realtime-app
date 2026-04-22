import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputFields/InputFields';
import Button from '../../components/Button/Button';
import './JoinRoom.css';

const JoinRoom = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('select'); // 'select', 'create', 'join'
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateRoomId = () => {
        const id = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomId(id);
    };

    const handleCreateReady = () => {
        generateRoomId();
        setMode('create');
    };

    const handleJoinReady = () => {
        setMode('join');
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleEnterRoom = () => {
        if (username.trim() && roomId.length >= 4) {
            setIsJoining(true);
            setTimeout(() => {
                navigate('/game', { 
                    state: { 
                        username: username.trim(), 
                        roomId: roomId,
                        isHost: mode === 'create'
                    } 
                });
            }, 500);
        }
    };

    return (
        <div className="room-entry-container">
            {/* Background animated gradient orbs */}
            <div className="room-bg-orbs" aria-hidden="true">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="entry-card glass" id="room-entry-card">
                {mode === 'select' && (
                    <div className="entry-step" key="select">
                        <div className="entry-icon" aria-hidden="true">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <rect x="4" y="8" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                                <path d="M12 18h12M18 14v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h1>Ready to Draw?</h1>
                        <p>Create a new whiteboard room or join an existing one</p>
                        <div className="entry-actions">
                            <Button onClick={handleCreateReady} className="primary-entry-btn" id="create-room-btn">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '0.5rem' }}>
                                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Create Room
                            </Button>
                            <Button onClick={handleJoinReady} className="secondary-entry-btn" id="join-room-btn">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '0.5rem' }}>
                                    <path d="M10 2l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14 6H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Join Room
                            </Button>
                        </div>
                    </div>
                )}

                {mode === 'create' && (
                    <div className="entry-step" key="create">
                        <h1>Create Room</h1>
                        <p>Set your name and share the code with teammates</p>
                        
                        <InputField 
                            label="Your Name" 
                            placeholder="Enter username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <div className="generated-code-box" onClick={handleCopyCode} title="Click to copy">
                            <span className="code-value">{roomId}</span>
                            <span className={`copy-tooltip ${copied ? 'show' : ''}`}>
                                {copied ? '✓ Copied!' : 'Click to copy'}
                            </span>
                        </div>

                        <div className="entry-actions">
                            <Button onClick={handleEnterRoom} disabled={!username || isJoining} id="create-enter-btn">
                                {isJoining ? (
                                    <><span className="btn-spinner"></span> Creating...</>
                                ) : (
                                    "Create & Enter"
                                )}
                            </Button>
                            <button className="back-link" onClick={() => setMode('select')}>
                                ← Back to options
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'join' && (
                    <div className="entry-step" key="join">
                        <h1>Join Room</h1>
                        <p>Enter your name and the room code</p>
                        
                        <InputField 
                            label="Your Name" 
                            placeholder="Enter username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <InputField 
                            label="Room Code" 
                            placeholder="e.g. AB12CD" 
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        />

                        <div className="entry-actions">
                            <Button onClick={handleEnterRoom} disabled={!username || roomId.length < 4 || isJoining} id="join-enter-btn">
                                {isJoining ? (
                                    <><span className="btn-spinner"></span> Joining...</>
                                ) : (
                                    "Join Now"
                                )}
                            </Button>
                            <button className="back-link" onClick={() => setMode('select')}>
                                ← Back to options
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JoinRoom;
