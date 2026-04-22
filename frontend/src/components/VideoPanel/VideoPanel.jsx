import React, { useState } from 'react';
import './VideoPanel.css';

const VideoTile = ({ stream, username, isLocal, isMuted, isCameraOff }) => {
    const videoRef = React.useRef(null);

    React.useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className={`video-tile ${isCameraOff ? 'camera-off' : ''}`}>
            {isCameraOff ? (
                <div className="video-placeholder">
                    <div className="avatar-circle">
                         {username.charAt(0).toUpperCase()}
                    </div>
                </div>
            ) : (
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted={isLocal} 
                    className="video-element"
                />
            )}
            <div className="video-label">
                <span className="label-name">{username} {isLocal ? '(You)' : ''}</span>
                {isMuted && (
                    <span className="mute-icon">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M6.7 1.9c.3-.3.9-.3 1.2 0L12 6.1v3.8l-4.1 4.2c-.3.3-.9.3-1.2 0L2.5 9.9V6.1l4.2-4.2zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                        </svg>
                    </span>
                )}
            </div>
        </div>
    );
};

const VideoPanel = ({ 
    localStream, 
    remoteStreams, 
    currentUsername,
    toggleVideo,
    toggleAudio,
    isMuted,
    isCameraOff
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`video-panel-container glass ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="video-panel-header" onClick={() => setIsCollapsed(!isCollapsed)}>
                <div className="header-title">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M14 6l3-2v8l-3-2V6zM1 5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span>Classroom Feeds</span>
                </div>
                <button className="collapse-toggle">
                    {isCollapsed ? '▼' : '▲'}
                </button>
            </div>

            {!isCollapsed && (
                <>
                    <div className="video-grid">
                        {/* Local Video */}
                        <VideoTile 
                            stream={localStream} 
                            username={currentUsername} 
                            isLocal={true}
                            isMuted={isMuted}
                            isCameraOff={isCameraOff}
                        />
                        
                        {/* Remote Videos */}
                        {Object.entries(remoteStreams).map(([username, stream]) => (
                            <VideoTile 
                                key={username}
                                stream={stream} 
                                username={username} 
                                isLocal={false}
                            />
                        ))}
                    </div>

                    <div className="video-controls">
                        <button 
                            className={`control-btn ${isCameraOff ? 'off' : ''}`}
                            onClick={toggleVideo}
                            title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                        >
                            {isCameraOff ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"/>
                                    <path d="M23 7l-7 5 7 5V7zM1 5h11a2 2 0 012 2v10a2 2 0 01-2 2H1a2 2 0 01-2-2V7a2 2 0 012-2z"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M23 7l-7 5 7 5V7z"/>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                </svg>
                            )}
                        </button>
                        <button 
                            className={`control-btn ${isMuted ? 'off' : ''}`}
                            onClick={toggleAudio}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoPanel;
