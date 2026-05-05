import React, { useState, useEffect } from 'react';
import api from '../services/api';

const gold = '#C9A96E';
const STATUS = { pending: 'En attente', confirmed: 'Confirmé', processing: 'En préparation', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' };
const STATUS_COLOR = { pending: '#FFC107', confirmed: '#4CAF50', processing: '#2196F3', shipped: '#9C27B0', delivered: '#4CAF50', cancelled: '#f44336' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/api/orders/my').then(res => setOrders(res.data));
  }, []);

  if (orders.length === 0) return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#444', fontFamily: 'Georgia, serif', fontSize: 20 }}>Aucune commande pour le moment.</p>
    </div>
  );

  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 300, color: gold, marginBottom: 40 }}>Mes commandes</h1>
        {orders.map(o => (
          <div key={o._id} style={{ background: '#111', border: '1px solid #222', borderRadius: 4, padding: '1.5rem', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>{o.orderNumber}</p>
                <p style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{new Date(o.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: gold, fontSize: 18 }}>{o.total} MAD</p>
                <p style={{ fontSize: 12, marginTop: 4, color: STATUS_COLOR[o.status] }}>{STATUS[o.status]}</p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 12 }}>
              {o.items?.map((item, i) => (
                <p key={i} style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
                  {item.name} · {item.size}ml × {item.quantity}
                </p>
              ))}
            </div>
            {o.trackingNumber && (
              <p style={{ fontSize: 11, color: '#444', marginTop: 12 }}>N° suivi : {o.trackingNumber}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
