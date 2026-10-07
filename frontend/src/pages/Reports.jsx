import { useState } from 'react';

export default function Reports() {
  const [history] = useState([
    { joNumber: 'JO-2026-001', customerName: 'ABC Construction', qrNumber: 'QR-00125', date: '2026-10-07', duration: '14 mins 32 secs', status: 'COMPLETED WITHIN TARGET' },
    { joNumber: 'JO-2026-004', customerName: 'Vista Land Inc', qrNumber: 'QR-00128', date: '2026-10-07', duration: '18 mins 10 secs', status: 'COMPLETED WITHIN TARGET' },
    { joNumber: 'JO-2026-005', customerName: 'Roxas Commercial', qrNumber: 'QR-00129', date: '2026-10-07', duration: '24 mins 45 secs', status: 'EXCEEDED 20 MINUTES' },
  ]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#003366' }}>Release History & KPI Reports</h2>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Total JOs Released</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#003366' }}>3</h3>
        </div>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Completed Within 20m</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#28a745' }}>2</h3>
        </div>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Exceeded Target</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#dc3545' }}>1</h3>
        </div>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Average Release Time</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#003366' }}>19m 09s</h3>
        </div>
      </div>

      {/* History Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#003366', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>JO Number</th>
            <th style={{ padding: '12px' }}>Customer Name</th>
            <th style={{ padding: '12px' }}>QR Number</th>
            <th style={{ padding: '12px' }}>Release Date</th>
            <th style={{ padding: '12px' }}>Total Duration</th>
            <th style={{ padding: '12px' }}>Performance Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.joNumber} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.joNumber}</td>
              <td style={{ padding: '12px' }}>{item.customerName}</td>
              <td style={{ padding: '12px', color: '#555' }}>{item.qrNumber}</td>
              <td style={{ padding: '12px' }}>{item.date}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.duration}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  backgroundColor: item.status.includes('WITHIN') ? '#28a745' : '#dc3545',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}