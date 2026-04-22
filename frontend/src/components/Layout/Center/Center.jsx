import React from 'react';
import './Center.css';

const Center = ({ children }) => {
    return (
        <main className="center-content">
            {children}
        </main>
    );
};

export default Center;
