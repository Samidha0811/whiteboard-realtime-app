import React from 'react';
import GameLayout from '../../components/Layout/GameLayout/GameLayout';
import './JoinRoom.css';

const JoinRoom = () => {
    return (
        <GameLayout
            left={
                <div className="sidebar-content">
                    <h2>Players</h2>
                    <p>No players yet...</p>
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
                        <p>Welcome to the room!</p>
                    </div>
                </div>
            }

        />
    );
};

export default JoinRoom;
