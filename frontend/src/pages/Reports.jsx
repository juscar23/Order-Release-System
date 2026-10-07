import { useState, useEffect } from 'react';

export default function Reports() {
  const [history, setHistory] = useState([]);

  // Fetch all completed/logged orders from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching live data:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper calculation metrics
  const completedJobs = history.filter((item) => item.endTime);
  const withinTargetCount = completedJobs.filter((item) => {
    if (!item.startTime || !item.endTime) return false;
    const durationMins = (new Date(item.endTime) - new Date(item.startTime)) / (1000 * 60);
    return durationMins <= 20;
  }).length;

  const exceededCount = completedJobs.length - withinTargetCount;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#003366' }}>Release History & KPI Reports</h2>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Total JOs Released</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#003366' }}>{completedJobs.length}</h3>
        </div>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Completed Within 20m</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#28a745' }}>{withinTargetCount}</h3>
        </div>
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Exceeded Target</span>
          <h3 style={{ margin: '5px 0 0 0', color: '#dc3545' }}>{exceededCount}</h3>
        </div>
      </div>

      {/* History Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#003366', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>JO Number</th>
            <th style={{ padding: '12px' }}>Customer Name</th>
            <th style={{ padding: '12px' }}>QR Number</th>
            <th style={{ padding: '12px' }}>Start Time</th>
            <th style={{ padding: '12px' }}>End Time</th>
            <th style={{ padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                No release history recorded yet in Smartsheet.
              </td>
            </tr>
          ) : (
            history.map((item, idx) => (
              <tr key={item.joNumber || idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.joNumber || 'N/A'}</td>
                <td style={{ padding: '12px' }}>{item.customerName || 'N/A'}</td>
                <td style={{ padding: '12px', color: '#555' }}>{item.qrNumber || 'N/A'}</td>
                <td style={{ padding: '12px' }}>{item.startTime ? new Date(item.startTime).toLocaleTimeString() : 'N/A'}</td>
                <td style={{ padding: '12px' }}>{item.endTime ? new Date(item.endTime).toLocaleTimeString() : 'N/A'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    backgroundColor: item.status === 'COMPLETED' ? '#28a745' : '#003366',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {item.status || 'RELEASING'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}