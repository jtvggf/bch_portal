const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const ItemDefinition = require('../models/ItemDefinition');

// GET items by containerId or groupId
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.containerId) filter.containerId = req.query.containerId;
    if (req.query.groupId) filter.groupId = req.query.groupId;
    const items = await Item.find(filter).sort({ sortOrder: 1 }).populate('itemId');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new item instance (syncs with master list)
router.post('/', async (req, res) => {
  try {
    const { name, inputType, containerId, groupId } = req.body;

    // Find or create ItemDefinition
    let masterItem = await ItemDefinition.findOne({ name });
    if (!masterItem) {
      masterItem = new ItemDefinition({ name, inputType });
      await masterItem.save();
    }

    // Create item instance
    const instance = new Item({
      itemId: masterItem._id,
      containerId,
      groupId
    });

    const saved = await instance.save();
    const populated = await saved.populate('itemId');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update item instance
router.put('/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const populated = await updated.populate('itemId');
    res.json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE item instance
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
