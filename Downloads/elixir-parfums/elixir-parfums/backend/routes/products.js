const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/products - liste publique
router.get('/', async (req, res) => {
  try {
    const { famille, featured, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (famille) filter.famille = famille;
    if (featured) filter.isFeatured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit).limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - Admin seulement
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id - Admin seulement
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id - Admin seulement
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Produit désactivé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
