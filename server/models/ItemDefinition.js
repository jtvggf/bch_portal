const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // Local classification
  category: { type: String }, // e.g. "Meat", "Dairy", "Condiment", etc.
  usedInFood: { type: Boolean, default: false },
  usedInBeverage: { type: Boolean, default: false },
  minimum: { type: Number, default: 0 },
  current: { type: Number, default: 0 },
  maximum: { type: Number, default: 0 },
  container: { type: String },
  measurement: { type: String, enum: ['case', 'pack', 'unit'], default: 'unit' },

  // Vendor association
  mainVendor: { type: String },
  vendorId: {
    type: Map,
    of: String,
    default: {} // e.g. { Sysco: '123', CBI: '456' }
  },

  splitable: { type: Boolean, default: false },
  packsPerCase: { type: Number, default: 1 },
  unitsPerPack: { type: Number, default: 1 },
  pricePerCase: { type: Number, default: 0 },
});

itemDefinitionSchema.virtual('pricePerPack').get(function () {
  const ppc = parseFloat(this.pricePerCase);
  const ppcase = parseFloat(this.packsPerCase);
  return ppc && ppcase ? (ppc / ppcase).toFixed(2) : null;
});

itemDefinitionSchema.virtual('pricePerUnit').get(function () {
  const ppc = parseFloat(this.pricePerCase);
  const ppcase = parseFloat(this.packsPerCase);
  const upp = parseFloat(this.unitsPerPack);
  return ppc && ppcase && upp ? (ppc / ppcase / upp).toFixed(2) : null;
});

itemDefinitionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ItemDefinition', itemDefinitionSchema);
