import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_VOTRE_CLE');
const gold = '#C9A96E';
const orange = '#FF6900';
const OM_MERCHANT_NUMBER = '+221 77 376 96 21';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, shippingCost, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [omPhone, setOmPhone] = useState('');
  const [address, setAddress] = useState({ nom: '', rue: '', ville: '', codePostal: '', telephone: '' });

  const grandTotal = total + shippingCost;
  const inp = { background: '#1A1A1A', border: '1px solid #333', color: '#fff', padding: '12px 14px', fontSize: 14, width: '100%', boxSizing: 'border-box', outline: 'none' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderRes = await api.post('/api/orders', {
        items: items.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
        shippingAddress: { ...address, pays: 'Sénégal' }
      });
      const orderId = orderRes.data._id;

      if (paymentMethod === 'stripe') {
        if (!stripe || !elements) return;
        const { data: { clientSecret } } = await api.post('/api/payments/create-intent', {
          amount: grandTotal,
          orderId
        });
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement) }
        });
        if (error) throw new Error(error.message);
        clearCart();
        toast.success('Paiement confirmé ! Merci pour votre commande.');
        navigate('/mes-commandes');
      } else {
        await api.post('/api/payments/orange-money', { orderId, amount: grandTotal, phone: omPhone });
        clearCart();
        navigate(`/paiement-orange-money?orderId=${orderId}&amount=${grandTotal}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 580, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 300, color: gold, marginBottom: 40 }}>
        Finaliser la commande
      </h1>

      {/* Adresse */}
      <h3 style={{ fontSize: 10, letterSpacing: 2, color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>
        Adresse de livraison
      </h3>
      <div style={{ display: 'grid', gap: 12, marginBottom: 36 }}>
        {[['nom','Nom complet'],['rue','Adresse'],['ville','Ville'],['codePostal','Code postal'],['telephone','Téléphone']].map(([k, label]) => (
          <input key={k} placeholder={label} value={address[k]}
            onChange={e => setAddress(p => ({ ...p, [k]: e.target.value }))}
            style={inp} required />
        ))}
      </div>

      {/* Sélection méthode */}
      <h3 style={{ fontSize: 10, letterSpacing: 2, color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>
        Mode de paiement
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {[
          { val: 'stripe',       label: 'Carte bancaire', icon: '💳', color: gold },
          { val: 'orange_money', label: 'Orange Money',   icon: '🟠', color: orange },
        ].map(({ val, label, icon, color }) => (
          <button key={val} type="button" onClick={() => setPaymentMethod(val)} style={{
            padding: '16px 12px',
            border: `1px solid ${paymentMethod === val ? color : '#333'}`,
            background: paymentMethod === val ? `rgba(${val === 'orange_money' ? '255,105,0' : '201,169,110'},0.08)` : 'transparent',
            color: paymentMethod === val ? color : '#555',
            cursor: 'pointer', fontSize: 13, letterSpacing: 1, transition: 'all .2s',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
          }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Stripe */}
      {paymentMethod === 'stripe' && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ background: '#1A1A1A', border: '1px solid #333', padding: '14px 16px', marginBottom: 8 }}>
            <CardElement options={{ style: { base: { fontSize: '15px', color: '#ffffff', fontFamily: 'Georgia, serif', '::placeholder': { color: '#555' } } } }} />
          </div>
          <p style={{ fontSize: 11, color: '#444' }}>Paiement sécurisé via Stripe · SSL 256-bit</p>
        </div>
      )}

      {/* Orange Money */}
      {paymentMethod === 'orange_money' && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ background: 'rgba(255,105,0,0.06)', border: '1px solid rgba(255,105,0,0.25)', borderRadius: 4, padding: '1.5rem', marginBottom: 16 }}>
            <p style={{ fontSize: 10, letterSpacing: 2, color: orange, textTransform: 'uppercase', marginBottom: 10 }}>
              Numéro Orange Money marchand
            </p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#fff', letterSpacing: 2, marginBottom: 6 }}>
              {OM_MERCHANT_NUMBER}
            </p>
            <p style={{ fontSize: 12, color: '#888' }}>
              Envoyez exactement{' '}
              <strong style={{ color: orange }}>{grandTotal} FCFA</strong>{' '}
              à ce numéro, puis validez la commande ci-dessous.
            </p>
          </div>
          <input
            placeholder="Votre numéro Orange Money expéditeur"
            value={omPhone}
            onChange={e => setOmPhone(e.target.value)}
            style={{ ...inp, marginBottom: 8 }}
            required
          />
          <p style={{ fontSize: 11, color: '#444' }}>
            Votre commande sera confirmée après vérification du paiement.
          </p>
        </div>
      )}

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderTop: '1px solid #1a1a1a', marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: 13, color: '#888' }}>Total à payer</span>
          {shippingCost === 0 && <p style={{ fontSize: 11, color: '#4CAF50', marginTop: 2 }}>Livraison offerte</p>}
        </div>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: gold }}>{grandTotal} FCFA</span>
      </div>

      <button type="submit" disabled={loading} style={{
        width: '100%',
        background: loading ? '#333' : paymentMethod === 'orange_money' ? orange : gold,
        color: '#fff',
        border: 'none', padding: 18, fontSize: 11, letterSpacing: 3,
        textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background .2s'
      }}>
        {loading
          ? 'Traitement en cours...'
          : paymentMethod === 'orange_money'
            ? `Valider la commande · ${grandTotal} FCFA`
            : `Payer ${grandTotal} FCFA`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff' }}>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
