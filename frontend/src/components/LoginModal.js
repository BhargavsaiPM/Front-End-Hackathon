import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(formData.email, formData.password);

            // Navigate based on role
            switch (user.role) {
                case 'victim':
                    navigate('/user/dashboard');
                    break;
                case 'counsellor':
                    navigate('/counsellor/dashboard');
                    break;
                case 'legal':
                    navigate('/legal/dashboard');
                    break;
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                default:
                    navigate('/');
            }

            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <div className="modal-header">
                    <h2>Welcome Back</h2>
                    <p>Login to access your account</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="modal-footer">
                    <p>
                        Don't have an account?{' '}
                        <span
                            className="link-text"
                            onClick={() => {
                                navigate('/register');
                                onClose();
                            }}
                        >
                            Register here
                        </span>
                    </p>
                    <p className="help-text">
                        Need help? Contact support
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
