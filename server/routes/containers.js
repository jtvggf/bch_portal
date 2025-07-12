const express = require('express');
const router = express.Router();
const Container = require('../models/Container');

router.get('/', async (req, res) => {
  try {
    const filter = req.query.areaId ? { areaId: req.query.areaId } : {};
    const containers = await Container.find(filter).sort({ sortOrder: 1 });
    res.json(containers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Other routes unchanged...
router.post('/', async (req, res) => {
  try {
    const container = new Container(req.body);
    const saved = await container.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Container.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Container.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
