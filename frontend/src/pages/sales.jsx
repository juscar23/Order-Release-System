import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Sales() {
  const [joNumber, setJoNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const uniqueQR = `QR-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = { joNumber, customerName, qrNumber: uniqueQR };

    try {
      // 1. Send data to Node backend (Port 5000)
      const res = await fetch('http://localhost:5000/api/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save order');
      }

      // 2. Render QR code upon successful save
      setQrData(JSON.stringify(payload));
    } catch (err) {
      alert('Error saving to Smartsheet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#003366', textAlign: 'center' }}>Sales: Generate QR</h2>

      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Enter JO Number (e.g., JO-2026-001)"
          value={joNumber}
          onChange={(e) => setJoNumber(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="Enter Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            background: loading ? '#888' : '#0055A5',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Saving to Smartsheet...' : 'Generate QR Code'}
        </button>
      </form>

      {qrData && (
        <div className="print-area" style={{ marginTop: '30px', padding: '20px', border: '2px dashed #ccc', textAlign: 'center' }}>
          <QRCodeSVG value={qrData} size={150} />
          <h3 style={{ margin: '10px 0 5px 0' }}>{joNumber}</h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#555' }}>{customerName}</p>
          <button onClick={() => window.print()} style={{ padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            🖨️ Print Receipt
          </button>
        </div>
      )}
    </div>
  );
}