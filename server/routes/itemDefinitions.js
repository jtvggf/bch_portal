const express = require('express');
const router = express.Router();
const ItemDefinition = require('../models/ItemDefinition');

// GET all items
router.get('/', async (req, res) => {
  const items = await ItemDefinition.find();
  res.json(items);
});

// POST new item
router.post('/', async (req, res) => {
  try {
    const newItem = new ItemDefinition(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Failed to create item:', err);
    res.status(400).json({ message: 'Invalid item data' });
  }
});

// PUT update item
router.put('/:id', async (req, res) => {
  try {
    const updated = await ItemDefinition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Failed to update item:', err);
    res.status(400).json({ message: 'Update failed' });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    await ItemDefinition.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error('Failed to delete item:', err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
