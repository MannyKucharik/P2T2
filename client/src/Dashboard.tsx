import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [pets, setPets] = useState<any[]>([]);
    const [selectedPet, setSelectedPet] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotes, setEditedNotes] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // New Pet Form States
    const [newPetName, setNewPetName] = useState('');
    const [newPetSpecies, setNewPetSpecies] = useState('');
    const [newWalkReq, setNewWalkReq] = useState(true);
    const [newFeedInt, setNewFeedInt] = useState(8);

    const navigate = useNavigate();
    const spaceBackground = 'https://img.freepik.com/free-vector/wonders-night-sky-beautiful-wallpaper-with-shiny-star_1017-50570.jpg?semt=ais_hybrid&w=740&q=80';

    const timeOptions = Array.from({ length: 48 }).map((_, i) => {
        const hour = Math.floor(i / 2);
        const min = i % 2 === 0 ? '00' : '30';
        const ampm = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${min} ${ampm}`;
    });

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user_data');
        if (loggedInUser) {
            const parsed = JSON.parse(loggedInUser);
            const id = parsed.userId || parsed._id || parsed.id;
            setUser({ ...parsed, id });
            fetchPets(id);
        } else { navigate('/login'); }
    }, [navigate]);

    const fetchPets = async (userId: string) => {
        const res = await fetch(`http://localhost:5000/api/pets/${userId}`);
        const data = await res.json();
        const reversed = data.reverse();
        setPets(reversed);
        
        if (selectedPet) {
            const updated = reversed.find((p: any) => p._id === selectedPet._id);
            if (updated) setSelectedPet(updated);
        } else if (reversed.length > 0) {
            setSelectedPet(reversed[0]);
            setEditedNotes(reversed[0].notes || '');
        }
    };

    const handleTimeChange = async (type: 'lastWalk' | 'lastFeeding', timeString: string) => {
        if (!selectedPet) return;
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        const newDate = new Date();
        newDate.setHours(hours, minutes, 0, 0);

        await fetch(`http://localhost:5000/api/pets/${selectedPet._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [type]: newDate.toISOString() }),
        });
        fetchPets(user.id);
    };

    const handleDelete = async (petId: string) => {
        if (!window.confirm("CONFIRM DELETION OF SQUAD MEMBER?")) return;
        await fetch(`http://localhost:5000/api/pets/${petId}`, { method: 'DELETE' });
        setSelectedPet(null);
        fetchPets(user.id);
    };

    const handleUpdate = async () => {
        if (!selectedPet) return;
        if (isEditing) {
            await fetch(`http://localhost:5000/api/pets/${selectedPet._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: editedNotes }),
            });
            setIsEditing(false);
            fetchPets(user.id);
        } else { setIsEditing(true); }
    };

    const formatDisplayTime = (iso?: string) => {
        if (!iso) return timeOptions[0];
        return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getNextTime = (iso?: string, interval: number = 8) => {
        if (!iso) return "---";
        const next = new Date(new Date(iso).getTime() + (interval * 3600000));
        return next.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    if (!user) return null;

    return (
        <div style={dashStyles.container}>
            <div style={dashStyles.cornerLogo}><Logo /></div>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={dashStyles.logout}>TERMINATE SESSION</button>

            <header style={dashStyles.header}>
                <h1 style={dashStyles.title}>{user.firstName?.toUpperCase()}'S SQUADRON</h1>
            </header>

            <div style={dashStyles.grid}>
                {pets.map(p => (
                    <div key={p._id} style={{...dashStyles.card, border: selectedPet?._id === p._id ? '4px solid #FFF' : '2px solid #D4AF37'}} 
                         onClick={() => {setSelectedPet(p); setEditedNotes(p.notes || ''); setIsEditing(false);}}>
                        <div style={dashStyles.avatar}>🐾</div>
                        <div style={dashStyles.cardName}>{p.name.toUpperCase()}</div>
                    </div>
                ))}
                <div style={dashStyles.addCard} onClick={() => setIsModalOpen(true)}>+</div>
            </div>

            {selectedPet && (
                <div style={dashStyles.details}>
                    <h2 style={dashStyles.vitalsHeader}>
                        VITAL NOTES: {selectedPet.name.toUpperCase()} THE {selectedPet.species.toUpperCase()}
                    </h2>

                    <div style={dashStyles.statusRow}>
                        <div style={dashStyles.statusBox}>
                            <span style={dashStyles.label}>LAST WALK</span>
                            {selectedPet.walkRequired ? (
                                <select style={dashStyles.select} value={formatDisplayTime(selectedPet.lastWalk)} onChange={e => handleTimeChange('lastWalk', e.target.value)}>
                                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            ) : (
                                <div style={dashStyles.disabledBox}>N/A</div>
                            )}
                            <div style={dashStyles.next}>
                                NEXT: {selectedPet.walkRequired ? getNextTime(selectedPet.lastWalk, 6.5) : 'N/A'}
                            </div>
                        </div>

                        <div style={dashStyles.statusBox}>
                            <span style={dashStyles.label}>LAST FEED</span>
                            <select style={dashStyles.select} value={formatDisplayTime(selectedPet.lastFeeding)} onChange={e => handleTimeChange('lastFeeding', e.target.value)}>
                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div style={dashStyles.next}>
                                NEXT: {getNextTime(selectedPet.lastFeeding, selectedPet.feedInterval)}
                            </div>
                        </div>
                    </div>

                    <h3 style={dashStyles.notesHeader}>ADDITIONAL NOTES</h3>
                    <textarea 
                        style={{
                            ...dashStyles.notes, 
                            backgroundColor: isEditing ? '#000' : '#D4AF37',
                            color: isEditing ? '#D4AF37' : '#000'
                        }} 
                        value={editedNotes} 
                        onChange={e => setEditedNotes(e.target.value)} 
                        readOnly={!isEditing} 
                    />
                    
                    <div style={dashStyles.actionRow}>
                        <button onClick={handleUpdate} style={dashStyles.updateBtn}>
                            {isEditing ? "SAVE LOG" : "EDIT NOTES"}
                        </button>
                        <button onClick={() => handleDelete(selectedPet._id)} style={dashStyles.deleteBtn}>
                            DELETE MEMBER
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div style={dashStyles.modal}>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        await fetch('http://localhost:5000/api/pets', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId: user.id, name: newPetName, species: newPetSpecies,
                                walkRequired: newWalkReq, feedInterval: newFeedInt,
                                lastWalk: new Date().toISOString(), lastFeeding: new Date().toISOString()
                            }),
                        });
                        setIsModalOpen(false);
                        fetchPets(user.id);
                    }} style={dashStyles.modalBox}>
                        <h2 style={dashStyles.title}>ENLIST</h2>
                        <input placeholder="NAME" style={dashStyles.modalInput} onChange={e => setNewPetName(e.target.value)} required />
                        <input placeholder="SPECIES" style={dashStyles.modalInput} onChange={e => setNewPetSpecies(e.target.value)} required />
                        <div style={dashStyles.inputGroup}>
                            <label style={dashStyles.label}>FEEDING INTERVAL (HOURS)</label>
                            <input type="number" min="1" max="24" value={newFeedInt} style={dashStyles.modalInput} onChange={e => setNewFeedInt(parseInt(e.target.value))} />
                        </div>
                        <div style={dashStyles.modalCheckRow}>
                            <span>WALK REQUIRED? (check box to the right)</span>
                            <input type="checkbox" checked={newWalkReq} onChange={e => setNewWalkReq(e.target.checked)} />
                        </div>
                        <button type="submit" style={{...dashStyles.updateBtn, width: '100%', marginBottom: '10px'}}>COMMIT</button>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={dashStyles.cancelBtn}>ABORT</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const dashStyles: { [key: string]: React.CSSProperties } = {
    container: { 
        backgroundColor: '#000', backgroundImage: `url('https://img.freepik.com/free-vector/wonders-night-sky-beautiful-wallpaper-with-shiny-star_1017-50570.jpg?semt=ais_hybrid&w=740&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        minHeight: '100vh', padding: '30px 50px', color: '#D4AF37', fontFamily: 'monospace', position: 'relative' 
    },
    cornerLogo: { position: 'absolute', top: '20px', left: '20px', width: '200px' },
    logout: { position: 'absolute', top: '40px', right: '40px', background: '#000', border: '2px solid #e74c3c', color: '#e74c3c', cursor: 'pointer', padding: '10px 20px', fontWeight: 'bold' },
    header: { textAlign: 'center', marginTop: '80px', marginBottom: '40px' },
    title: { letterSpacing: '8px', fontSize: '32px', color: '#FFF' },
    grid: { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' },
    card: { backgroundColor: '#000', width: '150px', padding: '20px', textAlign: 'center', cursor: 'pointer' },
    avatar: { fontSize: '40px', marginBottom: '10px' },
    cardName: { color: '#D4AF37', fontWeight: 'bold' },
    addCard: { width: '150px', height: '125px', border: '2px dashed #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', cursor: 'pointer', backgroundColor: '#000' },
    details: { marginTop: '50px', textAlign: 'center', maxWidth: '650px', margin: '50px auto' },
    vitalsHeader: { color: '#FFF', fontSize: '20px', borderBottom: '2px solid #D4AF37', paddingBottom: '10px', marginBottom: '30px', letterSpacing: '2px' },
    statusRow: { display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' },
    statusBox: { border: '2px solid #D4AF37', padding: '20px', width: '220px', backgroundColor: '#000' },
    disabledBox: { backgroundColor: '#111', color: '#666', padding: '8px', border: '1px solid #444', fontSize: '14px', textAlign: 'center' },
    label: { display: 'block', fontSize: '12px', color: '#FFF', marginBottom: '10px' },
    select: { backgroundColor: '#111', color: '#D4AF37', border: '1px solid #D4AF37', width: '100%', padding: '8px', cursor: 'pointer' },
    next: { fontSize: '12px', color: '#2ecc71', marginTop: '10px', fontWeight: 'bold' },
    notesHeader: { color: '#FFF', fontSize: '16px', letterSpacing: '3px', marginBottom: '10px', textAlign: 'left' },
    notes: { width: '100%', height: '120px', border: '2px solid #D4AF37', padding: '15px', outline: 'none', resize: 'none', fontSize: '16px', fontFamily: 'monospace', boxSizing: 'border-box' },
    actionRow: { display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center', width: '100%' },
    updateBtn: { backgroundColor: '#D4AF37', color: '#000', border: 'none', padding: '15px 40px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' },
    deleteBtn: { backgroundColor: '#000', color: '#e74c3c', border: '2px solid #e74c3c', padding: '15px 40px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    modalBox: { width: '450px', border: '2px solid #D4AF37', padding: '40px', backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    modalInput: { backgroundColor: '#111', border: '1px solid #D4AF37', padding: '12px', color: '#FFF', width: '100%', marginBottom: '15px', boxSizing: 'border-box', fontFamily: 'monospace' },
    inputGroup: { textAlign: 'left', marginBottom: '15px', width: '100%' },
    modalCheckRow: { display: 'flex', justifyContent: 'space-between', color: '#FFF', padding: '10px 0', width: '100%' },
    cancelBtn: { marginTop: '10px', backgroundColor: 'transparent', color: '#FFF', border: 'none', cursor: 'pointer', width: '100%', fontWeight: 'bold' }
};

export default Dashboard;