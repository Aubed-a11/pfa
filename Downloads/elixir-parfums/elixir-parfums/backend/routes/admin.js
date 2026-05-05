const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Toutes les routes admin nécessitent authentification + rôle admin
router.use(protect, adminOnly);

// GET /api/admin/stats - Statistiques générales
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalRevenue, monthRevenue, lastMonthRevenue, totalOrders, monthOrders, totalClients, monthClients] = await Promise.all([
      Order.aggregate([{ $match: { 'paymentInfo.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { 'paymentInfo.status': 'paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { 'paymentInfo.status': 'paid', createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ role: 'client' }),
      User.countDocuments({ role: 'client', createdAt: { $gte: startOfMonth } })
    ]);

    const thisMonth = monthRevenue[0]?.total || 0;
    const lastMonth = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth * 100).toFixed(1) : 0;

    // Ventes des 7 derniers jours
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const dailySales = await Order.aggregate([
      { $match: { 'paymentInfo.status': 'paid', createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      revenue: { total: totalRevenue[0]?.total || 0, thisMonth, lastMonth, growth: revenueGrowth },
      orders: { total: totalOrders, thisMonth: monthOrders },
      clients: { total: totalClients, thisMonth: monthClients },
      averageOrder: totalOrders > 0 ? Math.round((totalRevenue[0]?.total || 0) / totalOrders) : 0,
      dailySales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders - Toutes les commandes
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email').sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    const total = await Order.countDocuments(filter);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/clients - Liste des clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .select('-password').sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/products/low-stock - Produits en rupture
router.get('/products/low-stock', async (req, res) => {
  try {
    const products = await Product.find({ 'variants.stock': { $lt: 5 }, isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
