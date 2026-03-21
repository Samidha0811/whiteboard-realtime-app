import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = () => {
    return (
        <div className="score-board-container">
            <span className="sc-label">Top Scorers:</span>
            <div className="sc-players">
                {/* Real player data will be injected here */}
                <div className="sc-player-placeholder">Loading scores...</div>
            </div>
        </div>
    );
};

export default ScoreBoard;
