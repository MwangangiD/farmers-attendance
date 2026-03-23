import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'payroll'] },
    { label: 'Gate',      path: '/gate',      roles: ['admin', 'guard']   },
    { label: 'Workers',   path: '/workers',   roles: ['admin']            },
    { label: 'Reports',   path: '/reports',   roles: ['admin', 'payroll'] },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.brandName}>Farmers Choice</span>
        <span style={styles.brandSub}>Attendance System</span>
      </div>

      <div style={styles.links}>
        {navLinks
          .filter(link => link.roles.includes(user?.role))
          .map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                ...styles.link,
                backgroundColor: location.pathname === link.path ? '#222' : 'transparent',
                color: location.pathname === link.path ? '#fff' : '#444',
              }}
            >
              {link.label}
            </button>
          ))
        }
      </div>

      <div style={styles.right}>
        <span style={styles.userName}>{user?.name}</span>
        <span style={styles.userRole}>{user?.role}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: 'var(--fc-surface)',
    borderBottom: '1px solid var(--fc-border)',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--fc-shadow-sm)'
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandName: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--fc-primary)',
    letterSpacing: '-0.02em'
  },
  brandSub: {
    fontSize: '12px',
    color: 'var(--fc-text-light)',
    fontWeight: '500'
  },
  links: {
    display: 'flex',
    gap: '8px'
  },
  link: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 'var(--fc-radius)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--fc-transition)'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--fc-text)'
  },
  userRole: {
    fontSize: '12px',
    color: 'var(--fc-primary)',
    backgroundColor: 'var(--fc-primary-light)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: 'var(--fc-surface)',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius)',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--fc-text-light)',
    cursor: 'pointer',
    transition: 'var(--fc-transition)'
  }
};