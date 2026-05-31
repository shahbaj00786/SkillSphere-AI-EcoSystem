import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar.jsx';

const Stars = ({ value }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1,2,3,4,5].map(s => (
      <span key={s} style={{ color: s <= value ? '#f59e0b' : '#d1d5db', fontSize: '16px' }}>★</span>
    ))}
  </div>
);

const ReviewsPage = () => {
  const freelancerId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${token}` };

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [formData, setFormData] = useState({
    gigId: '', rating: 5, comment: '',
    categories: { communication: 5, quality: 5, timeliness: 5, professionalism: 5 },
  });

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/freelancer/${freelancerId}`, { headers });
      setReviews(res.data.data?.reviews || []);
      setRating(res.data.data?.rating || null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('cat_')) {
      const cat = name.replace('cat_', '');
      setFormData(p => ({ ...p, categories: { ...p.categories, [cat]: Number(value) } }));
    } else {
      setFormData(p => ({ ...p, [name]: name === 'rating' ? Number(value) : value }));
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, { ...formData, freelancerId }, { headers });
      setToast('Review submitted!');
      setShowForm(false);
      fetchReviews();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast('Error submitting review.');
      setTimeout(() => setToast(''), 3000);
    } finally { setSubmitting(false); }
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
    backgroundColor: '#fff', color: '#111827',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      {toast && (
        <div style={{ position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', background: '#1e1e2e', color: 'white', padding: '10px 24px', borderRadius: '8px', zIndex: 9999, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: '860px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111827' }}>Reviews & Ratings</h1>
            <p style={{ margin: 0, color: '#6b7280' }}>Your reputation on SkillSphere</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: showForm ? '#6b7280' : '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            {showForm ? 'Cancel' : '+ Add Review'}
          </button>
        </div>

        {/* Rating summary */}
        {rating && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontSize: '48px', fontWeight: '800', color: '#111827' }}>{rating.averageRating?.toFixed(1)}</p>
                <Stars value={Math.round(rating.averageRating)} />
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#6b7280' }}>{rating.totalReviews} reviews</p>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  ['Communication', rating.avgCommunication],
                  ['Quality', rating.avgQuality],
                  ['Timeliness', rating.avgTimeliness],
                  ['Professionalism', rating.avgProfessionalism],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', color: '#374151' }}>{label}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5' }}>{val?.toFixed(1)}</span>
                    </div>
                    <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${((val || 0) / 5) * 100}%`, background: '#4f46e5', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: '#111827' }}>Submit a Review</h3>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px', color: '#374151' }}>Gig ID *</label>
                <input style={inputStyle} name="gigId" value={formData.gigId} onChange={handleChange} placeholder="Paste the Gig ID" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                {[
                  ['Overall Rating', 'rating', formData.rating],
                  ['Communication', 'cat_communication', formData.categories.communication],
                  ['Quality', 'cat_quality', formData.categories.quality],
                  ['Timeliness', 'cat_timeliness', formData.categories.timeliness],
                  ['Professionalism', 'cat_professionalism', formData.categories.professionalism],
                ].map(([label, name, val]) => (
                  <div key={name}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px', color: '#374151' }}>{label}</label>
                    <select style={{ ...inputStyle }} name={name} value={val} onChange={handleChange}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px', color: '#374151' }}>Comment *</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} name="comment" value={formData.comment} onChange={handleChange} rows={4} placeholder="Share your experience working with this freelancer..." required />
              </div>

              <button type="submit" disabled={submitting}
                style={{ background: submitting ? '#a5b4fc' : '#4f46e5', color: 'white', border: 'none', padding: '11px 28px', borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '700' }}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '36px', margin: '0 0 12px' }}>⭐</p>
            <p style={{ color: '#6b7280' }}>No reviews yet. Complete gigs to receive reviews.</p>
          </div>
        ) : (
          reviews.map(r => (
            <div key={r._id} style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>
                    {r.clientId?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#111827', fontSize: '14px' }}>{r.clientId?.name || 'Client'}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;