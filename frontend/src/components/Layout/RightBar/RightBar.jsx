import React from 'react';
import './RightBar.css';

const RightBar = ({ children }) => {
    return (
        <aside className="right-bar">
            {children}
        </aside>
    );
};

export default RightBar;
