import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import '../styles/proposals.css';

const ProposalsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const token = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${token}` };

  const [myProposals, setMyProposals] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigProposals, setGigProposals] = useState([]);
  const [loadingGigProposals, setLoadingGigProposals] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (role === 'freelancer') fetchMyProposals();
    else fetchMyGigs();
  }, [role]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchMyProposals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/proposals/my-proposals`, { headers });
      setMyProposals(res.data.data?.proposals || res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const withdrawProposal = async (id) => {
    if (!window.confirm('Withdraw this proposal?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/proposals/${id}`, { headers });
      setMyProposals(prev => prev.filter(p => p._id !== id));
      showToast('Proposal withdrawn.');
    } catch { showToast('Error withdrawing proposal.'); }
  };

  const fetchMyGigs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/gigs/my-gigs`, { headers });
      setMyGigs(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchGigProposals = async (gig) => {
    setSelectedGig(gig);
    setLoadingGigProposals(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/proposals/gig/${gig._id}`, { headers });
      setGigProposals(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoadingGigProposals(false); }
  };

  const handleAccept = async (proposalId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/proposals/${proposalId}/accept`, {}, { headers });
      setGigProposals(prev => prev.map(p =>
        p._id === proposalId ? { ...p, status: 'accepted' } : { ...p, status: p.status === 'pending' ? 'rejected' : p.status }
      ));
      showToast('✅ Proposal accepted!');
    } catch { showToast('Error accepting proposal.'); }
  };

  const handleReject = async (proposalId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/proposals/${proposalId}/reject`, {}, { headers });
      setGigProposals(prev => prev.map(p => p._id === proposalId ? { ...p, status: 'rejected' } : p));
      showToast('Proposal rejected.');
    } catch { showToast('Error rejecting proposal.'); }
  };

  return (
    <div className="proposals-page">
      <Navbar />
      {toast && <div className="toast">{toast}</div>}

      <div className="proposals-container">

        {/* ── FREELANCER VIEW ── */}
        {role === 'freelancer' && (
          <>
            <div className="proposals-header">
              <h1>My Proposals</h1>
              <p>Track all proposals you've submitted to gigs</p>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px' }}>Loading...</p>
            ) : myProposals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <p>You haven't submitted any proposals yet.</p>
                <button className="btn-primary" onClick={() => navigate('/gigs')}>Browse Gigs</button>
              </div>
            ) : myProposals.map(p => (
              <div key={p._id} className={`proposal-card ${p.status}`}>
                <div className="proposal-card-left">
                  <h3>{p.title}</h3>
                  <p className="proposal-meta">
                    Gig: <strong>{p.gigId?.title || p.gigId}</strong> &nbsp;·&nbsp;
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                  <p className="proposal-desc">{p.description}</p>
                  <div className="proposal-stats">
                    <span>💰 <strong>${p.bidAmount}</strong></span>
                    <span>📅 <strong>{p.estimatedDays} days</strong></span>
                  </div>
                </div>
                <div className="proposal-card-right">
                  <span className={`status-badge ${p.status}`}>{p.status}</span>
                  {p.status === 'pending' && (
                    <button className="btn-withdraw" onClick={() => withdrawProposal(p._id)}>Withdraw</button>
                  )}
                  <button className="btn-view-gig" onClick={() => navigate(`/gig/${p.gigId?._id || p.gigId}`)}>
                    View Gig →
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── CLIENT VIEW ── */}
        {role !== 'freelancer' && (
          <>
            <div className="proposals-header">
              <h1>Proposals</h1>
              <p>Review proposals submitted to your gigs</p>
            </div>

            <div className={selectedGig ? 'client-grid' : ''}>
              <div>
                <p className="gigs-list-title">Your Gigs</p>
                {loading ? (
                  <p style={{ color: '#9ca3af' }}>Loading gigs...</p>
                ) : myGigs.length === 0 ? (
                  <div className="empty-state">
                    <p>No gigs posted yet.</p>
                    <button className="btn-primary" onClick={() => navigate('/gigs/create')}>Post a Gig</button>
                  </div>
                ) : myGigs.map(gig => (
                  <div key={gig._id} className={`gig-item ${selectedGig?._id === gig._id ? 'active' : ''}`}
                    onClick={() => fetchGigProposals(gig)}>
                    <p className="gig-item-title">{gig.title}</p>
                    <p className="gig-item-meta">{gig.category} · ${gig.budget?.min}–${gig.budget?.max}</p>
                    <div className="gig-item-footer">
                      <span className="gig-proposals-count">{gig.proposals?.length || 0} proposals</span>
                      <span className={`gig-status ${gig.status}`}>{gig.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedGig && (
                <div>
                  <div className="proposals-panel-header">
                    <h3>Proposals for: <em>{selectedGig.title}</em></h3>
                    <button className="btn-close" onClick={() => setSelectedGig(null)}>✕</button>
                  </div>

                  {loadingGigProposals ? (
                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>Loading...</p>
                  ) : gigProposals.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <p>No proposals received yet.</p>
                    </div>
                  ) : gigProposals.map(p => (
                    <div key={p._id} className="proposal-review-card">
                      <div className="proposal-review-header">
                        <div>
                          <h4>{p.title}</h4>
                          <p>by <strong>{p.freelancerId?.name || 'Freelancer'}</strong> · {new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`status-badge ${p.status}`}>{p.status}</span>
                      </div>

                      <p className="proposal-review-desc">{p.description}</p>

                      <div className="proposal-amounts">
                        <div className="amount-box">
                          <p className="amount-label">Bid Amount</p>
                          <p className="amount-value">${p.bidAmount}</p>
                        </div>
                        <div className="amount-box">
                          <p className="amount-label">Delivery</p>
                          <p className="amount-value">{p.estimatedDays}d</p>
                        </div>
                      </div>

                      {p.status === 'pending' && (
                        <div className="proposal-actions">
                          <button className="btn-accept" onClick={() => handleAccept(p._id)}>✓ Accept</button>
                          <button className="btn-reject" onClick={() => handleReject(p._id)}>✕ Reject</button>
                        </div>
                      )}

                      {p.status === 'accepted' && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <button className="btn-pay"
                            onClick={() => navigate(`/payments?gigId=${selectedGig._id}&proposalId=${p._id}&freelancerId=${p.freelancerId?._id}&amount=${p.bidAmount}`)}>
                            💳 Pay Now — ${p.bidAmount}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProposalsPage;