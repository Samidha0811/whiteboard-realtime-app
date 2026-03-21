import React from 'react';
import HomeScreenContainer from '../../components/HomeScreenContainer/HomeScreenContainer';
import './Home.css';

const Home = () => {
    return (
        <HomeScreenContainer>
            <div className="home-screen-realtime">
                <h1>Whiteboard Realtime App</h1>
                <p>Collaborate in real-time with your team.</p>
                <div className="nav-links">
                    <a href="/login" className="nav-btn">Get Started</a>
                </div>
            </div>
        </HomeScreenContainer>
    );
};


export default Home;
