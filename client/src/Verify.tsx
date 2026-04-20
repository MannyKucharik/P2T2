import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { authStyles } from './Login';

const Verify: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [email] = useState(location.state?.email || '');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('https://p2t2.aravptulsi.com/api/verify', { email, code });
            setMessage("CLEARANCE GRANTED");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'INVALID CLEARANCE CODE');
        }
    };

    return (
        <div style={authStyles.wrapper}>
            <div style={authStyles.centerContainer}>
                <div style={authStyles.logoContainer}>
                    <Logo />
                </div>
                <div style={authStyles.box}>
                    <h2 style={authStyles.title}>VERIFY IDENTITY</h2>
                    <p style={{ color: '#FFF', fontSize: '14px', marginBottom: '20px', letterSpacing: '1px' }}>
                        VERIFICATION CODE SENT TO YOUR EMAIL: <br/> 
                        <span style={{ color: '#D4AF37' }}>{email}</span>
                    </p>
                    <form onSubmit={handleVerify} style={authStyles.form}>
                        <input 
                            type="text" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)} 
                            placeholder="000000" 
                            maxLength={6}
                            style={{ 
                                ...authStyles.input, 
                                textAlign: 'center', 
                                letterSpacing: '10px', 
                                fontSize: '24px',
                                fontWeight: 'bold' 
                            }}
                            required 
                        />
                        <button type="submit" style={authStyles.button}>AUTHORIZE ACCESS</button>
                    </form>
                    {message && <p style={authStyles.error}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Verify;