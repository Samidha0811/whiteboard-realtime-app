import React from 'react';
import './InputField.css';

const InputFields = ({ label, type, placeholder, value, onChange, name }) => {
    return (
        <div className="input-field-group">
            {label && <label htmlFor={name}>{label}</label>}
            <input
                id={name}
                type={type || 'text'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                className="common-input"
            />
        </div>
    );
};

export default InputFields;
