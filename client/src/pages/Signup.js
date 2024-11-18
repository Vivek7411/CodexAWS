import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css'; // Importing App.css for global styles

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Replace 'localhost' with your EC2 public IP
            const response = await axios.post('http://13.211.228.124:3000/signup', { email, password });
            localStorage.setItem('token', response.data.token); // Save token to localStorage
            toast.success('Welcome to the CODEX community');
            navigate('/login'); // Navigate to the login page
        } catch (error) {
            console.error('Error signing up:', error.response?.data?.message || error.message);
            toast.error('Be real sergent');
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
