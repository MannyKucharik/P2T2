import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';

const spaceBackground = 'https://img.freepik.com/free-vector/wonders-night-sky-beautiful-wallpaper-with-shiny-star_1017-50570.jpg?semt=ais_hybrid&w=740&q=80';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    const doLogin = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/login', { email: email.trim(), password });
            if (response.status === 200) {
                localStorage.setItem('user_data', JSON.stringify(response.data));
                navigate('/dashboard');
            }
        } catch (error: any) {
            setMessage(error.response?.data?.error || "ACCESS DENIED");
        }
    };

    return (
        <div style={authStyles.wrapper}>
            <div style={authStyles.centerContainer}>
                {/* LOGO SECTION:
                   We use a massive width and 'flex: 1' logic to ensure the SVG 
                   scales up to its maximum possible size within the viewport.
                */}
                <div style={authStyles.logoContainer}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                         <Logo />
                    </div>
                </div>
                
                <div style={authStyles.box}>
                    <h2 style={authStyles.title}>LOG IN</h2>
                    <form onSubmit={doLogin} style={authStyles.form}>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            style={authStyles.input} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            style={authStyles.input} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                            required 
                        />
                        <button type="submit" style={authStyles.button}>PUNCH IT</button>
                    </form>
                    <div style={authStyles.footer}>
                        <Link to="/register" style={authStyles.link}>NEW RECRUIT?</Link>
                        <Link to="/forgot-password" style={authStyles.link}>FORGOT PASSWORD?</Link>
                    </div>
                    {message && <p style={authStyles.error}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export const authStyles: { [key: string]: React.CSSProperties } = {
    wrapper: { 
        backgroundColor: '#000', 
        backgroundImage: `url(${spaceBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontFamily: 'monospace',
        overflow: 'hidden'
    },
    centerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },
    // Inside authStyles in Login.tsx
    logoContainer: {
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2vh', // Use viewport height for consistent spacing
},
    box: { 
        width: '450px', 
        border: '2px solid #D4AF37', 
        padding: '50px', 
        textAlign: 'center', 
        backgroundColor: '#000', 
        boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)',
        zIndex: 10 // Ensures it stays above any background elements
    },
    title: { color: '#FFF', letterSpacing: '5px', fontSize: '20px', marginBottom: '35px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    input: { backgroundColor: '#111', border: '1px solid #D4AF37', padding: '15px', color: '#FFF', outline: 'none', fontSize: '16px' },
    button: { backgroundColor: '#D4AF37', color: '#000', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px', fontSize: '18px' },
    footer: { marginTop: '25px', display: 'flex', justifyContent: 'space-between' },
    link: { color: '#D4AF37', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' },
    error: { color: '#e74c3c', marginTop: '20px', fontSize: '14px' }
};

export default Login;