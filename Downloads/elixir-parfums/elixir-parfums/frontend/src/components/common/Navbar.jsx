import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const S = {
  nav: { background: '#0E0E0E', borderBottom: '1px solid #1f1f1f', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 300, letterSpacing: 4, color: '#C9A96E', textDecoration: 'none', textTransform: 'uppercase' },
  link: { color: '#888', textDecoration: 'none', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', transition: 'color .2s' },
  btn:  { background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' },
  cart: { background: '#C9A96E', border: 'none', color: '#000', padding: '8px 20px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' },
};

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav style={S.nav}>
      <Link to="/" style={S.logo}>Élixir</Link>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/" style={S.link}>Collections</Link>
        {isAdmin && <Link to="/admin" style={{ ...S.link, color: '#C9A96E' }}>Admin</Link>}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/mes-commandes" style={S.link}>{user.name}</Link>
            <button style={S.btn} onClick={() => { logout(); navigate('/'); }}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login"><button style={S.btn}>Connexion</button></Link>
        )}
        <Link to="/panier">
          <button style={S.cart}>Panier {itemCount > 0 && `(${itemCount})`}</button>
        </Link>
      </div>
    </nav>
  );
}
