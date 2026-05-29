import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar.jsx';

const DisputePage = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ gigId: '', reason: '', description: '' });
  const token = localStorage.getItem('accessToken');

  useEffect(() => { fetchDisputes(); }, []);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/disputes/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitDispute = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/disputes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Dispute filed successfully!');
      setShowForm(false);
      fetchDisputes();
      setFormData({ gigId: '', reason: '', description: '' });
    } catch (err) {
      alert('Error filing dispute');
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1>My Disputes</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : 'File a Dispute'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={submitDispute} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>File a Dispute</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Gig ID *</label>
              <input type="text" value={formData.gigId} onChange={e => setFormData({ ...formData, gigId: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} required />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Reason *</label>
              <select value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} required>
                <option value="">Select reason</option>
                <option value="non_delivery">Non-delivery</option>
                <option value="quality">Quality Issues</option>
                <option value="payment">Payment Dispute</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Description *</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} required />
            </div>
            <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              Submit Dispute
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading disputes...</p>
        ) : disputes.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No disputes found.</p>
        ) : (
          disputes.map(d => (
            <div key={d._id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0 }}>Dispute #{d._id.substring(0, 8)}</h4>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                  background: d.status === 'resolved' ? '#d1fae5' : d.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                  color: d.status === 'resolved' ? '#065f46' : d.status === 'rejected' ? '#991b1b' : '#92400e' }}>
                  {d.status}
                </span>
              </div>
              <p style={{ color: '#555', margin: '8px 0 0' }}>{d.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisputePage;