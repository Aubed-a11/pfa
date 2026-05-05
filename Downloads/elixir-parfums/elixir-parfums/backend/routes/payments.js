const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST /api/payments/create-intent - Créer un PaymentIntent Stripe
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'mad', orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe en centimes
      currency,
      metadata: { orderId: orderId?.toString(), userId: req.user._id.toString() },
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/webhook - Webhook Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'paymentInfo.status': 'paid',
        'paymentInfo.paidAt': new Date(),
        'paymentInfo.stripePaymentIntentId': paymentIntent.id,
        status: 'confirmed'
      });
    }
  }

  res.json({ received: true });
});

// POST /api/payments/orange-money - Initier un paiement Orange Money
router.post('/orange-money', protect, async (req, res) => {
  try {
    const { orderId, amount, phone } = req.body;

    if (!orderId || !amount || !phone) {
      return res.status(400).json({ message: 'orderId, amount et phone sont requis' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: req.user._id },
      {
        'paymentInfo.method': 'orange_money',
        'paymentInfo.status': 'pending',
        'paymentInfo.omPhone': phone
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Commande introuvable' });

    const merchantNumber = process.env.ORANGE_MONEY_NUMBER || '+221773769621';

    res.json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
      amount,
      merchantNumber,
      message: `Envoyez ${amount} FCFA au ${merchantNumber} via Orange Money`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/history - Historique paiements de l'utilisateur
router.get('/history', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      'paymentInfo.status': 'paid'
    }).select('orderNumber total paymentInfo.paidAt status').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
