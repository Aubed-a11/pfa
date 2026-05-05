import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const gold = '#C9A96E';
const STATUS = { pending: 'En attente', confirmed: 'Confirmé', processing: 'En préparation', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' };
const STATUS_COLOR = { pending: '#FFC107', confirmed: '#4CAF50', processing: '#2196F3', shipped: '#9C27B0', delivered: '#4CAF50', cancelled: '#f44336' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    api.get('/api/admin/orders', { params: { status: statusFilter || undefined } })
      .then(res => setOrders(res.data.orders));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      toast.success('Statut mis à jour');
      load();
    } catch { toast.error('Erreur'); }
  };

  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff', padding: '2.5rem' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, color: gold, marginBottom: 28 }}>Commandes</h1>

      <div style={{ marginBottom: 24 }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff', padding: '10px 14px', fontSize: 13, outline: 'none' }}>
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #222' }}>
              {['Commande', 'Client', 'Email', 'Montant', 'Paiement', 'Statut', 'Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 9, letterSpacing: 2, color: '#444', textTransform: 'uppercase', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} style={{ borderBottom: '1px solid #141414' }}
                onMouseEnter={e => e.currentTarget.style.background = '#111'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px 12px', fontFamily: 'Georgia, serif' }}>{o.orderNumber}</td>
                <td style={{ padding: '14px 12px', color: '#aaa' }}>{o.user?.name}</td>
                <td style={{ padding: '14px 12px', color: '#555', fontSize: 12 }}>{o.user?.email}</td>
                <td style={{ padding: '14px 12px', color: gold }}>{o.total} MAD</td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{ color: o.paymentInfo?.status === 'paid' ? '#4CAF50' : '#FFC107', fontSize: 11 }}>
                    {o.paymentInfo?.status === 'paid' ? 'Payé' : 'En attente'}
                  </span>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{ color: STATUS_COLOR[o.status], fontSize: 12 }}>{STATUS[o.status]}</span>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                    style={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff', padding: '6px 10px', fontSize: 12, outline: 'none', cursor: 'pointer' }}>
                    {Object.entries(STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p style={{ textAlign: 'center', color: '#333', padding: '3rem', fontSize: 14 }}>Aucune commande.</p>}
      </div>
    </div>
  );
}
