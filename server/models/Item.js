const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemInstanceSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'ItemDefinition', required: true },
  containerId: { type: Schema.Types.ObjectId, ref: 'Container', required: true },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  sortOrder: { type: Number, default: 0 }
});

module.exports = mongoose.model('Item', itemInstanceSchema);
