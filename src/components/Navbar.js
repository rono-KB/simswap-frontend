import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1F3864, #2E75B6)',
      padding: '14px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>
          🔐 SIM Swap Detector
        </span>
        <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px' }}>
          Dashboard
        </Link>
        <Link to="/events" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px' }}>
          Events
        </Link>
        <Link to="/simulate" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px' }}>
          Simulate Attack
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
          👤 {user?.name}
        </span>
        <button
          onClick={logout}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;