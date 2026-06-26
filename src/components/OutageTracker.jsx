import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, User } from 'lucide-react';

const OutageTracker = ({ onOutageLog }) => {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    let intervalId;
    if (isActive && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100); // Update frequently for smooth display
    }
    return () => clearInterval(intervalId);
  }, [isActive, startTime]);

  const handleReport = () => {
    if (!userName.trim()) {
      alert('Please enter your name before reporting an outage.');
      return;
    }
    setIsActive(true);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const handleRestore = () => {
    setIsActive(false);
    if (startTime) {
      const finalDuration = Date.now() - startTime;
      onOutageLog({
        id: Date.now().toString(),
        userName: userName.trim(),
        timestamp: startTime,
        durationMs: finalDuration
      });
      setStartTime(null);
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="tracker-card">
      <h2>{isActive ? 'Downtime Active' : 'Network is Healthy'}</h2>
      <div className={`stopwatch-display ${isActive ? 'active' : ''}`}>
        {formatTime(elapsedTime)}
      </div>
      
      {!isActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
          <div className="input-group">
            <User size={18} color="#a0a0a0" />
            <input 
              type="text" 
              placeholder="Enter your name..." 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="user-input"
            />
          </div>
          <button className="btn-primary" onClick={handleReport}>
            <AlertCircle size={24} />
            Report Outage
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ color: '#a0a0a0' }}>Reported by: <strong style={{ color: '#fff' }}>{userName}</strong></div>
          <button className="btn-restore" onClick={handleRestore}>
            <CheckCircle2 size={24} />
            Restore
          </button>
        </div>
      )}
    </div>
  );
};

export default OutageTracker;
