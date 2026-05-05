import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const gold = '#C9A96E';
const dark = '#0E0E0E';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [famille, setFamille]   = useState('');
  const [search, setSearch]     = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    api.get('/api/products', { params: { famille: famille || undefined, search: search || undefined } })
      .then(res => setProducts(res.data.products))
      .catch(() => toast.error('Erreur de chargement'));
  }, [famille, search]);

  const familles = ['', 'Oriental', 'Floral', 'Boisé', 'Ambré', 'Frais', 'Épicé', 'Musqué'];

  return (
    <div style={{ background: dark, minHeight: '100vh', color: '#fff' }}>
      {/* Hero */}
      <section style={{ padding: '80px 2rem 60px', textAlign: 'center', borderBottom: '1px solid #1a1a1a' }}>
        <p style={{ fontSize: 10, letterSpacing: 4, color: gold, textTransform: 'uppercase', marginBottom: 16 }}>Maison de Parfum · Depuis 1923</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 300, marginBottom: 20, lineHeight: 1.1 }}>
          L'Art de la <em style={{ color: gold }}>Séduction</em> Olfactive
        </h1>
        <p style={{ color: '#888', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7, fontSize: 14 }}>
          Des fragrances rares, créées par les plus grands maîtres parfumeurs du monde.
        </p>
      </section>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 10, padding: '2rem 2rem 1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Rechercher un parfum..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff', padding: '10px 16px', fontSize: 13, flex: 1, minWidth: 200, outline: 'none' }}
        />
        {familles.map(f => (
          <button key={f} onClick={() => setFamille(f)} style={{
            background: famille === f ? gold : 'transparent',
            color: famille === f ? '#000' : '#777',
            border: `1px solid ${famille === f ? gold : '#333'}`,
            padding: '9px 16px', cursor: 'pointer', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', transition: 'all .2s'
          }}>
            {f || 'Tout'}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, background: '#1a1a1a', padding: 1, margin: '1rem 2rem' }}>
        {products.map(p => {
          const firstVariant = p.variants?.[0];
          return (
            <div key={p._id} style={{ background: dark, padding: '2rem 1.5rem', position: 'relative', transition: 'background .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#111'}
              onMouseLeave={e => e.currentTarget.style.background = dark}>
              {p.badge && <p style={{ fontSize: 9, letterSpacing: 2, color: gold, textTransform: 'uppercase', marginBottom: 12 }}>{p.badge}</p>}
              <Link to={`/produit/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 64, height: 90, margin: '0 auto 20px', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 4 }} />
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, marginBottom: 6 }}>{p.name}</h3>
                <p style={{ fontSize: 10, letterSpacing: 2, color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>{p.famille}</p>
              </Link>
              {firstVariant && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: gold, fontSize: 17 }}>{firstVariant.price} MAD</span>
                    <span style={{ fontSize: 10, color: '#444', marginLeft: 6 }}>{firstVariant.size}ml</span>
                  </div>
                  <button onClick={() => { addItem(p, firstVariant.size); toast.success(`${p.name} ajouté`); }}
                    style={{ background: gold, color: '#000', border: 'none', padding: '8px 14px', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>
                    Ajouter
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#444', padding: '4rem', fontSize: 14 }}>Aucun parfum trouvé.</p>
      )}
    </div>
  );
}
