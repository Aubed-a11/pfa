import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const gold = '#C9A96E';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/api/admin/stats').then(res => setStats(res.data));
  }, []);

  if (!stats) return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
      Chargement des statistiques...
    </div>
  );

  const metrics = [
    { label: 'Revenu total', value: `${stats.revenue.total.toLocaleString()} MAD` },
    { label: 'Ce mois-ci', value: `${stats.revenue.thisMonth.toLocaleString()} MAD` },
    { label: 'Commandes', value: stats.totalOrders },
    { label: 'Clients', value: stats.totalClients },
    { label: 'Panier moyen', value: `${stats.averageOrder} MAD` },
    { label: 'Nouveaux clients', value: stats.monthClients },
  ];

  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: '#0a0a0a', borderRight: '1px solid #1a1a1a', minHeight: '100vh', padding: '2rem 0' }}>
          <div style={{ padding: '0 1.5rem 2rem' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: gold }}>Élixir</p>
            <p style={{ fontSize: 10, color: '#444', letterSpacing: 2, textTransform: 'uppercase' }}>Administration</p>
          </div>
          {[
            { to: '/admin', label: 'Tableau de bord' },
            { to: '/admin/produits', label: 'Produits' },
            { to: '/admin/commandes', label: 'Commandes' },
            { to: '/', label: '← Boutique' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ display: 'block', padding: '12px 1.5rem', fontSize: 13, color: '#666', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = gold}
              onMouseLeave={e => e.target.style.color = '#666'}>
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, color: gold }}>Tableau de bord</h1>
            <p style={{ fontSize: 12, color: '#444' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Métriques */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
            {metrics.map(m => (
              <div key={m.label} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 4, padding: '1.25rem' }}>
                <p style={{ fontSize: 9, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 10 }}>{m.label}</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: gold, fontWeight: 300 }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Graphique */}
          {stats.dailySales?.length > 0 && (
            <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 4, padding: '1.5rem', marginBottom: 32 }}>
              <p style={{ fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 20 }}>Revenus — 7 derniers jours (MAD)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.dailySales} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="_id" tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#444', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="revenue" fill={gold} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Liens rapides */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { to: '/admin/commandes', label: 'Gérer les commandes', sub: 'Voir et mettre à jour les statuts' },
              { to: '/admin/produits', label: 'Gérer les produits', sub: 'Ajouter, modifier, supprimer' },
            ].map(card => (
              <Link key={card.to} to={card.to} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 4, padding: '1.5rem', cursor: 'pointer', transition: 'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = gold}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1f1f1f'}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff', marginBottom: 8 }}>{card.label}</p>
                  <p style={{ fontSize: 12, color: '#555' }}>{card.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
