import React from 'react';

const Logo: React.FC = () => {
    return (
        <div style={logoStyles.container}>
            <div style={logoStyles.brandingWrapper}>
                <div style={logoStyles.mainTitle}>P2T2</div>
                <div style={logoStyles.subRow}>
                    <div style={{ ...logoStyles.verticalText, position: 'relative', left: '4%' }}>
                        <span>E</span><span>T</span>
                    </div>
                    <div style={{ ...logoStyles.verticalText, position: 'relative', right: '35%' }}>
                        <span>R</span><span>A</span><span>C</span><span>K</span><span>E</span><span>R</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const logoStyles: { [key: string]: React.CSSProperties } = {
    container: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px', 
        userSelect: 'none',
        width: '100%',
    },
    brandingWrapper: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'fit-content' 
    },
    mainTitle: { 
        fontSize: '5vw', 
        fontWeight: '900', 
        color: 'black', 
        WebkitTextStroke: '2px #D4AF37', 
        letterSpacing: '0.5vw', 
        lineHeight: '0.9',
        textAlign: 'center',
    },
    subRow: { 
        display: 'flex', 
        width: '100%',
        justifyContent: 'space-between', 
        marginTop: '10px',
    },
    verticalText: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        color: '#D4AF37', 
        fontSize: '1.1vw', 
        fontWeight: 'bold', 
        letterSpacing: '0.2vw' 
    }
};

export default Logo;