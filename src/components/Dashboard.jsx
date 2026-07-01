import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Download } from 'lucide-react';

const Dashboard = () => {
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      console.log('Firebase not configured, using mock data for preview.');
      setOutages([
        { id: '1', userName: 'Alice (Mock)', type: 'Low Bandwidth', timestamp: Date.now() - 3600000 },
        { id: '2', userName: 'Bob (Mock)', type: 'Offline', timestamp: Date.now() - 7200000 },
        { id: '3', userName: 'Alice (Mock)', type: 'Offline', timestamp: Date.now() - 86400000 }
      ]);
      setLoading(false);
      return;
    }

    // Only pull tickets from the last 24 hours to clear the UI automatically
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const q = query(
      collection(db, 'tickets'), 
      where('timestamp', '>=', twentyFourHoursAgo),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = [];
      snapshot.forEach((doc) => {
        ticketsData.push({ id: doc.id, ...doc.data() });
      });
      setOutages(ticketsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalIncidents = outages.length;

  const generateUserChartData = () => {
    if (outages.length === 0) return [];
    const userCounts = outages.reduce((acc, curr) => {
      const name = curr.userId || curr.userName || 'Unknown';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(userCounts).map(user => ({
      name: user,
      incidents: userCounts[user]
    })).sort((a, b) => b.incidents - a.incidents);
  };

  const userChartData = generateUserChartData();

  const exportToCSV = () => {
    if (outages.length === 0) return;
    const headers = "ID,Employee Name,Type,Time,Message\n";
    const rows = outages.map(ticket => {
      const name = (ticket.userId || ticket.userName || 'Unknown').replace(/,/g, '');
      const type = ticket.type;
      const time = new Date(ticket.timestamp).toLocaleString().replace(/,/g, '');
      const msg = (ticket.message || '').replace(/,/g, '');
      return `${ticket.id},${name},${type},${time},${msg}`;
    }).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `NetPulse_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div style={{ color: '#fff' }}>Loading Live Data from Agents...</div>;
  }

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="dashboard-header" style={{ marginBottom: 0 }}>Live Organization Health</h2>
        <button 
          onClick={exportToCSV}
          disabled={outages.length === 0}
          style={{
            background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: outages.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold'
          }}
        >
          <Download size={18} /> Export CSV Report
        </button>
      </div>
      
      <div className="kpi-grid">
        <div className="glass-card kpi-card">
          <span className="kpi-title">Total Automated Tickets</span>
          <span className="kpi-value">{totalIncidents}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-card chart-card">
          <h3 className="kpi-title" style={{ marginBottom: '1rem' }}>Most Issues by Employee</h3>
          {userChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={userChartData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="#a0a0a0" allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#a0a0a0" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
                  itemStyle={{ color: '#FF4B4B' }}
                />
                <Bar dataKey="incidents" fill="#FF4B4B" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0' }}>
              No issues detected by agents!
            </div>
          )}
        </div>
        
        <div className="glass-card chart-card" style={{ overflowY: 'auto' }}>
          <h3 className="kpi-title" style={{ marginBottom: '1rem' }}>Recent Automated Tickets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {outages.slice(0, 10).map(ticket => (
              <div key={ticket.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#fff' }}>{ticket.userId || ticket.userName}</strong>
                  <span style={{ color: ticket.type === 'Offline' ? '#ef4444' : '#f59e0b', fontSize: '0.875rem' }}>
                    {ticket.type}
                  </span>
                </div>
                <div style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
                  {new Date(ticket.timestamp).toLocaleString()}
                </div>
                {ticket.message && (
                  <div style={{ color: '#ccc', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {ticket.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
