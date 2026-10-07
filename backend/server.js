require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { 
    testConnection, 
    addReleaseRecord, 
    getReleaseRecords, 
    updateReleaseComplete 
} = require('./services/smartsheet');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Fetch orders
app.get('/api/orders', async (req, res) => {
    try {
        const records = await getReleaseRecords();
        res.json(records);
    } catch (error) {
        console.error('Error in GET /api/orders:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Generate QR and save to Smartsheet
app.post('/api/generate-qr', async (req, res) => {
    try {
        const { joNumber, customerName, qrNumber } = req.body;
        await addReleaseRecord({ joNumber, customerName, qrNumber });
        res.json({ success: true, message: 'Saved to Smartsheet' });
    } catch (error) {
        console.error('Error in POST /api/generate-qr:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Complete release
app.post('/api/complete-release', async (req, res) => {
    try {
        const { qrNumber } = req.body;
        await updateReleaseComplete({ qrNumber });
        res.json({ success: true, message: 'Release completed' });
    } catch (error) {
        console.error('Error in POST /api/complete-release:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    testConnection();
});