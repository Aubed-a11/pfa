import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const gold = '#C9A96E';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, shippingCost } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#444' }}>Votre panier est vide</p>
      <Link to="/"><button style={{ background: gold, color: '#000', border: 'none', padding: '14px 28px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer' }}>Découvrir nos parfums</button></Link>
    </div>
  );

  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 300, color: gold, marginBottom: 40 }}>Votre Sélection</h1>

        {items.map(item => (
          <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>{item.name}</p>
              <p style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{item.size}ml</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} style={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff', width: 30, height: 30, cursor: 'pointer' }}>−</button>
              <span style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} style={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff', width: 30, height: 30, cursor: 'pointer' }}>+</button>
            </div>
            <div style={{ textAlign: 'right', marginLeft: 24 }}>
              <p style={{ color: gold, fontSize: 16 }}>{item.price * item.quantity} MAD</p>
              <button onClick={() => removeItem(item.productId, item.size)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 12, marginTop: 4 }}>Supprimer</button>
            </div>
          </div>
        ))}

        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#888' }}>
            <span>Sous-total</span><span>{total} MAD</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
            <span>Livraison</span>
            <span>{shippingCost === 0 ? 'Offerte' : `${shippingCost} MAD`}</span>
          </div>
          {shippingCost > 0 && <p style={{ fontSize: 11, color: '#444', marginTop: 6 }}>Livraison offerte dès 1 000 MAD</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', marginBottom: 24 }}>
          <span style={{ fontSize: 14, color: '#888' }}>Total</span>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: gold }}>{total + shippingCost} MAD</span>
        </div>

        <button onClick={() => user ? navigate('/checkout') : navigate('/login')}
          style={{ width: '100%', background: gold, color: '#000', border: 'none', padding: 18, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer' }}>
          {user ? 'Procéder au paiement' : 'Se connecter pour commander'}
        </button>
      </div>
    </div>
  );
}
