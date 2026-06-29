import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Activity, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase Auth is not configured.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh' }}>
      <div className="glass-card" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <Activity size={48} color="#2D9CDB" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Admin Access</h2>
        <p style={{ color: '#a0a0a0', marginBottom: '2rem', fontSize: '0.9rem' }}>NetPulse Enterprise Dashboard</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' }}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff' }}
            required
          />
          
          {error && <div style={{ color: '#FF4B4B', fontSize: '0.85rem' }}>{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: 'var(--accent-blue)', 
              color: '#fff', 
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
            <Lock size={18} />
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
