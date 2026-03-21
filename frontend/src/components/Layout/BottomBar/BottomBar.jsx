import React from 'react';
import ScoreBoard from '../../ScoreBoard/ScoreBoard';
import './BottomBar.css';

const BottomBar = ({ children }) => {
    return (
        <footer className="bottom-bar">
            <ScoreBoard />
            <div className="bottom-bar-actions">
                {children}
            </div>
        </footer>
    );
};

export default BottomBar;
