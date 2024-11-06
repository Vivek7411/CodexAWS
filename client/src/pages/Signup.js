import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Importing App.css for global styles

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5100/signup', { email, password });
            localStorage.setItem('token', response.data.token); // Save token to localStorage
            navigate('/login'); // Navigate to the home page
        } catch (error) {
            console.error('Error signing up:', error.response.data.message);
        }
    };

    return (
        <div className="login-page dark-theme">
            <div className="login-container">
                <h2>Create your account on <span className="highlight">CODEX</span></h2>
                <form onSubmit={handleSignUp}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Sign Up</button>
                </form>
                <p className="signup-text">
                    Already have an account? Login, <a href="/login" className="signup-link">here</a>
                </p>
            </div>
            <footer className="login-footer">
                <p>Built with 💛 &nbsp; by &nbsp; <a href="https://github.com/sumit45sagar">Team Codex</a>.</p>
            </footer>
        </div>
    );
};

export default SignUp;