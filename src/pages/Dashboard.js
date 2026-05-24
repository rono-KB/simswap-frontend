import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../utils/api';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, alertsRes] = await Promise.all([
        API.get('/monitor/events'),
        API.get('/alerts')
      ]);
      setEvents(eventsRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const flagged = events.filter(e => e.flagged).length;
  const safe = events.filter(e => !e.flagged).length;
  const pieData = [
    { name: 'Flagged', value: flagged },
    { name: 'Safe', value: safe }
  ];
  const COLORS = ['#e74c3c', '#27ae60'];

  const barData = ['sim_change', 'new_device_login', 'otp_failure', 'location_anomaly', 'normal'].map(type => ({
    name: type.replace('_', ' '),
    count: events.filter(e => e.eventType === type).length
  }));

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      {/* Welcome */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1F3864, #2E75B6)', color: 'white' }}>
        <h2>👋 Welcome back, {user?.name}</h2>
        <p style={{ marginTop: '6px', opacity: 0.85 }}>Phone: {user?.phone} &nbsp;|&nbsp; Monitoring: Active ✅</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: '13px' }}>Total Events</p>
          <h2 style={{ fontSize: '36px', color: '#1F3864' }}>{events.length}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: '13px' }}>Flagged Events</p>
          <h2 style={{ fontSize: '36px', color: '#e74c3c' }}>{flagged}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: '13px' }}>Safe Events</p>
          <h2 style={{ fontSize: '36px', color: '#27ae60' }}>{safe}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: '13px' }}>Total Alerts</p>
          <h2 style={{ fontSize: '36px', color: '#f39c12' }}>{alerts.length}</h2>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#1F3864' }}>Events by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2E75B6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#1F3864' }}>Flagged vs Safe</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', color: '#1F3864' }}>Recent Alerts</h3>
        {alerts.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>✅ No alerts yet — your account is safe!</p>
        ) : (
          alerts.slice(0, 5).map(alert => (
            <div key={alert._id} className="alert-box alert-danger">
              <strong>⚠️ Alert:</strong> {alert.message.substring(0, 120)}...
              <br /><small style={{ color: '#888' }}>{new Date(alert.createdAt).toLocaleString('en-KE')}</small>
            </div>
          ))
        )}
        <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={() => navigate('/simulate')}>
          🧪 Simulate Attack
        </button>
      </div>
    </div>
  );
}

export default Dashboard;