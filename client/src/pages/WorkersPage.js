import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function WorkersPage() {
  const [workers,    setWorkers]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName:     '',
    idNumber:     '',
    workerType:   'individual',
    companyName:  '',
    contractType: 'daily',
    department:   ''
  });

  // eslint-disable-next-line
  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/workers');
      setWorkers(res.data);
    } catch (error) {
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/workers', form);
      toast.success('Worker registered successfully!');
      setShowForm(false);
      setForm({
        fullName: '', idNumber: '', workerType: 'individual',
        companyName: '', contractType: 'daily', department: ''
      });
      fetchWorkers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register worker');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate ${name}?`)) return;
    try {
      await api.delete(`/workers/${id}`);
      toast.success(`${name} deactivated`);
      fetchWorkers();
    } catch (error) {
      toast.error('Failed to deactivate worker');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Workers</h1>
          <p style={styles.pageSub}>{workers.length} active workers registered</p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Register Worker'}
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Register New Worker</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  style={styles.input}
                  name="fullName"
                  placeholder="e.g. John Kamau"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>ID Number</label>
                <input
                  style={styles.input}
                  name="idNumber"
                  placeholder="e.g. KE001234"
                  value={form.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Worker Type</label>
                <select
                  style={styles.input}
                  name="workerType"
                  value={form.workerType}
                  onChange={handleChange}
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
              </div>
              {form.workerType === 'company' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Company Name</label>
                  <input
                    style={styles.input}
                    name="companyName"
                    placeholder="e.g. Lean Energy"
                    value={form.companyName}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div style={styles.formGroup}>
                <label style={styles.label}>Contract Type</label>
                <select
                  style={styles.input}
                  name="contractType"
                  value={form.contractType}
                  onChange={handleChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <input
                  style={styles.input}
                  name="department"
                  placeholder="e.g. Processing"
                  value={form.department}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Registering...' : 'Register Worker'}
            </button>
          </form>
        </div>
      )}

      {/* Workers Table */}
      <div style={styles.card}>
        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : workers.length === 0 ? (
          <p style={styles.empty}>No workers registered yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['Name', 'ID Number', 'Type', 'Company', 'Contract', 'Department', 'Action'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workers.map((worker, i) => (
                <tr key={worker._id}
                  style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={styles.td}>
                    <div style={styles.workerName}>
                      <div style={styles.avatar}>
                        {worker.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      {worker.fullName}
                    </div>
                  </td>
                  <td style={styles.td}>{worker.idNumber}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: worker.workerType === 'company' ? '#e3f2fd' : '#f3e5f5',
                      color:           worker.workerType === 'company' ? '#1565c0' : '#6a1b9a'
                    }}>
                      {worker.workerType}
                    </span>
                  </td>
                  <td style={styles.td}>{worker.companyName || '—'}</td>
                  <td style={styles.td}>{worker.contractType}</td>
                  <td style={styles.td}>{worker.department}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.deactivateBtn}
                      onClick={() => handleDeactivate(worker._id, worker.fullName)}
                    >
                      Deactivate
                    </button>
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

const styles = {
  page: {
    padding: '32px 40px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '6px',
    color: 'var(--fc-text)'
  },
  pageSub: {
    fontSize: '14px',
    color: 'var(--fc-text-light)'
  },
  addBtn: {
    padding: '12px 24px',
    backgroundColor: 'var(--fc-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--fc-radius)',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  formCard: {
    backgroundColor: 'var(--fc-surface)',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius-lg)',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: 'var(--fc-shadow)'
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '24px',
    color: 'var(--fc-text)'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: 'var(--fc-text)'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius)',
    fontSize: '15px',
    outline: 'none',
    color: 'var(--fc-text)',
    backgroundColor: '#fafafa'
  },
  submitBtn: {
    padding: '14px 32px',
    backgroundColor: 'var(--fc-text)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--fc-radius)',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  card: {
    backgroundColor: 'var(--fc-surface)',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius-lg)',
    padding: '32px',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--fc-text-light)',
    borderBottom: '2px solid var(--fc-border)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    borderBottom: '1px solid var(--fc-border)',
    color: 'var(--fc-text)'
  },
  workerName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '500'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--fc-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--fc-text-light)',
    flexShrink: 0,
    border: '1px solid var(--fc-border)'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  deactivateBtn: {
    padding: '6px 14px',
    backgroundColor: 'transparent',
    border: '1px solid var(--fc-danger)',
    borderRadius: 'var(--fc-radius-sm)',
    fontSize: '13px',
    color: 'var(--fc-danger)',
    fontWeight: '500'
  },
  empty: {
    textAlign: 'center',
    color: 'var(--fc-text-muted)',
    padding: '48px 0',
    fontSize: '15px'
  }
};