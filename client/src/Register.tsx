import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import { authStyles } from './Login';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('https://p2t2.aravptulsi.com/api/register', formData);
            navigate('/verify', { state: { email: formData.email } });
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'REGISTRATION FAILED');
        }
    };

    return (
        <div style={authStyles.wrapper}>
            <div style={authStyles.centerContainer}>
                <div style={authStyles.logoContainer}>
                    <Logo />
                </div>
                <div style={authStyles.box}>
                    <h2 style={authStyles.title}>NEW RECRUIT</h2>
                    <form onSubmit={handleSubmit} style={authStyles.form}>
                        <input name="firstName" placeholder="First Name" style={authStyles.input} onChange={handleChange} required />
                        <input name="lastName" placeholder="Last Name" style={authStyles.input} onChange={handleChange} required />
                        <input name="email" placeholder="Email" style={authStyles.input} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" style={authStyles.input} onChange={handleChange} required />
                        <button type="submit" style={authStyles.button}>ENLIST</button>
                    </form>
                    <div style={authStyles.footer}>
                        <Link to="/login" style={authStyles.link}>ALREADY ENLISTED?</Link>
                    </div>
                    {message && <p style={authStyles.error}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Register;