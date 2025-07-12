const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const ItemDefinition = require('../models/ItemDefinition');

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendors' });
  }
});

// Create new vendor
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newVendor = new Vendor({
      ...data,
      delivers: (data.delivery_dows && data.delivery_dows.length > 0)
    });
    await newVendor.save();
    res.json(newVendor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create vendor' });
  }
});

// Delete a vendor
router.delete('/:id', async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete vendor' });
  }
});

// Recount number of items per vendor
router.get('/recount', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    const updates = await Promise.all(
      vendors.map(async vendor => {
        const count = await ItemDefinition.countDocuments({ mainVendor: vendor.name });
        vendor.numberOfItems = count;
        await vendor.save();
        return vendor;
      })
    );
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Error recounting vendor items' });
  }
});

// Edit a vendor
router.put('/:id', async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        delivers: req.body.delivery_dows?.length > 0
      },
      { new: true }
    );
    res.json(updatedVendor);
  } catch (err) {
    console.error('Error updating vendor:', err);
    res.status(500).json({ message: 'Failed to update vendor' });
  }
});

module.exports = router;
