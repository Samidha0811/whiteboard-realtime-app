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

    const handleEnterRoom = () => {
        if (username.trim() && roomId.length >= 4) {
            setIsJoining(true);
            // Simulate a small delay for better UX
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
            <div className="entry-card">
                {mode === 'select' && (
                    <>
                        <h1>Ready to Start?</h1>
                        <p>Create a new room or join an existing one</p>
                        <div className="entry-actions">
                            <Button onClick={handleCreateReady} className="primary-entry-btn">Create Room</Button>
                            <Button onClick={handleJoinReady} className="secondary-entry-btn">Join Room</Button>
                        </div>
                    </>
                )}

                {mode === 'create' && (
                    <div className="entry-form-step">
                        <h1>Create Room</h1>
                        <p>Tell us your name and share the code</p>
                        
                        <InputField 
                            label="Your Name" 
                            placeholder="Enter username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <div className="generated-code-box">
                            {roomId}
                        </div>

                        <div className="entry-actions">
                            <Button onClick={handleEnterRoom} disabled={!username || isJoining}>
                                {isJoining ? "Creating..." : "Create & Enter"}
                            </Button>
                            <button className="back-link" onClick={() => setMode('select')}>Back</button>
                        </div>
                    </div>
                )}

                {mode === 'join' && (
                    <div className="entry-form-step">
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
                            <Button onClick={handleEnterRoom} disabled={!username || roomId.length < 4 || isJoining}>
                                {isJoining ? "Joining..." : "Join Now"}
                            </Button>
                            <button className="back-link" onClick={() => setMode('select')}>Back</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



export default JoinRoom;
