import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, User, WifiHigh } from 'lucide-react';

const OutageTracker = ({ onOutageLog }) => {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userName, setUserName] = useState('');
  const [isAutoDetect, setIsAutoDetect] = useState(false);

  // Stopwatch timer
  useEffect(() => {
    let intervalId;
    if (isActive && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100); // Update frequently for smooth display
    }
    return () => clearInterval(intervalId);
  }, [isActive, startTime]);

  // Wi-Fi Fluctuation Auto-Detector Logic
  useEffect(() => {
    const handleOffline = () => {
      if (isAutoDetect) {
        if (!isActive) {
          setIsActive(true);
          setStartTime(Date.now());
          setElapsedTime(0);
        }
      }
    };

    const handleOnline = () => {
      if (isAutoDetect && isActive && startTime) {
        setIsActive(false);
        const finalDuration = Date.now() - startTime;
        onOutageLog({
          id: Date.now().toString(),
          userName: userName.trim() || 'Auto-Detected User',
          timestamp: startTime,
          durationMs: finalDuration,
          isAutoDetected: true
        });
        setStartTime(null);
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [isAutoDetect, isActive, startTime, userName, onOutageLog]);

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
        durationMs: finalDuration,
        isAutoDetected: false
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
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '300px' }}>
        <div className="input-group">
          <User size={18} color="#a0a0a0" />
          <input 
            type="text" 
            placeholder="Enter your name..." 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="user-input"
            disabled={isActive}
          />
        </div>

        <div className="toggle-container" onClick={() => setIsAutoDetect(!isAutoDetect)}>
          <div className={`toggle-switch ${isAutoDetect ? 'on' : 'off'}`}>
             <div className="toggle-knob"></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <WifiHigh size={16} color={isAutoDetect ? '#3b82f6' : '#a0a0a0'} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: isAutoDetect ? '#3b82f6' : '#a0a0a0' }}>
              Wi-Fi Fluctuation Detector
            </span>
          </div>
        </div>

        {!isActive ? (
          <button className="btn-primary" onClick={handleReport}>
            <AlertCircle size={24} />
            {isAutoDetect ? 'Manual Report' : 'Report Outage'}
          </button>
        ) : (
          <button className="btn-restore" onClick={handleRestore}>
            <CheckCircle2 size={24} />
            {isAutoDetect ? 'Manual Restore' : 'Restore'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OutageTracker;
