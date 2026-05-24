import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

function SimulateAttack() {
  const [form, setForm] = useState({
    eventType: 'sim_change',
    device: '',
    location: '',
    newDevice: false
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data } = await API.post('/monitor/event', form);
      setResult(data);
      if (data.flagged) {
        toast.error('⚠️ SIM Swap Attack Detected!');
      } else {
        toast.success('✅ No threat detected');
      }
    } catch (err) {
      toast.error('Failed to simulate event');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#1F3864', marginBottom: '6px' }}>🧪 Simulate SIM Swap Attack</h2>
        <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
          Test the detection engine by simulating different attack scenarios.
        </p>

        <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Event Type</label>
        <select
          className="input"
          style={{ marginTop: '6px' }}
          value={form.eventType}
          onChange={e => setForm({...form, eventType: e.target.value})}
        >
          <option value="sim_change">SIM Change</option>
          <option value="new_device_login">New Device Login</option>
          <option value="otp_failure">OTP Failure</option>
          <option value="location_anomaly">Location Anomaly</option>
          <option value="normal">Normal Activity</option>
        </select>

        <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Device Name</label>
        <input
          className="input"
          style={{ marginTop: '6px' }}
          type="text"
          placeholder="e.g. Unknown Android, iPhone 13"
          value={form.device}
          onChange={e => setForm({...form, device: e.target.value})}
        />

        <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Location</label>
        <input
          className="input"
          style={{ marginTop: '6px' }}
          type="text"
          placeholder="e.g. Mombasa, Kisumu, Nairobi"
          value={form.location}
          onChange={e => setForm({...form, location: e.target.value})}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="newDevice"
            checked={form.newDevice}
            onChange={e => setForm({...form, newDevice: e.target.checked})}
            style={{ width: '16px', height: '16px' }}
          />
          <label htmlFor="newDevice" style={{ fontSize: '14px', color: '#555' }}>
            New/Unknown Device (increases risk score)
          </label>
        </div>

        <button
          className="btn btn-danger"
          style={{ width: '100%', padding: '12px' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : '🚨 Run Detection'}
        </button>

        {/* Result */}
        {result && (
          <div style={{ marginTop: '24px' }}>
            <div className={`alert-box ${result.flagged ? 'alert-danger' : 'alert-success'}`}>
              <h3 style={{ marginBottom: '10px' }}>
                {result.flagged ? '⚠️ THREAT DETECTED' : '✅ NO THREAT DETECTED'}
              </h3>
              <p><strong>Risk Score:</strong> {result.riskScore}/100</p>
              <p><strong>Status:</strong> {result.flagged ? 'Flagged — Alert Sent' : 'Safe'}</p>
              {result.reasons.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Reasons:</strong>
                  <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
                    {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Risk meter */}
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: '#555', marginBottom: '6px' }}>
                <strong>Risk Level:</strong> {result.riskScore}/100
              </p>
              <div style={{ background: '#eee', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
                <div style={{
                  width: `${result.riskScore}%`,
                  height: '100%',
                  background: result.riskScore >= 60 ? '#e74c3c' : result.riskScore >= 30 ? '#f39c12' : '#27ae60',
                  borderRadius: '8px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimulateAttack;