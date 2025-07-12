const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const containerSchema = new Schema({
  name: { type: String, required: true },
  areaId: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  lastStockTake: { type: Date, default: Date.now },
  sortOrder: { type: Number, default: 0 }
});

module.exports = mongoose.model('Container', containerSchema);
