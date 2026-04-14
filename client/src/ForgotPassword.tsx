import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import { authStyles } from './Login';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [step, setStep] = useState<number>(1);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    const requestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/api/forgot-password', { email: email.trim() });
            setStep(2);
        } catch (error: any) { setMessage("USER NOT FOUND"); }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/api/reset-password', { email: email.trim(), code, newPassword });
            setMessage("PASSWORD OVERRIDDEN");
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) { setMessage("RESET FAILED"); }
    };

    return (
        <div style={authStyles.wrapper}>
            <div style={authStyles.centerContainer}>
                <div style={authStyles.logoContainer}><Logo /></div>
                <div style={authStyles.box}>
                    <h2 style={authStyles.title}>{step === 1 ? "RECOVER CODES" : "OVERRIDE PASSWORD"}</h2>
                    <form onSubmit={step === 1 ? requestReset : handleReset} style={authStyles.form}>
                        {step === 1 ? (
                            <input placeholder="Email" style={authStyles.input} onChange={e => setEmail(e.target.value)} required />
                        ) : (
                            <>
                                <input placeholder="6-Digit Code" style={authStyles.input} onChange={e => setCode(e.target.value)} required />
                                <input type="password" placeholder="New Password" style={authStyles.input} onChange={e => setNewPassword(e.target.value)} required />
                            </>
                        )}
                        <button type="submit" style={authStyles.button}>{step === 1 ? "SEND CODE" : "RESET"}</button>
                    </form>
                    <div style={authStyles.footer}>
                        <Link to="/login" style={authStyles.link}>BACK TO TERMINAL</Link>
                    </div>
                    {message && <p style={authStyles.error}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;