import { useState, useEffect } from 'react';

// Target releasing limit per JO (20 minutes)
const TARGET_MINUTES = 20;

export default function Accounting() {
  const [activeJOs, setActiveJOs] = useState([]);
  const [now, setNow] = useState(new Date());

  // Fetch live orders from Smartsheet backend
  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      setActiveJOs(data);
    } catch (err) {
      console.error('Error fetching live data:', err);
    }
  };

  // Auto-refresh orders every 5s
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update clock every second to keep countdowns ticking
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate remaining time and status color
  const getTimerDetails = (startTime) => {
    if (!startTime) return { timeText: '--:--', badgeColor: '#6c757d', label: 'NO TIME' };

    const elapsedSeconds = Math.floor((now - new Date(startTime)) / 1000);
    const targetSeconds = TARGET_MINUTES * 60;
    const remainingSeconds = targetSeconds - elapsedSeconds;

    const mins = Math.floor(Math.abs(remainingSeconds) / 60);
    const secs = Math.abs(remainingSeconds) % 60;
    const formattedTime = `${remainingSeconds < 0 ? '-' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (elapsedSeconds >= targetSeconds) {
      return { timeText: formattedTime, badgeColor: '#dc3545', label: 'EXCEEDED' };
    } else if (elapsedSeconds >= 15 * 60) {
      return { timeText: formattedTime, badgeColor: '#ffc107', label: 'APPROACHING LIMIT' };
    } else {
      return { timeText: formattedTime, badgeColor: '#28a745', label: 'WITHIN TARGET' };
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#003366', marginBottom: '5px' }}>Accounting Monitoring Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Real-time 20-minute order release tracking</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#003366', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>JO Number</th>
            <th style={{ padding: '12px' }}>Customer Name</th>
            <th style={{ padding: '12px' }}>QR Number</th>
            <th style={{ padding: '12px' }}>Start Time</th>
            <th style={{ padding: '12px' }}>Countdown Timer</th>
            <th style={{ padding: '12px' }}>Status Indicator</th>
          </tr>
        </thead>
        <tbody>
          {activeJOs.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                No active releasing orders found in Smartsheet.
              </td>
            </tr>
          ) : (
            activeJOs.map((jo, idx) => {
              const timer = getTimerDetails(jo.startTime);
              return (
                <tr key={jo.joNumber || idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{jo.joNumber || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{jo.customerName || 'N/A'}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{jo.qrNumber || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    {jo.startTime ? new Date(jo.startTime).toLocaleTimeString() : 'N/A'}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>
                    {timer.timeText}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: timer.badgeColor, color: timer.badgeColor === '#ffc107' ? '#000' : 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      {timer.label}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}