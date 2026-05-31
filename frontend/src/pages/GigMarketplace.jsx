import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import { useSelector } from 'react-redux';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'seo', label: 'SEO' },
  { value: 'other', label: 'Other' },
];

const GigMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', search: '' });

  useEffect(() => { fetchGigs(); }, [filters, page]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);
      params.append('page', page);
      params.append('limit', 9);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/search/gigs?${params}`);
      const data = res.data.data?.gigs || [];
      setGigs(data);
      setHasMore(data.length === 9);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleFilter = (e) => {
    setFilters(p => ({ ...p, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', background: 'white', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '40px 24px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: '800' }}>Find Your Next Project</h1>
        <p style={{ margin: '0 0 24px', opacity: 0.85, fontSize: '16px' }}>Browse available gigs from clients worldwide</p>
        {/* Search bar */}
        <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', gap: '8px' }}>
          <input
            name="search" value={filters.search} onChange={handleFilter}
            placeholder="Search gigs by title or skill..."
            style={{ ...inputStyle, flex: 1, padding: '12px 16px', fontSize: '15px', borderRadius: '10px', border: 'none' }}
          />
          <button onClick={fetchGigs}
            style={{ background: 'white', color: '#4f46e5', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
            Search
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Filters sidebar */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#111827', fontWeight: '700' }}>Filters</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Category</label>
              <select name="category" value={filters.category} onChange={handleFilter} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Min Budget ($)</label>
              <input style={inputStyle} type="number" name="minPrice" value={filters.minPrice} onChange={handleFilter} placeholder="0" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Max Budget ($)</label>
              <input style={inputStyle} type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilter} placeholder="Any" />
            </div>

            <button onClick={() => { setFilters({ category: '', minPrice: '', maxPrice: '', search: '' }); setPage(1); }}
              style={{ width: '100%', padding: '9px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Clear Filters
            </button>

            {/* Post gig CTA for clients */}
            {user?.role === 'client' && (
              <button onClick={() => navigate('/gigs/create')}
                style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '8px', background: '#4f46e5', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '700', marginTop: '12px' }}>
                + Post a Gig
              </button>
            )}

            {/* AI Match CTA for freelancers */}
            {user?.role === 'freelancer' && (
              <button onClick={() => navigate('/ai-match')}
                style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '8px', background: '#7c3aed', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '700', marginTop: '12px' }}>
                🤖 AI Match Me
              </button>
            )}
          </div>

          {/* Gigs grid */}
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '14px' }}>
                <p style={{ color: '#9ca3af' }}>Loading gigs...</p>
              </div>
            ) : gigs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '36px', margin: '0 0 12px' }}>🔍</p>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>No gigs found. Try different filters.</p>
              </div>
            ) : (
              <>
                <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: '14px' }}>{gigs.length} gig{gigs.length !== 1 ? 's' : ''} found</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {gigs.map(gig => (
                    <div key={gig._id} onClick={() => navigate(`/gig/${gig._id}`)}
                      style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', border: '1px solid #f3f4f6' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'; }}
                    >
                      {/* Category badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                          {gig.category?.replace(/-/g, ' ')}
                        </span>
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                          background: gig.status === 'open' ? '#d1fae5' : '#f3f4f6',
                          color: gig.status === 'open' ? '#065f46' : '#6b7280',
                        }}>
                          {gig.status}
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '700', color: '#111827', lineHeight: '1.4' }}>{gig.title}</h3>
                      <p style={{ margin: '0 0 12px', color: '#6b7280', fontSize: '13px', lineHeight: '1.5' }}>
                        {gig.description?.substring(0, 90)}{gig.description?.length > 90 ? '...' : ''}
                      </p>

                      {/* Skills */}
                      {gig.requiredSkills?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                          {gig.requiredSkills.slice(0, 3).map(s => (
                            <span key={s} style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: '8px', fontSize: '11px' }}>{s}</span>
                          ))}
                          {gig.requiredSkills.length > 3 && <span style={{ color: '#9ca3af', fontSize: '11px', padding: '2px' }}>+{gig.requiredSkills.length - 3}</span>}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                        <span style={{ fontWeight: '800', color: '#10b981', fontSize: '15px' }}>${gig.budget?.min}–${gig.budget?.max}</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{gig.duration}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>By {gig.clientId?.name || 'Client'}</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{gig.proposals?.length || 0} proposals</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #e5e7eb', background: page === 1 ? '#f3f4f6' : 'white', color: page === 1 ? '#9ca3af' : '#374151', cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px' }}>
                    ← Previous
                  </button>
                  <span style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', borderRadius: '8px', fontWeight: '700', fontSize: '13px' }}>
                    Page {page}
                  </span>
                  <button onClick={() => setPage(p => p + 1)} disabled={!hasMore}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #e5e7eb', background: !hasMore ? '#f3f4f6' : 'white', color: !hasMore ? '#9ca3af' : '#374151', cursor: !hasMore ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px' }}>
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigMarketplace;