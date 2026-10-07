import { useState } from 'react';

export default function Releasing() {
  const [manualInput, setManualInput] = useState('');
  const [completedJob, setCompletedJob] = useState(null);

  // Simulates scanning or typing a QR code to complete a release
  const handleProcessScan = (qrValue) => {
    try {
      const parsedData = JSON.parse(qrValue);
      const completionTime = new Date();
      const startTime = new Date(Date.now() - 14 * 60 * 1000 - 32 * 1000); // Simulated start (14 min 32 sec ago)

      const durationSecs = Math.floor((completionTime - startTime) / 1000);
      const mins = Math.floor(durationSecs / 60);
      const secs = durationSecs % 60;

      setCompletedJob({
        joNumber: parsedData.joNumber || 'JO-2026-001',
        customerName: parsedData.customerName || 'ABC Construction',
        qrNumber: parsedData.qrNumber || qrValue,
        startTime: startTime.toLocaleTimeString(),
        completionTime: completionTime.toLocaleTimeString(),
        duration: `${mins} minutes ${secs} seconds`,
        status: mins <= 20 ? 'COMPLETED WITHIN TARGET' : 'EXCEEDED 20 MINUTES',
      });
    } catch {
      alert('Invalid QR Format. Please use manual override or rescan.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', padding: '10px' }}>
      <h2 style={{ color: '#003366', textAlign: 'center' }}>Final Checking Terminal</h2>
      <p style={{ color: '#666', textAlign: 'center', fontSize: '14px' }}>Scan customer thermal receipt to complete release</p>

      {/* Manual Input Backup */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Manual QR Payload Input (Backup)</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder='Paste payload or type QR number'
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          />
          <button onClick={() => handleProcessScan(manualInput)} style={{ padding: '8px 12px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer' }}>
            Submit
          </button>
        </div>
      </div>

      {/* Completion Modal / Summary Card */}
      {completedJob && (
        <div style={{ background: '#e8f5e9', border: '2px solid #28a745', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#28a745', marginTop: 0 }}>✓ RELEASE COMPLETED</h3>
          <p><strong>JO Number:</strong> {completedJob.joNumber}</p>
          <p><strong>Customer:</strong> {completedJob.customerName}</p>
          <p><strong>Start Time:</strong> {completedJob.startTime}</p>
          <p><strong>Completion Time:</strong> {completedJob.completionTime}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#003366' }}>Total Duration: {completedJob.duration}</p>
          <span style={{ background: '#28a745', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            {completedJob.status}
          </span>
        </div>
      )}
    </div>
  );
}