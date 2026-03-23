import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [todayRecords, setTodayRecords] = useState([]);
  const [loading,      setLoading]      = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      const res = await api.get(`/attendance?date=${today}`);
      setTodayRecords(res.data);
    } catch (error) {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const clockedIn  = todayRecords.filter(r => !r.timeOut);
  const clockedOut = todayRecords.filter(r =>  r.timeOut);

  const formatTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString('en-KE', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Dashboard</h1>
      <p style={styles.pageSub}>
        {new Date().toLocaleDateString('en-KE', {
          weekday: 'long', year: 'numeric',
          month: 'long',   day: 'numeric'
        })}
      </p>

      {/* Metric Cards */}
      <div style={styles.metrics}>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>Total Present</div>
          <div style={styles.metricValue}>{todayRecords.length}</div>
          <div style={styles.metricSub}>Clocked in today</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>Currently In</div>
          <div style={{ ...styles.metricValue, color: '#2e7d32' }}>
            {clockedIn.length}
          </div>
          <div style={styles.metricSub}>Not yet clocked out</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>Clocked Out</div>
          <div style={styles.metricValue}>{clockedOut.length}</div>
          <div style={styles.metricSub}>Completed today</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>Total Hours</div>
          <div style={styles.metricValue}>
            {todayRecords.reduce((sum, r) => sum + r.hoursWorked, 0).toFixed(1)}
          </div>
          <div style={styles.metricSub}>Worked today</div>
        </div>
      </div>

      {/* Today's Attendance Table */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Today's Attendance</h2>
        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : todayRecords.length === 0 ? (
          <p style={styles.empty}>No attendance records for today yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['Worker', 'Company', 'Department', 'Time In', 'Time Out', 'Hours', 'Status'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todayRecords.map((record, i) => (
                <tr key={record._id}
                  style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={styles.td}>{record.worker?.fullName}</td>
                  <td style={styles.td}>{record.worker?.companyName || '—'}</td>
                  <td style={styles.td}>{record.worker?.department}</td>
                  <td style={styles.td}>{formatTime(record.timeIn)}</td>
                  <td style={styles.td}>{formatTime(record.timeOut)}</td>
                  <td style={styles.td}>{record.hoursWorked.toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: record.timeOut ? '#f5f5f5' : '#e8f5e9',
                      color:           record.timeOut ? '#888'    : '#2e7d32'
                    }}>
                      {record.timeOut ? 'Clocked Out' : 'Present'}
                    </span>
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
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '6px',
    color: 'var(--fc-text)'
  },
  pageSub: {
    fontSize: '14px',
    color: 'var(--fc-text-light)',
    marginBottom: '32px'
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '32px'
  },
  metric: {
    backgroundColor: 'var(--fc-surface)',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius-lg)',
    padding: '24px',
    boxShadow: 'var(--fc-shadow-sm)',
    transition: 'var(--fc-transition)'
  },
  metricLabel: {
    fontSize: '13px',
    color: 'var(--fc-text-light)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  metricValue: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '6px',
    color: 'var(--fc-text)'
  },
  metricSub: {
    fontSize: '13px',
    color: 'var(--fc-text-muted)'
  },
  card: {
    backgroundColor: 'var(--fc-surface)',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius-lg)',
    padding: '32px',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'var(--fc-text)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
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
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  empty: {
    textAlign: 'center',
    color: 'var(--fc-text-muted)',
    padding: '48px 0',
    fontSize: '15px'
  }
};

