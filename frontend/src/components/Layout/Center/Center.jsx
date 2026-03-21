import React from 'react';
import CanvasBoard from '../../CanvasBoard/CanvasBoard';
import './Center.css';

const Center = ({ children }) => {
    return (
        <main className="center-content">
            <CanvasBoard />

        </main>
    );
};


export default Center;
