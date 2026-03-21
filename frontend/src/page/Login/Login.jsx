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
            <div className="login-card">
                <h1>Welcome Back</h1>
                <p>Sign in to your account</p>

                <form onSubmit={handleSubmit}>
                    <InputFields
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <InputFields
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Button type="submit" className="login-btn">
                        Join Room
                    </Button>
                </form>
            </div>
        </HomeScreenContainer>
    );
};



export default Login;
