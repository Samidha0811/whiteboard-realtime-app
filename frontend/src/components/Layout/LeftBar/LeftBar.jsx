import React from 'react';
import './LeftBar.css';

const LeftBar = ({ children }) => {
    return (
        <aside className="left-bar">
            {children}
        </aside>
    );
};

export default LeftBar;
