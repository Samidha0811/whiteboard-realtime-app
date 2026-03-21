import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`common-btn ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
