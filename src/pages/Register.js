import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1F3864, #2E75B6)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#1F3864', fontSize: '24px' }}>🔐 SIM Swap Detector</h1>
          <p style={{ color: '#888', marginTop: '6px' }}>Create your account</p>
        </div>
        <input className="input" type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="input" type="text" placeholder="Phone (e.g. +254712345678)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          Have an account? <Link to="/login" style={{ color: '#2E75B6' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;