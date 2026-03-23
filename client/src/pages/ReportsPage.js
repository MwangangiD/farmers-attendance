import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsPage() {
  const [month,    setMonth]    = useState(new Date().getMonth() + 1);
  const [year,     setYear]     = useState(new Date().getFullYear());
  const [report,   setReport]   = useState(null);
  const [loading,  setLoading]  = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/monthly?month=${month}&year=${year}`);
      setReport(res.data);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    if (!report) return;
    const data = report.data.map(w => ({
      'Worker Name':    w.workerName,
      'ID Number':      w.idNumber,
      'Worker Type':    w.workerType,
      'Company':        w.companyName || 'Individual',
      'Department':     w.department,
      'Days Worked':    w.daysWorked,
      'Total Hours':    w.totalHours,
      'Overtime Hours': w.overtimeHours
    }));

    const worksheet  = XLSX.utils.json_to_sheet(data);
    const workbook   = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    XLSX.writeFile(workbook, `Attendance_${months[month-1]}_${year}.xlsx`);
    toast.success('Excel report downloaded!');
  };

  const exportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Farmers Choice Limited', 14, 16);
    doc.setFontSize(12);
    doc.text(`Monthly Attendance Report — ${months[month-1]} ${year}`, 14, 24);
    doc.setFontSize(10);
    doc.text(`Total Workers: ${report.totalWorkers}`, 14, 32);
    doc.text(`Total Hours: ${report.totalHours}`, 80, 32);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 32);

    autoTable(doc, {
      startY: 38,
      head: [['Name', 'ID', 'Type', 'Company', 'Dept', 'Days', 'Hours', 'OT Hrs']],
      body: report.data.map(w => [
        w.workerName,
        w.idNumber,
        w.workerType,
        w.companyName || '—',
        w.department,
        w.daysWorked,
        w.totalHours,
        w.overtimeHours
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 34, 34] }
    });

    doc.save(`Attendance_${months[month-1]}_${year}.pdf`);
    toast.success('PDF report downloaded!');
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Reports</h1>
          <p style={styles.pageSub}>Generate monthly attendance reports</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterCard}>
        <div style={styles.filterRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Month</label>
            <select
              style={styles.input}
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Year</label>
            <select
              style={styles.input}
              value={year}
              onChange={e => setYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>&nbsp;</label>
            <button
              style={styles.generateBtn}
              onClick={fetchReport}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Results */}
      {report && (
        <>
          {/* Summary Cards */}
          <div style={styles.metrics}>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Total Workers</div>
              <div style={styles.metricValue}>{report.totalWorkers}</div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Total Hours</div>
              <div style={styles.metricValue}>{report.totalHours}</div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Month</div>
              <div style={styles.metricValue}>{months[month - 1]}</div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Year</div>
              <div style={styles.metricValue}>{year}</div>
            </div>
          </div>

          {/* Export Buttons */}
          <div style={styles.exportRow}>
            <button style={styles.excelBtn} onClick={exportExcel}>
              Download Excel
            </button>
            <button style={styles.pdfBtn} onClick={exportPDF}>
              Download PDF
            </button>
          </div>

          {/* Report Table */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              {months[month - 1]} {year} — Worker Summary
            </h2>
            {report.data.length === 0 ? (
              <p style={styles.empty}>No attendance records for this period.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Worker', 'ID Number', 'Type', 'Company', 'Department',
                      'Days Worked', 'Total Hours', 'Overtime'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.data.map((worker, i) => (
                    <tr key={i}
                      style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={styles.td}>{worker.workerName}</td>
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
                      <td style={styles.td}>{worker.department}</td>
                      <td style={styles.td}>{worker.daysWorked}</td>
                      <td style={styles.td}>{worker.totalHours} hrs</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: worker.overtimeHours > 0 ? '#fff3e0' : '#f5f5f5',
                          color:           worker.overtimeHours > 0 ? '#e65100' : '#888'
                        }}>
                          {worker.overtimeHours} hrs
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
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
  filterCard: {
    backgroundColor: 'var(--fc-surface)',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius-lg)',
    padding: '24px 32px',
    marginBottom: '32px',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  filterRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-end'
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
    minWidth: '180px',
    backgroundColor: '#fafafa',
    color: 'var(--fc-text)'
  },
  generateBtn: {
    padding: '12px 28px',
    backgroundColor: 'var(--fc-text)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--fc-radius)',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '24px'
  },
  metric: {
    backgroundColor: 'var(--fc-surface)',
    border: '1px solid var(--fc-border)',
    borderRadius: 'var(--fc-radius-lg)',
    padding: '24px',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  metricLabel: {
    fontSize: '13px',
    color: 'var(--fc-text-light)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--fc-text)'
  },
  exportRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px'
  },
  excelBtn: {
    padding: '12px 28px',
    backgroundColor: 'var(--fc-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--fc-radius)',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: 'var(--fc-shadow-sm)'
  },
  pdfBtn: {
    padding: '12px 28px',
    backgroundColor: 'var(--fc-danger)',
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