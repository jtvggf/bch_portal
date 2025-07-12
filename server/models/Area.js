const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
  name: { type: String, required: true },
  sortOrder: { type: Number, default: 0 }
});

module.exports = mongoose.model('Area', areaSchema);
