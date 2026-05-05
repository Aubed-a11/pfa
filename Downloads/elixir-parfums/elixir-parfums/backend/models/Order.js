const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    size: Number,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  shippingAddress: {
    nom: String,
    rue: String,
    ville: String,
    codePostal: String,
    pays: String,
    telephone: String
  },
  paymentInfo: {
    stripePaymentIntentId: String,
    method: { type: String, enum: ['card', 'orange_money'], default: 'card' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paidAt: Date,
    omPhone: String
  },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ELX-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
