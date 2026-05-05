const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  famille: {
    type: String,
    enum: ['Oriental', 'Floral', 'Boisé', 'Ambré', 'Frais', 'Épicé', 'Musqué'],
    required: true
  },
  notes: {
    tete: [String],
    coeur: [String],
    fond: [String]
  },
  variants: [{
    size: { type: Number, required: true }, // en ml
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sku: String
  }],
  images: [String],
  badge: { type: String, enum: ['Bestseller', 'Nouveau', 'Exclusif', 'Édition limitée', null] },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a').replace(/[éèêë]/g, 'e')
      .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
