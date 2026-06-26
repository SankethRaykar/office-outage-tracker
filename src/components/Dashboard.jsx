import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = ({ outages }) => {
  const totalIncidents = outages.length;
  const totalDowntimeMs = outages.reduce((acc, curr) => acc + curr.durationMs, 0);

  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const generateChartData = () => {
    if (outages.length === 0) return [];
    return outages.map((outage, index) => ({
      name: `Incident ${index + 1}`,
      duration: Math.floor(outage.durationMs / 1000) // in seconds
    }));
  };

  const generateUserChartData = () => {
    if (outages.length === 0) return [];
    
    const userCounts = outages.reduce((acc, curr) => {
      acc[curr.userName] = (acc[curr.userName] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(userCounts).map(user => ({
      name: user,
      incidents: userCounts[user]
    })).sort((a, b) => b.incidents - a.incidents); // Sort by most incidents
  };

  const chartData = generateChartData();
  const userChartData = generateUserChartData();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Organization Health Overview</h2>
      
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Total Incidents</span>
          <span className="kpi-value">{totalIncidents}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Cumulative Downtime</span>
          <span className="kpi-value">{formatDuration(totalDowntimeMs)}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="kpi-title" style={{ marginBottom: '1rem' }}>Network Health Trend (Duration in Seconds)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#a0a0a0" />
                <YAxis stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
                  itemStyle={{ color: '#2D9CDB' }}
                />
                <Bar dataKey="duration" fill="#2D9CDB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0' }}>
              No outages reported yet.
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3 className="kpi-title" style={{ marginBottom: '1rem' }}>Incidents by User</h3>
          {userChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={userChartData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="#a0a0a0" allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#a0a0a0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
                  itemStyle={{ color: '#FF4B4B' }}
                />
                <Bar dataKey="incidents" fill="#FF4B4B" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0' }}>
              No user data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
