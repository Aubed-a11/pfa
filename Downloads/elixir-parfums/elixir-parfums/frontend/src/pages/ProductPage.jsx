import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const gold = '#C9A96E';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/api/products/${id}`).then(res => {
      setProduct(res.data);
      setSelectedSize(res.data.variants?.[0]?.size);
    });
  }, [id]);

  if (!product) return <div style={{ background: '#0E0E0E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>Chargement...</div>;

  const variant = product.variants.find(v => v.size === selectedSize);

  const handleAdd = () => {
    if (!variant) return;
    addItem(product, selectedSize, qty);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        {/* Image */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 4, minHeight: 400 }}>
          <div style={{ width: 100, height: 160, background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 4 }} />
        </div>

        {/* Infos */}
        <div>
          {product.badge && <p style={{ fontSize: 9, letterSpacing: 3, color: gold, textTransform: 'uppercase', marginBottom: 12 }}>{product.badge}</p>}
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 300, marginBottom: 8 }}>{product.name}</h1>
          <p style={{ fontSize: 11, letterSpacing: 2, color: '#555', textTransform: 'uppercase', marginBottom: 24 }}>{product.famille}</p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 32, fontSize: 14 }}>{product.description}</p>

          {/* Notes olfactives */}
          {product.notes && (
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Notes olfactives</p>
              {[['Tête', product.notes.tete], ['Cœur', product.notes.coeur], ['Fond', product.notes.fond]].map(([label, notes]) => notes?.length > 0 && (
                <div key={label} style={{ marginBottom: 8, display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 11, color: '#555', minWidth: 50 }}>{label}</span>
                  <span style={{ fontSize: 13, color: '#aaa' }}>{notes.join(', ')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Sélection taille */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>Contenance</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {product.variants.map(v => (
                <button key={v.size} onClick={() => setSelectedSize(v.size)} style={{
                  background: selectedSize === v.size ? gold : 'transparent',
                  color: selectedSize === v.size ? '#000' : '#888',
                  border: `1px solid ${selectedSize === v.size ? gold : '#333'}`,
                  padding: '10px 18px', cursor: 'pointer', fontSize: 13, transition: 'all .2s'
                }}>
                  {v.size}ml
                </button>
              ))}
            </div>
          </div>

          {/* Prix + ajout */}
          {variant && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 32 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: gold, fontWeight: 300 }}>{variant.price} MAD</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff', width: 36, height: 36, cursor: 'pointer', fontSize: 18 }}>−</button>
                <span style={{ width: 32, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff', width: 36, height: 36, cursor: 'pointer', fontSize: 18 }}>+</button>
              </div>
              <button onClick={handleAdd} style={{ background: gold, color: '#000', border: 'none', padding: '14px 28px', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer' }}>
                Ajouter au panier
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
