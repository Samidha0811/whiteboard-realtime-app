import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputFields from '../../components/InputFields/InputFields';
import Button from '../../components/Button/Button';
import HomeScreenContainer from '../../components/HomeScreenContainer/HomeScreenContainer';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted:', formData);
        // Navigate to the room page
        navigate('/room');
    };

    return (
        <HomeScreenContainer>
            <div className="login-card glass" id="login-form-card">
                <div className="login-icon" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="14" r="8" stroke="currentColor" strokeWidth="2.5"/>
                        <path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                </div>
                <h1>Welcome Back</h1>
                <p className="login-subtitle">Sign in to your whiteboard workspace</p>

                <form onSubmit={handleSubmit}>
                    <InputFields
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <InputFields
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Button type="submit" className="login-btn" id="login-submit-btn">
                        Continue to Rooms
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '0.5rem', display: 'inline' }}>
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                </form>
            </div>
        </HomeScreenContainer>
    );
};

export default Login;
