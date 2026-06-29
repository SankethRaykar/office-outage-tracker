import React from 'react';
import './App.css';
import { Activity } from 'lucide-react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <Activity size={32} color="#2D9CDB" />
          <span>NetPulse</span> admin center
        </h1>
        <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
          Monitoring Agents Active
        </div>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <Dashboard />
        </section>
      </main>
    </div>
  );
}

export default App;
