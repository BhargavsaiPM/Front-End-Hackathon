import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomeIcon.css';

const HomeIcon = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleHomeClick = () => {
        if (user) {
            // If user is logged in, show confirmation dialog
            setShowConfirm(true);
        } else {
            // If not logged in, just go to home
            navigate('/');
        }
    };

    const handleLogoutAndGoHome = () => {
        logout();
        setShowConfirm(false);
        navigate('/');
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    return (
        <>
            <button className="home-icon-btn" onClick={handleHomeClick} title="Home">
                🏠
            </button>

            {showConfirm && (
                <div className="logout-modal-backdrop" onClick={handleCancel}>
                    <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Logout Confirmation</h3>
                        <p>You are currently logged in. Do you want to logout and return to the home page?</p>
                        <div className="logout-modal-actions">
                            <button className="logout-confirm-btn" onClick={handleLogoutAndGoHome}>
                                Yes, Logout
                            </button>
                            <button className="logout-cancel-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeIcon;
