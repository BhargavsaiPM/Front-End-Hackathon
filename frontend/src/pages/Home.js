import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import LoginModal from '../components/LoginModal';

const Home = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Header with Login Button */}
            <header className="home-header">
                <div className="header-content">
                    <h1 className="logo">SafeSpace</h1>
                    <button
                        className="login-btn"
                        onClick={() => setShowLoginModal(true)}
                    >
                        Login
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">You Are Not Alone</h1>
                    <p className="hero-subtitle">
                        A safe, confidential space for survivors of domestic violence
                    </p>
                    <button
                        className="cta-btn"
                        onClick={() => navigate('/register')}
                    >
                        Get Support Now
                    </button>
                </div>
            </section>

            {/* Info Section */}
            <section className="info-section">
                <div className="info-container">
                    <h2 className="section-title">Understanding Domestic Violence</h2>

                    <div className="info-grid">
                        <div className="info-card">
                            <div className="info-icon">🛡️</div>
                            <h3>What is Domestic Violence?</h3>
                            <p>
                                Domestic violence is a pattern of behavior used to gain or maintain power and control
                                over an intimate partner. It can include physical, emotional, sexual, economic, or
                                psychological abuse.
                            </p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">⚠️</div>
                            <h3>Warning Signs</h3>
                            <ul>
                                <li>Physical harm or threats</li>
                                <li>Isolation from friends and family</li>
                                <li>Controlling behavior</li>
                                <li>Verbal abuse and humiliation</li>
                                <li>Financial control</li>
                            </ul>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">💪</div>
                            <h3>You Have Rights</h3>
                            <p>
                                Everyone has the right to live free from violence and abuse. Legal protections are
                                available, and you deserve support regardless of gender, age, or circumstances.
                            </p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">🤝</div>
                            <h3>How We Can Help</h3>
                            <ul>
                                <li>Anonymous, confidential support</li>
                                <li>Professional counseling</li>
                                <li>Legal guidance and resources</li>
                                <li>24/7 access to help</li>
                                <li>Gender-responsive assistance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-container">
                    <h2 className="section-title">Our Services</h2>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Anonymous & Secure</h3>
                            <p>Your identity is protected with anonymous IDs. No personal information is shared with advisors.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">💬</div>
                            <h3>Professional Counseling</h3>
                            <p>Connect with trained counselors who understand trauma and can provide emotional support.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">⚖️</div>
                            <h3>Legal Assistance</h3>
                            <p>Get guidance from legal advisors about your rights and available legal protections.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📚</div>
                            <h3>Resources & Information</h3>
                            <p>Access articles, helplines, and comprehensive information about domestic violence.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Section */}
            <section className="emergency-section">
                <div className="emergency-content">
                    <h2>In Immediate Danger?</h2>
                    <p>If you or someone you know is in immediate danger, please call emergency services.</p>
                    <div className="emergency-numbers">
                        <div className="emergency-number">
                            <strong>Police Emergency:</strong> 100
                        </div>
                        <div className="emergency-number">
                            <strong>Women Helpline:</strong> 1091
                        </div>
                        <div className="emergency-number">
                            <strong>NCW Helpline:</strong> 7827-170-170
                        </div>
                        <div className="emergency-number">
                            <strong>DV Helpline:</strong> 181
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <p>&copy; 2025 SafeSpace - Domestic Violence Support System</p>
                    <p>All communications are confidential and secure.</p>
                </div>
            </footer>

            {/* Login Modal */}
            {showLoginModal && (
                <LoginModal onClose={() => setShowLoginModal(false)} />
            )}
        </div>
    );
};

export default Home;
