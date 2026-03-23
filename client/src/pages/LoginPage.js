import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      if (res.data.role === 'guard') {
        navigate('/gate');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.company}>Farmers Choice Limited</h1>
        <h2 style={styles.title}>Attendance System</h2>
        <p style={styles.sub}>Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--fc-bg)'
  },
  card: {
    background: 'var(--fc-surface)',
    padding: '48px 40px',
    borderRadius: 'var(--fc-radius-lg)',
    width: '100%',
    maxWidth: '420px',
    boxShadow: 'var(--fc-shadow-md)',
    border: '1px solid var(--fc-border)'
  },
  company: {
    fontSize: '14px',
    color: 'var(--fc-primary)',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '8px',
    color: 'var(--fc-text)'
  },
  sub: {
    fontSize: '15px',
    color: 'var(--fc-text-light)',
    textAlign: 'center',
    marginBottom: '32px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: 'var(--fc-text)'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius)',
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#fafafa',
    color: 'var(--fc-text)'
  },
  btn: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'var(--fc-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--fc-radius)',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '12px',
    cursor: 'pointer',
    boxShadow: 'var(--fc-shadow-sm)'
  }
};