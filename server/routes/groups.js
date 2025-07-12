const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Get groups (optional containerId filter)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.containerId ? { containerId: req.query.containerId } : {};
    const groups = await Group.find(filter).sort({ sortOrder: 1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create group
router.post('/', async (req, res) => {
  try {
    const group = new Group(req.body);
    const saved = await group.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update group
router.put('/:id', async (req, res) => {
  try {
    const updated = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete group
router.delete('/:id', async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
