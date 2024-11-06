import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,  useLocation } from 'react-router-dom';
import '../App.css'; // Importing App.css for global styles

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const {from} = location.state || {
        from: {pathname: '/'}
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5100/login', { email, password });
            localStorage.setItem('token', response.data.token); // Save token to localStorage
            navigate(from.pathname); // Navigate to the home page
        } catch (err) {
            // console.error('Error logging in:', error.response.data.message);
            console.log(err.response.message ||  err.message || 'Error in loging in');
        }
    };

    return (
        <div className="login-page dark-theme">
            <div className="login-container">
                <h2>Welcome back to <span className="highlight">CODEX</span>,</h2>
                <br></br>
                <form onSubmit={handleLogin}>
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
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <p className="signup-text">
                    Don't have an account? Sign up, <a href="/signup" className="signup-link">here</a>
                </p>
            </div>
            <footer className="login-footer">
                <p>Built with 💛 &nbsp; by &nbsp; <a href="https://github.com/sumit45sagar">Team Codex</a>.</p>
            </footer>
        </div>
    );
};

export default Login;