const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// POST /api/orders - Créer une commande
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Vérifier stock et calculer total
    let subtotal = 0;
    const enrichedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Produit ${item.productId} introuvable` });

      const variant = product.variants.find(v => v.size === item.size);
      if (!variant) return res.status(400).json({ message: `Taille ${item.size}ml non disponible` });
      if (variant.stock < item.quantity) return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });

      subtotal += variant.price * item.quantity;
      enrichedItems.push({ product: product._id, name: product.name, size: item.size, quantity: item.quantity, price: variant.price });
    }

    const shippingCost = subtotal >= 1000 ? 0 : 50; // Livraison gratuite > 1000 MAD
    const total = subtotal + shippingCost;

    const order = await Order.create({
      user: req.user._id, items: enrichedItems, shippingAddress,
      subtotal, shippingCost, total
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my - Commandes de l'utilisateur connecté
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status - Admin: mettre à jour le statut
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, { status, ...(trackingNumber && { trackingNumber }) },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
