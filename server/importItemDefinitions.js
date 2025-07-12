const mongoose = require('mongoose');
const XLSX = require('xlsx');
require('dotenv').config();
const ItemDefinition = require('./models/ItemDefinition');

async function importSpreadsheet(filePath) {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB:', mongoose.connection.name);

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    const name = row.Item?.trim();
    if (!name) continue;

    const query = { name };
    const update = {
      name,
      category: row.Category || '',
      container: row['Equipment Name'] || '',
      minimum: parseFloat(row['Min.']) || 0,
      current: parseFloat(row['Curr']) || 0,
      maximum: parseFloat(row['Max (Case)']) || 0,
      mainVendor: '', // Can fill this later if needed
      vendorId: {},
      splitable: row.Splitable === 'Y',
      packsPerCase: parseFloat(row['PPC (Packs Per Case)']) || 0,
      unitsPerPack: parseFloat(row['Units Per Pack']) || 0,
      pricePerCase: parseFloat(row['Price per Case']) || 0,
      usedInFood: row.Food === 'Y',
      usedInBeverage: row.Bev === 'Y',
      measurement: row.Measurement || 'unit'
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await ItemDefinition.findOneAndUpdate(query, update, options);
    console.log(`✔ Imported: ${name}`);
  }

  await mongoose.disconnect();
  console.log('✅ Import complete');
}

// Usage: node importItemDefinitions.js ./Inventory.xlsx
const args = process.argv.slice(2);
if (!args[0]) {
  console.error('❌ Please provide the path to an .xlsx file.');
  process.exit(1);
}
importSpreadsheet(args[0]);
