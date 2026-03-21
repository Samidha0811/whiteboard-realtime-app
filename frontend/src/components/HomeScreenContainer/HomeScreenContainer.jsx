import React from 'react';
import './HomeScreenContainer.css';

const HomeScreenContainer = ({ children, className = '' }) => {
    return (
        <div className={`home-screen-container ${className}`}>
            {children}
        </div>
    );
};

export default HomeScreenContainer;
