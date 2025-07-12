const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  address: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },

  repName: { type: String, default: '' },
  repPhone: { type: String, default: '' },
  repEmail: { type: String, default: '' },

  numberOfItems: { type: Number, default: 0 },
  delivers: { type: Boolean, default: true },

  order_dows: { type: [String], default: [] },     // e.g., ['Monday', 'Wednesday']
  delivery_dows: { type: [String], default: [] },  // e.g., ['Tuesday', 'Friday']
  cut_off: { type: String, default: '' }           // e.g., '2:00 PM'
});

module.exports = mongoose.model('Vendor', vendorSchema);
