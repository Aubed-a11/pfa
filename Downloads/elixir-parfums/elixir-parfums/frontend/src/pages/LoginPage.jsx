import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const gold = '#C9A96E';

export default function LoginPage() {
  const [mode, setMode]     = useState('login'); // 'login' | 'register'
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const inp = { background: '#1A1A1A', border: '1px solid #333', color: '#fff', padding: '12px 16px', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none', marginBottom: 12 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        toast.success(`Bienvenue ${user.name} !`);
        navigate(user.role === 'admin' ? '/admin' : '/');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Compte créé avec succès !');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <div style={{ width: 400, padding: '0 1.5rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, color: gold, marginBottom: 8, textAlign: 'center' }}>Élixir</h1>
        <p style={{ fontSize: 11, letterSpacing: 2, color: '#555', textAlign: 'center', textTransform: 'uppercase', marginBottom: 40 }}>
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input placeholder="Nom complet" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inp} required />
          )}
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inp} required />
          <input type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={inp} required />

          <button type="submit" disabled={loading} style={{ width: '100%', background: gold, color: '#000', border: 'none', padding: 16, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', cursor: 'pointer', marginTop: 8 }}>
            {loading ? '...' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#555' }}>
          {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
          <button onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: gold, cursor: 'pointer', fontSize: 13 }}>
            {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  );
}
