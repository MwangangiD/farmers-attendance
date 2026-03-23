import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function GatePage() {
  const [idNumber,    setIdNumber]    = useState('');
  const [worker,      setWorker]      = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [searching,   setSearching]   = useState(false);

  const formatTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString('en-KE', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Step 1 — Search worker by ID number
  const handleSearch = async () => {
    if (!idNumber.trim()) {
      toast.error('Please enter a worker ID number');
      return;
    }
    setSearching(true);
    setWorker(null);
    setTodayRecord(null);
    try {
      // Search worker by ID number
      const res = await api.get(`/workers?idNumber=${idNumber.trim()}`);
      if (res.data.length === 0) {
        toast.error('No worker found with that ID number');
        return;
      }
      const foundWorker = res.data[0];
      setWorker(foundWorker);

      // Check if worker already has a record today
      const today = new Date().toISOString().split('T')[0];
      const attRes = await api.get(
        `/attendance?date=${today}&workerId=${foundWorker._id}`
      );
      if (attRes.data.length > 0) {
        setTodayRecord(attRes.data[0]);
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  // Step 2a — Clock In
  const handleClockIn = async () => {
    setLoading(true);
    try {
      const res = await api.post('/attendance/checkin', {
        workerId: worker._id
      });
      setTodayRecord(res.data);
      toast.success(`${worker.fullName} clocked in successfully!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Clock in failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2b — Clock Out
  const handleClockOut = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/attendance/checkout/${todayRecord._id}`);
      setTodayRecord(res.data);
      toast.success(`${worker.fullName} clocked out successfully!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Clock out failed');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setIdNumber('');
    setWorker(null);
    setTodayRecord(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Gate Attendance</h1>
        <p style={styles.sub}>Enter worker ID to clock in or out</p>

        {/* Search Box */}
        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Enter Worker ID Number e.g. KE001234"
            value={idNumber}
            onChange={e => setIdNumber(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button
            style={styles.searchBtn}
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Worker Card */}
        {worker && (
          <div style={styles.workerCard}>
            {/* Worker Info */}
            <div style={styles.workerHeader}>
              <div style={styles.avatar}>
                {worker.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={styles.workerName}>{worker.fullName}</div>
                <div style={styles.workerMeta}>
                  {worker.idNumber} &nbsp;•&nbsp;
                  {worker.department} &nbsp;•&nbsp;
                  {worker.workerType === 'company'
                    ? worker.companyName
                    : 'Individual'}
                </div>
              </div>
              {/* Status Badge */}
              <div style={{
                ...styles.statusBadge,
                backgroundColor: todayRecord
                  ? todayRecord.timeOut ? '#f5f5f5' : '#e8f5e9'
                  : '#fff3e0',
                color: todayRecord
                  ? todayRecord.timeOut ? '#888' : '#2e7d32'
                  : '#e65100'
              }}>
                {todayRecord
                  ? todayRecord.timeOut ? 'Clocked Out' : 'Currently In'
                  : 'Not Clocked In'}
              </div>
            </div>

            {/* Time Info */}
            {todayRecord && (
              <div style={styles.timeInfo}>
                <div style={styles.timeBlock}>
                  <div style={styles.timeLabel}>Time In</div>
                  <div style={styles.timeValue}>
                    {formatTime(todayRecord.timeIn)}
                  </div>
                </div>
                <div style={styles.timeBlock}>
                  <div style={styles.timeLabel}>Time Out</div>
                  <div style={styles.timeValue}>
                    {formatTime(todayRecord.timeOut)}
                  </div>
                </div>
                <div style={styles.timeBlock}>
                  <div style={styles.timeLabel}>Hours Worked</div>
                  <div style={styles.timeValue}>
                    {todayRecord.hoursWorked.toFixed(2)} hrs
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={styles.actions}>
              {!todayRecord && (
                <button
                  style={styles.clockInBtn}
                  onClick={handleClockIn}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'CLOCK IN'}
                </button>
              )}
              {todayRecord && !todayRecord.timeOut && (
                <button
                  style={styles.clockOutBtn}
                  onClick={handleClockOut}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'CLOCK OUT'}
                </button>
              )}
              {todayRecord && todayRecord.timeOut && (
                <div style={styles.doneMsg}>
                  ✓ Completed for today
                </div>
              )}
              <button style={styles.resetBtn} onClick={handleReset}>
                Search Another Worker
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--fc-bg)',
    padding: '48px 24px'
  },
  container: {
    maxWidth: '560px',
    margin: '0 auto'
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
    marginBottom: '40px'
  },
  searchBox: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px'
  },
  searchInput: {
    flex: 1,
    padding: '16px 20px',
    fontSize: '16px',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius-lg)',
    outline: 'none',
    boxShadow: 'var(--fc-shadow-sm)',
    color: 'var(--fc-text)'
  },
  searchBtn: {
    padding: '16px 28px',
    backgroundColor: 'var(--fc-text)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--fc-radius-lg)',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  workerCard: {
    backgroundColor: 'var(--fc-surface)',
    borderRadius: 'var(--fc-radius-lg)',
    padding: '32px',
    border: '1px solid var(--fc-border)',
    boxShadow: 'var(--fc-shadow)'
  },
  workerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px'
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--fc-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--fc-text-light)',
    flexShrink: 0,
    border: '1px solid var(--fc-border)'
  },
  workerName: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '6px',
    color: 'var(--fc-text)'
  },
  workerMeta: {
    fontSize: '13px',
    color: 'var(--fc-text-light)'
  },
  statusBadge: {
    marginLeft: 'auto',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    flexShrink: 0
  },
  timeInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    backgroundColor: 'var(--fc-bg)',
    borderRadius: 'var(--fc-radius)',
    padding: '20px',
    marginBottom: '28px',
    border: '1px solid var(--fc-border)'
  },
  timeBlock: {
    textAlign: 'center'
  },
  timeLabel: {
    fontSize: '12px',
    color: 'var(--fc-text-light)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  timeValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--fc-text)'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  clockInBtn: {
    width: '100%',
    padding: '18px',
    backgroundColor: 'var(--fc-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--fc-radius)',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  clockOutBtn: {
    width: '100%',
    padding: '18px',
    backgroundColor: 'var(--fc-danger)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--fc-radius)',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  doneMsg: {
    textAlign: 'center',
    padding: '18px',
    backgroundColor: 'var(--fc-bg)',
    borderRadius: 'var(--fc-radius)',
    fontSize: '16px',
    color: 'var(--fc-text-light)',
    fontWeight: '500',
    border: '1px dashed var(--fc-border)'
  },
  resetBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'transparent',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius)',
    fontSize: '15px',
    color: 'var(--fc-text-light)',
    fontWeight: '500'
  }
};