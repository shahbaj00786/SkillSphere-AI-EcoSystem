import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar.jsx';

const statusStyle = (status) => {
  const map = {
    pending:   { bg: '#fef3c7', color: '#92400e' },
    escrow:    { bg: '#dbeafe', color: '#1e40af' },
    completed: { bg: '#d1fae5', color: '#065f46' },
    refunded:  { bg: '#fee2e2', color: '#991b1b' },
    failed:    { bg: '#fee2e2', color: '#991b1b' },
  };
  return map[status] || { bg: '#f3f4f6', color: '#6b7280' };
};

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [formData, setFormData] = useState({ gigId: '', proposalId: '', freelancerId: '', amount: '', paymentMethod: 'stripe' });

  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole') || 'freelancer';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPayments();
    if (userRole === 'freelancer') fetchStats();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const endpoint = userRole === 'freelancer' ? 'freelancer/payments' : 'client/payments';
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/${endpoint}`, { headers });
      setPayments(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/freelancer/stats`, { headers });
      setStats(res.data.data);
    } catch (e) { console.error(e); }
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/payments`, formData, { headers });
      setToast('Payment initiated successfully!');
      setShowForm(false);
      fetchPayments();
      setFormData({ gigId: '', proposalId: '', freelancerId: '', amount: '', paymentMethod: 'stripe' });
    } catch (err) {
      setToast('Error initiating payment.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', background: '#fff', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      {toast && (
        <div style={{ position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', background: '#1e1e2e', color: 'white', padding: '10px 24px', borderRadius: '8px', zIndex: 9999, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '26px', color: '#111827' }}>Payments & Transactions</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Track your earnings and payment history</p>
          </div>
          {userRole === 'client' && (
            <button onClick={() => setShowForm(!showForm)}
              style={{ background: showForm ? '#6b7280' : '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              {showForm ? 'Cancel' : '+ New Payment'}
            </button>
          )}
        </div>

        {/* Stats — freelancer only */}
        {userRole === 'freelancer' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Total Earnings', value: `$${stats.totalEarnings?.toFixed(2) || '0.00'}`, color: '#10b981' },
              { label: 'Completed Payments', value: stats.completedPayments || 0, color: '#4f46e5' },
              { label: 'Pending Amount', value: `$${stats.pendingAmount?.toFixed(2) || '0.00'}`, color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Payment form — client only */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: '#111827' }}>Initiate Payment</h3>
            <form onSubmit={submitPayment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {[['Gig ID', 'gigId', 'text'], ['Proposal ID', 'proposalId', 'text'], ['Freelancer ID', 'freelancerId', 'text'], ['Amount ($)', 'amount', 'number']].map(([label, name, type]) => (
                  <div key={name}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>{label} *</label>
                    <input style={inputStyle} type={type} name={name} value={formData[name]}
                      onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))} required />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Payment Method</label>
                <select style={inputStyle} name="paymentMethod" value={formData.paymentMethod} onChange={e => setFormData(p => ({ ...p, paymentMethod: e.target.value }))}>
                  <option value="stripe">Stripe</option>
                  <option value="razorpay">Razorpay</option>
                </select>
              </div>
              <button type="submit" disabled={submitting}
                style={{ background: submitting ? '#a5b4fc' : '#4f46e5', color: 'white', border: 'none', padding: '11px 28px', borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '700' }}>
                {submitting ? 'Processing...' : 'Initiate Payment'}
              </button>
            </form>
          </div>
        )}

        {/* Transactions */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '17px', color: '#111827' }}>Transaction History</h3>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>Loading transactions...</p>
          ) : payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '32px', margin: '0 0 10px' }}>💳</p>
              <p style={{ color: '#9ca3af' }}>No transactions found</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                    {['Transaction ID', 'Amount', 'Status', 'Method', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => {
                    const s = statusStyle(p.status);
                    return (
                      <tr key={p._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                        <td style={{ padding: '12px', color: '#6b7280', fontFamily: 'monospace', fontSize: '13px' }}>{p._id.substring(0, 8)}...</td>
                        <td style={{ padding: '12px', fontWeight: '700', color: '#10b981' }}>${p.amount?.toFixed(2)}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', background: s.bg, color: s.color }}>{p.status}</span>
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>{p.paymentMethod}</td>
                        <td style={{ padding: '12px', color: '#6b7280' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>
                          <button style={{ background: '#f3f4f6', border: 'none', color: '#4f46e5', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;