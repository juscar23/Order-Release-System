import { useState, useEffect } from 'react';

// Target releasing limit per JO (20 minutes)
const TARGET_MINUTES = 20;

export default function Accounting() {
  // Sample active JOs (In production, fetched from backend/Smartsheet)
  const [activeJOs, setActiveJOs] = useState([
    {
      joNumber: 'JO-2026-001',
      customerName: 'ABC Construction',
      qrNumber: 'QR-00125',
      date: new Date().toLocaleDateString(),
      startTime: new Date(Date.now() - 5 * 60 * 1000), // Started 5 mins ago
      status: 'RELEASING',
    },
    {
      joNumber: 'JO-2026-002',
      customerName: 'XYZ Glass Supply',
      qrNumber: 'QR-00126',
      date: new Date().toLocaleDateString(),
      startTime: new Date(Date.now() - 17 * 60 * 1000), // Started 17 mins ago (Yellow zone)
      status: 'RELEASING',
    },
    {
      joNumber: 'JO-2026-003',
      customerName: 'Megaworld Builders',
      qrNumber: 'QR-00127',
      date: new Date().toLocaleDateString(),
      startTime: new Date(Date.now() - 22 * 60 * 1000), // Started 22 mins ago (Exceeded/Red)
      status: 'RELEASING',
    },
  ]);

  const [now, setNow] = useState(new Date());

  // Update clock every second to keep countdowns ticking in real time
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to calculate remaining time and status color
  const getTimerDetails = (startTime) => {
    const elapsedSeconds = Math.floor((now - new Date(startTime)) / 1000);
    const targetSeconds = TARGET_MINUTES * 60;
    const remainingSeconds = targetSeconds - elapsedSeconds;

    const mins = Math.floor(Math.abs(remainingSeconds) / 60);
    const secs = Math.abs(remainingSeconds) % 60;
    const formattedTime = `${remainingSeconds < 0 ? '-' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Color indicators
    if (elapsedSeconds >= targetSeconds) {
      return { timeText: formattedTime, badgeColor: '#dc3545', label: 'EXCEEDED' }; // Red
    } else if (elapsedSeconds >= 15 * 60) {
      return { timeText: formattedTime, badgeColor: '#ffc107', label: 'APPROACHING LIMIT' }; // Yellow
    } else {
      return { timeText: formattedTime, badgeColor: '#28a745', label: 'WITHIN TARGET' }; // Green
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
          {activeJOs.map((jo) => {
            const timer = getTimerDetails(jo.startTime);
            return (
              <tr key={jo.joNumber} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{jo.joNumber}</td>
                <td style={{ padding: '12px' }}>{jo.customerName}</td>
                <td style={{ padding: '12px', color: '#555' }}>{jo.qrNumber}</td>
                <td style={{ padding: '12px' }}>{new Date(jo.startTime).toLocaleTimeString()}</td>
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
          })}
        </tbody>
      </table>
    </div>
  );
}