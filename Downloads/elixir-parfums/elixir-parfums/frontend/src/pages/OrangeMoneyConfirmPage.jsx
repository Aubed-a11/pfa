import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const gold = '#C9A96E';
const orange = '#FF6900';
const OM_MERCHANT_NUMBER = '+221 77 376 96 21';

export default function OrangeMoneyConfirmPage() {
  const [params] = useSearchParams();
  const amount = params.get('amount');
  const orderId = params.get('orderId');

  return (
    <div style={{ background: '#0E0E0E', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* Icône */}
        <div style={{ fontSize: 64, marginBottom: 24 }}>🟠</div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, color: orange, marginBottom: 12 }}>
          Finalisez votre paiement
        </h1>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 40, lineHeight: 1.7 }}>
          Votre commande a été enregistrée. Elle sera confirmée dès réception du virement Orange Money.
        </p>

        {/* Instructions */}
        <div style={{ background: 'rgba(255,105,0,0.06)', border: '1px solid rgba(255,105,0,0.25)', borderRadius: 4, padding: '2rem', marginBottom: 32, textAlign: 'left' }}>
          <p style={{ fontSize: 10, letterSpacing: 2, color: orange, textTransform: 'uppercase', marginBottom: 20 }}>
            Instructions de paiement
          </p>

          {[
            { step: '1', text: 'Ouvrez votre application Orange Money ou composez #144#' },
            { step: '2', text: `Envoyez ${amount ? `${amount} FCFA` : 'le montant total'} au numéro marchand` },
            { step: '3', text: 'Utilisez votre numéro de commande comme référence' },
            { step: '4', text: 'Votre commande sera confirmée sous 24h' },
          ].map(({ step, text }) => (
            <div key={step} style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {step}
              </div>
              <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6, paddingTop: 4 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Numéro marchand */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 4, padding: '1.5rem', marginBottom: 16 }}>
          <p style={{ fontSize: 10, letterSpacing: 2, color: '#444', textTransform: 'uppercase', marginBottom: 8 }}>
            Numéro Orange Money marchand
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#fff', letterSpacing: 3, marginBottom: 4 }}>
            {OM_MERCHANT_NUMBER}
          </p>
          {amount && (
            <p style={{ fontSize: 13, color: orange, fontWeight: 600 }}>Montant : {amount} FCFA</p>
          )}
        </div>

        {orderId && (
          <p style={{ fontSize: 11, color: '#444', marginBottom: 32 }}>
            Référence commande : <span style={{ color: '#666' }}>{orderId.slice(-8).toUpperCase()}</span>
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/mes-commandes" style={{
            background: 'transparent', border: `1px solid ${gold}`, color: gold,
            padding: '14px 28px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            textDecoration: 'none', display: 'inline-block'
          }}>
            Mes commandes
          </Link>
          <Link to="/" style={{
            background: gold, color: '#000', border: 'none',
            padding: '14px 28px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            textDecoration: 'none', display: 'inline-block'
          }}>
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
}
