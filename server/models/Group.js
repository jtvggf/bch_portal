const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String, required: true },
  containerId: { type: Schema.Types.ObjectId, ref: 'Container', required: true },
  sortOrder: { type: Number, default: 0 }
});

module.exports = mongoose.model('Group', groupSchema);
