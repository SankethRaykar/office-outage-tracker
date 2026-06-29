import React, { useState, useEffect } from 'react';
import './App.css';
import { Activity, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Authenticating...</div>;
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <Activity size={32} color="#2D9CDB" />
          <span>NetPulse</span> admin center
        </h1>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
              Monitoring Agents Active
            </div>
            <button 
              onClick={() => signOut(auth)}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
            Secure Enterprise Node
          </div>
        )}
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          {user ? <Dashboard /> : <Login />}
        </section>
      </main>
    </div>
  );
}

export default App;
