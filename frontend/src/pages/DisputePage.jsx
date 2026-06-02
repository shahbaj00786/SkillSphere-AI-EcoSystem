import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

const DisputePage = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    gigId: '',
    reason: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('accessToken');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gigIdFromUrl = params.get('gigId');
    if (gigIdFromUrl) {
      setFormData((prev) => ({ ...prev, gigId: gigIdFromUrl }));
      setShowForm(true);
    }
  }, [location.search]);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/disputes/my`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDisputes(res.data.data || []);
    } catch (err) {
      console.error('Error fetching disputes:', err);
      setError('Failed to load disputes.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitDispute = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/disputes`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Dispute filed successfully!');
      setShowForm(false);
      setFormData({ gigId: '', reason: '', description: '' });
      fetchDisputes();
    } catch (err) {
      console.error('Error filing dispute:', err);
      setError('Failed to file dispute. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      open:     { background: '#fef3c7', color: '#92400e' },
      resolved: { background: '#d1fae5', color: '#065f46' },
      rejected: { background: '#fee2e2', color: '#991b1b' },
    };
    return map[status] || { background: '#e5e7eb', color: '#374151' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#111827' }}>Disputes</h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280' }}>Manage and track your filed disputes</p>
          </div>

        </div>

        {/* Feedback messages */}
        {message && (
          <p style={{ background: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
            ✅ {message}
          </p>
        )}
        {error && (
          <p style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
            ❌ {error}
          </p>
        )}

        {/* File Dispute Form */}
        {showForm && (
          <div style={{ background: 'white', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '28px' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '20px', color: '#111827' }}>File a New Dispute</h2>
            <form onSubmit={submitDispute}>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                  Gig ID <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="gigId"
                  value={formData.gigId}
                  onChange={handleChange}
                  placeholder="Paste the Gig ID here"
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                  Reason <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: 'white' }}
                >
                  <option value="">Select a reason</option>
                  <option value="non_delivery">Non-delivery of work</option>
                  <option value="quality">Quality not as agreed</option>
                  <option value="payment">Payment issue</option>
                  <option value="communication">Communication breakdown</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                  Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the issue in detail..."
                  rows={5}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? '#a5b4fc' : '#4f46e5',
                  color: 'white',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Dispute'}
              </button>

            </form>
          </div>
        )}

        {/* Disputes List */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Loading disputes...</p>
        ) : disputes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '40px', margin: '0 0 12px' }}>⚖️</p>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>No disputes filed yet.</p>
          </div>
        ) : (
          disputes.map((d) => (
            <div
              key={d._id}
              style={{
                background: 'white',
                padding: '20px 24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                marginBottom: '16px',
                borderLeft: '4px solid #4f46e5',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#111827', fontSize: '15px' }}>
                    Dispute #{d._id.substring(0, 8)}...
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280' }}>
                    Reason: <strong style={{ color: '#374151' }}>{d.reason?.replace(/_/g, ' ') || '—'}</strong>
                    &nbsp;·&nbsp;Filed: {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span style={{
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'capitalize',
                  ...getStatusStyle(d.status),
                }}>
                  {d.status}
                </span>
              </div>

              <p style={{ margin: '4px 0 0', color: '#4b5563', lineHeight: '1.6', fontSize: '14px' }}>
                {d.description}
              </p>

              {d.resolution && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}>
                    <strong>Resolution:</strong> {d.resolution}
                  </p>
                </div>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default DisputePage;