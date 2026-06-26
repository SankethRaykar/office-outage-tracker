import React, { useState } from 'react';
import './App.css';
import { Activity } from 'lucide-react';
import OutageTracker from './components/OutageTracker';
import Dashboard from './components/Dashboard';

function App() {
  const [outages, setOutages] = useState([]);

  const handleOutageLog = (newOutage) => {
    setOutages((prev) => [...prev, newOutage]);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <Activity size={32} color="#2D9CDB" />
          <span>NetPulse</span> reporting
        </h1>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <OutageTracker onOutageLog={handleOutageLog} />
        </section>

        <section>
          <Dashboard outages={outages} />
        </section>
      </main>
    </div>
  );
}

export default App;
