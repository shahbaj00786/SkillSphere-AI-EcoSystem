import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import '../styles/payment.css';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [payData, setPayData] = useState(null);
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole') || 'freelancer';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const gigId = searchParams.get('gigId');
    const proposalId = searchParams.get('proposalId');
    const freelancerId = searchParams.get('freelancerId');
    const amount = searchParams.get('amount');
    if (gigId) setPayData({ gigId, proposalId, freelancerId, amount });
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
      await axios.post(`${import.meta.env.VITE_API_URL}/payments`, { ...payData, paymentMethod }, { headers });
      setToast('✅ Payment initiated successfully!');
      setPayData(null);
      fetchPayments();
    } catch {
      setToast('❌ Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const getStatusClass = (status) => {
    const map = { pending: 'pending', completed: 'completed', refunded: 'refunded', escrow: 'escrow' };
    return map[status] || 'pending';
  };

  return (
    <div className="payments-page">
      <Navbar />
      {toast && <div className="toast">{toast}</div>}

      <div className="payments-container">
        <div className="payments-header">
          <h1>Payments & Transactions</h1>
          <p>Track your earnings and payment history</p>
        </div>

        {/* Freelancer stats */}
        {userRole === 'freelancer' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Earnings</p>
              <p className="stat-value green">${stats.totalEarnings?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Completed Payments</p>
              <p className="stat-value indigo">{stats.completedPayments || 0}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Pending Amount</p>
              <p className="stat-value amber">${stats.pendingAmount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        )}

        {/* Auto-filled payment confirm box */}
        {payData && (
          <div className="payment-confirm-box">
            <h3>💳 Confirm Payment</h3>
            <div className="payment-confirm-details">
              <div className="payment-confirm-row">
                <span>Gig ID</span>
                <span>{payData.gigId?.substring(0, 12)}...</span>
              </div>
              <div className="payment-confirm-row">
                <span>Freelancer</span>
                <span>{payData.freelancerId?.substring(0, 12)}...</span>
              </div>
              <div className="payment-confirm-row total">
                <span>Amount</span>
                <span>${payData.amount}</span>
              </div>
            </div>
            <div className="payment-method-select">
              <label>Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="stripe">Stripe</option>
                <option value="razorpay">Razorpay</option>
              </select>
            </div>
            <form onSubmit={submitPayment}>
              <button type="submit" className="btn-pay-confirm" disabled={submitting}>
                {submitting ? 'Processing...' : `Pay $${payData.amount} Now`}
              </button>
            </form>
          </div>
        )}

        {/* Transaction history */}
        <div className="transactions-card">
          <h3>Transaction History</h3>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>Loading...</p>
          ) : payments.length === 0 ? (
            <div className="empty-transactions">
              <div className="empty-icon">💳</div>
              <p>No transactions found</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p._id}>
                      <td className="tx-id">{p._id.substring(0, 8)}...</td>
                      <td className="tx-amount">${p.amount?.toFixed(2)}</td>
                      <td><span className={`tx-status ${getStatusClass(p.status)}`}>{p.status}</span></td>
                      <td>{p.paymentMethod}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td><button className="btn-view">View</button></td>
                    </tr>
                  ))}
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