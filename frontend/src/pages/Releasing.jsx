import { useState } from 'react';

export default function Releasing() {
  const [manualInput, setManualInput] = useState('');
  const [completedJob, setCompletedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProcessScan = async (qrValue) => {
    if (!qrValue.trim()) return;
    setLoading(true);

    try {
      let joOrQr = qrValue;
      if (qrValue.startsWith('{')) {
        const parsed = JSON.parse(qrValue);
        joOrQr = parsed.qrNumber || parsed.joNumber;
      }

      // 1. Send update to Smartsheet via backend
      const res = await fetch('http://localhost:5000/api/complete-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrNumber: joOrQr })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete order');
      }

      // 2. Fetch updated records to show real completed data
      const ordersRes = await fetch('http://localhost:5000/api/orders');
      const orders = await ordersRes.json();
      const updatedOrder = orders.find(o => o.qrNumber === joOrQr || o.joNumber === joOrQr);

      const startTime = updatedOrder?.startTime ? new Date(updatedOrder.startTime) : new Date();
      const completionTime = new Date();
      const durationSecs = Math.floor((completionTime - startTime) / 1000);
      const mins = Math.floor(durationSecs / 60);
      const secs = durationSecs % 60;

      setCompletedJob({
        joNumber: updatedOrder?.joNumber || joOrQr,
        customerName: updatedOrder?.customerName || 'Recorded Customer',
        startTime: startTime.toLocaleTimeString(),
        completionTime: completionTime.toLocaleTimeString(),
        duration: `${mins} minutes ${secs} seconds`,
        status: mins <= 20 ? 'COMPLETED WITHIN TARGET' : 'EXCEEDED 20 MINUTES',
      });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', padding: '10px' }}>
      <h2 style={{ color: '#003366', textAlign: 'center' }}>Final Checking Terminal</h2>
      <p style={{ color: '#666', textAlign: 'center', fontSize: '14px' }}>Scan customer thermal receipt to complete release</p>

      {/* Manual Input Backup */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Manual QR Payload / JO Number Input</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Type JO Number (e.g. JO123)"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          />
          <button 
            onClick={() => handleProcessScan(manualInput)} 
            disabled={loading}
            style={{ padding: '8px 12px', background: '#003366', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Processing...' : 'Submit'}
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