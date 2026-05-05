import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const gold = '#C9A96E';
const FAMILLES = ['Oriental', 'Floral', 'Boisé', 'Ambré', 'Frais', 'Épicé', 'Musqué'];
const BADGES = ['', 'Bestseller', 'Nouveau', 'Exclusif', 'Édition limitée'];

const empty = { name: '', description: '', famille: 'Oriental', badge: '', isFeatured: false, variants: [{ size: 100, price: 0, stock: 0 }] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const inp = { background: '#1A1A1A', border: '1px solid #333', color: '#fff', padding: '10px 12px', fontSize: 13, width: '100%', boxSizing: 'border-box', outline: 'none', marginBottom: 10 };

  const load = () => api.get('/api/products').then(res => setProducts(res.data.products));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, famille: p.famille, badge: p.badge || '', isFeatured: p.isFeatured, variants: p.variants });
    setEditing(p._id);
    setShowForm(true);
  };

  const handleVariantChange = (i, key, val) => {
    const v = [...form.variants];
    v[i] = { ...v[i], [key]: key === 'size' || key === 'price' || key === 'stock' ? Number(val) : val };
    setForm(f => ({ ...f, variants: v }));
  };

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { size: 50, price: 0, stock: 0 }] }));
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/products/${editing}`, form);
        toast.success('Produit modifié');
      } else {
        await api.post('/api/products', form);
        toast.success('Produit créé');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Désactiver ce produit ?')) return;
    await api.delete(`/api/products/${id}`);
    toast.success('Produit désactivé');
    load();
  };

  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff', padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, color: gold }}>Produits</h1>
        <button onClick={openNew} style={{ background: gold, color: '#000', border: 'none', padding: '12px 24px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>
          + Nouveau produit
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '2rem', marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: gold, marginBottom: 20 }}>
            {editing ? 'Modifier le produit' : 'Nouveau produit'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
              <input placeholder="Nom du parfum" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} required />
              <select value={form.famille} onChange={e => setForm(f => ({ ...f, famille: e.target.value }))} style={inp}>
                {FAMILLES.map(f => <option key={f}>{f}</option>)}
              </select>
              <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} style={inp}>
                {BADGES.map(b => <option key={b} value={b}>{b || 'Aucun badge'}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#888' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                Mis en avant
              </label>
            </div>
            <textarea placeholder="Description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ ...inp, height: 80, resize: 'vertical' }} required />

            <p style={{ fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 10 }}>Déclinaisons</p>
            {form.variants.map((v, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, marginBottom: 10 }}>
                <input type="number" placeholder="Taille (ml)" value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)} style={inp} />
                <input type="number" placeholder="Prix (MAD)" value={v.price} onChange={e => handleVariantChange(i, 'price', e.target.value)} style={inp} />
                <input type="number" placeholder="Stock" value={v.stock} onChange={e => handleVariantChange(i, 'stock', e.target.value)} style={inp} />
                {form.variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} style={{ background: 'none', border: '1px solid #333', color: '#f44336', cursor: 'pointer', fontSize: 16, marginBottom: 10 }}>×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addVariant} style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '8px 16px', cursor: 'pointer', fontSize: 12, marginBottom: 20 }}>
              + Ajouter une taille
            </button>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ background: gold, color: '#000', border: 'none', padding: '12px 28px', fontSize: 11, letterSpacing: 2, cursor: 'pointer' }}>
                {editing ? 'Enregistrer' : 'Créer le produit'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '12px 20px', cursor: 'pointer', fontSize: 12 }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #222' }}>
            {['Nom', 'Famille', 'Badge', 'Variantes', 'Actions'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 9, letterSpacing: 2, color: '#444', textTransform: 'uppercase', fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #141414' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '14px 12px', fontFamily: 'Georgia, serif', fontSize: 15 }}>{p.name}</td>
              <td style={{ padding: '14px 12px', color: '#666', fontSize: 11, letterSpacing: 1 }}>{p.famille}</td>
              <td style={{ padding: '14px 12px' }}>
                {p.badge && <span style={{ fontSize: 9, color: gold, border: `1px solid ${gold}`, padding: '2px 8px', letterSpacing: 1 }}>{p.badge}</span>}
              </td>
              <td style={{ padding: '14px 12px', color: '#666' }}>
                {p.variants?.map(v => `${v.size}ml·${v.price}MAD`).join(' / ')}
              </td>
              <td style={{ padding: '14px 12px' }}>
                <button onClick={() => openEdit(p)} style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '6px 14px', cursor: 'pointer', fontSize: 11, marginRight: 8 }}>Modifier</button>
                <button onClick={() => handleDelete(p._id)} style={{ background: 'none', border: '1px solid #333', color: '#f44336', padding: '6px 14px', cursor: 'pointer', fontSize: 11 }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
