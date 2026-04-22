import React from 'react';
import HomeScreenContainer from '../../components/HomeScreenContainer/HomeScreenContainer';
import './Home.css';

const Home = () => {
    return (
        <HomeScreenContainer>
            <div className="home-hero">
                {/* Floating illustration shapes */}
                <div className="hero-shapes" aria-hidden="true">
                    <svg className="shape shape-pencil" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M6 38L34 10l4 4L10 42H6v-4z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M28 16l4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    <svg className="shape shape-circle" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4"/>
                    </svg>
                    <svg className="shape shape-rect" width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <rect x="8" y="8" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                    </svg>
                    <svg className="shape shape-star" width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <path d="M18 4l4 8 9 1.5-6.5 6.5L26 29l-8-4-8 4 1.5-9L5 13.5l9-1.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                </div>

                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    Real-time Collaboration
                </div>

                <h1 className="hero-title">
                    Draw Together,<br/>
                    <span className="gradient-text">Think Together</span>
                </h1>

                <p className="hero-subtitle">
                    A beautiful collaborative whiteboard for teams. Sketch ideas, brainstorm visually, 
                    and create together — all in real-time.
                </p>

                <div className="hero-features">
                    <div className="feature-chip">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="3" fill="currentColor"/>
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                        </svg>
                        Live Cursors
                    </div>
                    <div className="feature-chip">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Multi-Room
                    </div>
                    <div className="feature-chip">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Team Chat
                    </div>
                </div>

                <div className="hero-actions">
                    <a href="/login" className="hero-cta" id="hero-get-started">
                        Get Started
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                </div>
            </div>
        </HomeScreenContainer>
    );
};

export default Home;
