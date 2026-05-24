import { useState, useEffect } from 'react';
import API from '../utils/api';

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/monitor/events');
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'flagged'
    ? events.filter(e => e.flagged)
    : filter === 'safe'
    ? events.filter(e => !e.flagged)
    : events;

  const getRiskColor = (score) => {
    if (score >= 60) return '#e74c3c';
    if (score >= 30) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#1F3864' }}>📋 All Events</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'flagged', 'safe'].map(f => (
              <button
                key={f}
                className={`btn ${filter === f ? 'btn-primary' : ''}`}
                style={{ background: filter === f ? '#2E75B6' : '#eee', color: filter === f ? 'white' : '#333', padding: '6px 14px' }}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '30px' }}>No events found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {['Event Type', 'Device', 'Location', 'Risk Score', 'Status', 'Time'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #eee', color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(event => (
                <tr key={event._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="badge badge-warning">{event.eventType}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>{event.device}</td>
                  <td style={{ padding: '10px 12px' }}>{event.location}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ color: getRiskColor(event.riskScore), fontWeight: '700' }}>
                      {event.riskScore}/100
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {event.flagged
                      ? <span className="badge badge-danger">⚠️ Flagged</span>
                      : <span className="badge badge-success">✅ Safe</span>
                    }
                  </td>
                  <td style={{ padding: '10px 12px', color: '#888', fontSize: '12px' }}>
                    {new Date(event.createdAt).toLocaleString('en-KE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Events;