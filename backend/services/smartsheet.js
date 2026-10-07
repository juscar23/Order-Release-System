const client = require('smartsheet');

const smartsheet = client.createClient({
  accessToken: process.env.SMARTSHEET_ACCESS_TOKEN,
});

const SHEET_ID = process.env.SMARTSHEET_SHEET_ID;

const COLUMN_IDS = {
  Status: 8580425389477764,
  JO_Number: 8361720571268996,
  Customer_Name: 1043371176791940,
  Start_Time: 5546970804162436,
  End_Time: 3295170990477188,
  QR_Number: 4076825762107268
};

async function testConnection() {
  try {
    const sheet = await smartsheet.sheets.getSheet({ id: SHEET_ID });
    console.log(`✅ Connected to sheet: "${sheet.name}"`);
    return true;
  } catch (error) {
    console.error(`❌ Connection error:`, error.message);
    return false;
  }
}

async function addReleaseRecord({ joNumber, customerName, qrNumber }) {
  try {
    const startTime = new Date().toISOString();
    const rowData = {
      toBottom: true,
      cells: [
        { columnId: COLUMN_IDS.Status, value: 'RELEASING' },
        { columnId: COLUMN_IDS.JO_Number, value: String(joNumber) },
        { columnId: COLUMN_IDS.Customer_Name, value: String(customerName) },
        { columnId: COLUMN_IDS.Start_Time, value: startTime },
        { columnId: COLUMN_IDS.QR_Number, value: String(qrNumber) }
      ]
    };

    const result = await smartsheet.sheets.addRows({
      sheetId: SHEET_ID,
      body: [rowData]
    });
    console.log('✅ Added row to Smartsheet!');
    return result;
  } catch (error) {
    console.error('❌ Error adding row to Smartsheet:', error.message || error);
    throw error;
  }
}

async function getReleaseRecords() {
  try {
    const sheet = await smartsheet.sheets.getSheet({ id: SHEET_ID });
    if (!sheet.rows) return [];

    return sheet.rows.map((row) => {
      const rowData = { rowId: row.id };
      row.cells.forEach((cell) => {
        const colId = Number(cell.columnId);
        if (colId === COLUMN_IDS.Status) rowData.status = cell.value;
        if (colId === COLUMN_IDS.JO_Number) rowData.joNumber = cell.value;
        if (colId === COLUMN_IDS.Customer_Name) rowData.customerName = cell.value;
        if (colId === COLUMN_IDS.Start_Time) rowData.startTime = cell.value;
        if (colId === COLUMN_IDS.End_Time) rowData.endTime = cell.value;
        if (colId === COLUMN_IDS.QR_Number) rowData.qrNumber = cell.value;
      });
      return rowData;
    });
  } catch (error) {
    console.error('❌ Error fetching rows from Smartsheet:', error.message || error);
    return [];
  }
}

async function updateReleaseComplete({ qrNumber }) {
  try {
    const records = await getReleaseRecords();
    const targetRow = records.find((r) => r.qrNumber === qrNumber || r.joNumber === qrNumber);

    if (!targetRow) throw new Error('Order not found in Smartsheet');

    const endTime = new Date().toISOString();
    const rowData = {
      id: targetRow.rowId,
      cells: [
        { columnId: COLUMN_IDS.Status, value: 'COMPLETED' },
        { columnId: COLUMN_IDS.End_Time, value: endTime }
      ]
    };

    const result = await smartsheet.sheets.updateRow({
      sheetId: SHEET_ID,
      body: rowData
    });
    console.log('✅ Updated row to COMPLETED in Smartsheet!');
    return result;
  } catch (error) {
    console.error('❌ Error updating row in Smartsheet:', error.message || error);
    throw error;
  }
}

module.exports = {
  smartsheet,
  SHEET_ID,
  testConnection,
  addReleaseRecord,
  getReleaseRecords,
  updateReleaseComplete
};