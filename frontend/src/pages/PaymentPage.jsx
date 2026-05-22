import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/payment.css';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('freelancer');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    gigId: '',
    proposalId: '',
    freelancerId: '',
    amount: '',
    paymentMethod: 'stripe',
    milestones: [],
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'freelancer';
    setUserRole(role);
    fetchPayments(role);
    if (role === 'freelancer') {
      fetchStats();
    }
  }, []);

  const fetchPayments = async (role) => {
    setLoading(true);
    try {
      const endpoint =
        role === 'freelancer' ? 'freelancer/payments' : 'client/payments';
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments/${endpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayments(response.data.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments/freelancer/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Payment initiated successfully!');
      setShowPaymentForm(false);
      fetchPayments(userRole);
      setFormData({
        gigId: '',
        proposalId: '',
        freelancerId: '',
        amount: '',
        paymentMethod: 'stripe',
        milestones: [],
      });
    } catch (error) {
      alert('Error initiating payment');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      escrow: '#4169E1',
      completed: '#228B22',
      refunded: '#DC143C',
      failed: '#FF0000',
    };
    return colors[status] || '#808080';
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Payments & Transactions</h1>
        {userRole === 'client' && (
          <button
            className="btn-new-payment"
            onClick={() => setShowPaymentForm(!showPaymentForm)}
          >
            {showPaymentForm ? 'Cancel' : 'New Payment'}
          </button>
        )}
      </div>

      {userRole === 'freelancer' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <p className="stat-value">${stats.totalEarnings?.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Payments</h3>
            <p className="stat-value">{stats.completedPayments}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Amount</h3>
            <p className="stat-value">${stats.pendingAmount?.toFixed(2)}</p>
          </div>
        </div>
      )}

      {showPaymentForm && (
        <form className="payment-form" onSubmit={submitPayment}>
          <h2>Initiate Payment</h2>
          <div className="form-group">
            <label>Gig ID *</label>
            <input
              type="text"
              name="gigId"
              value={formData.gigId}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Proposal ID *</label>
            <input
              type="text"
              name="proposalId"
              value={formData.proposalId}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Freelancer ID *</label>
            <input
              type="text"
              name="freelancerId"
              value={formData.freelancerId}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleFormChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method *</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleFormChange}>
              <option value="stripe">Stripe</option>
              <option value="razorpay">Razorpay</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">
            Initiate Payment
          </button>
        </form>
      )}

      <div className="transactions-section">
        <h2>Transaction History</h2>
        {loading ? (
          <p className="loading">Loading transactions...</p>
        ) : payments.length === 0 ? (
          <p className="no-transactions">No transactions found</p>
        ) : (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment._id.substring(0, 8)}...</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(payment.status) }}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.paymentMethod}</td>
                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-view">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;