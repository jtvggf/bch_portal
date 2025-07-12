const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  employeeRole: {
    type: [String],
    enum: ['cook', 'server', 'shift lead'],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
