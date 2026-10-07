require('dotenv').config();
const client = require('smartsheet');

const smartsheet = client.createClient({
  accessToken: process.env.SMARTSHEET_ACCESS_TOKEN,
});

async function getColumnIds() {
  try {
    const sheetId = process.env.SMARTSHEET_SHEET_ID;
    const sheet = await smartsheet.sheets.getSheet({ id: sheetId });

    console.log(`\n--- COLUMNS FOR SHEET: "${sheet.name}" ---`);
    sheet.columns.forEach((col) => {
      console.log(`Name: "${col.title}"  --->  ID: ${col.id}`);
    });
    console.log('-------------------------------------------\n');
  } catch (error) {
    console.error('Error fetching columns:', error.message);
  }
}

getColumnIds();