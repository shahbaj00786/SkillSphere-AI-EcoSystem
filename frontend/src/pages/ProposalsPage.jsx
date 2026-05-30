import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

const ProposalsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const token = localStorage.getItem('accessToken');

  // Freelancer state
  const [myProposals, setMyProposals] = useState([]);

  // Client state
  const [myGigs, setMyGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigProposals, setGigProposals] = useState([]);
  const [loadingGigProposals, setLoadingGigProposals] = useState(false);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (role === 'freelancer') fetchMyProposals();
    else fetchMyGigs();
  }, [role]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ─── FREELANCER ───────────────────────────────────────────────────────────

  const fetchMyProposals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/proposals/my-proposals`,
        { headers }
      );
      setMyProposals(res.data.data?.proposals || res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const withdrawProposal = async (id) => {
    if (!window.confirm('Withdraw this proposal?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/proposals/${id}`, { headers });
      setMyProposals((prev) => prev.filter((p) => p._id !== id));
      showToast('Proposal withdrawn.');
    } catch (err) {
      showToast('Error withdrawing proposal.');
    }
  };

  // ─── CLIENT ───────────────────────────────────────────────────────────────

  const fetchMyGigs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/gigs/my-gigs`,
        { headers }
      );
      setMyGigs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGigProposals = async (gig) => {
    setSelectedGig(gig);
    setLoadingGigProposals(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/proposals/gig/${gig._id}`,
        { headers }
      );
      setGigProposals(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGigProposals(false);
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proposals/${proposalId}/accept`,
        {},
        { headers }
      );
      setGigProposals((prev) =>
        prev.map((p) =>
          p._id === proposalId ? { ...p, status: 'accepted' } : { ...p, status: p.status === 'pending' ? 'rejected' : p.status }
        )
      );
      showToast('✅ Proposal accepted!');
    } catch (err) {
      showToast('Error accepting proposal.');
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/proposals/${proposalId}/reject`,
        {},
        { headers }
      );
      setGigProposals((prev) =>
        prev.map((p) => (p._id === proposalId ? { ...p, status: 'rejected' } : p))
      );
      showToast('Proposal rejected.');
    } catch (err) {
      showToast('Error rejecting proposal.');
    }
  };

  // ─── STATUS STYLES ────────────────────────────────────────────────────────

  const statusStyle = (status) => {
    const map = {
      pending:  { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
      accepted: { bg: '#d1fae5', color: '#065f46', label: 'Accepted' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
      withdrawn:{ bg: '#f3f4f6', color: '#6b7280', label: 'Withdrawn' },
    };
    return map[status] || map.pending;
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          background: '#1e1e2e', color: 'white', padding: '12px 24px',
          borderRadius: '8px', zIndex: 9999, fontSize: '14px', fontWeight: '600',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>

        {/* ── FREELANCER VIEW ── */}
        {role === 'freelancer' && (
          <>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111827' }}>My Proposals</h1>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Track all proposals you've submitted to gigs
              </p>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px' }}>Loading proposals...</p>
            ) : myProposals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '40px', margin: '0 0 12px' }}>📄</p>
                <p style={{ color: '#6b7280', fontSize: '16px', margin: '0 0 20px' }}>
                  You haven't submitted any proposals yet.
                </p>
                <button
                  onClick={() => navigate('/gigs')}
                  style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Browse Gigs
                </button>
              </div>
            ) : (
              myProposals.map((p) => {
                const s = statusStyle(p.status);
                return (
                  <div key={p._id} style={{
                    background: 'white', borderRadius: '14px', padding: '24px',
                    marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    borderLeft: `4px solid ${p.status === 'accepted' ? '#10b981' : p.status === 'rejected' ? '#ef4444' : '#4f46e5'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 6px', color: '#111827', fontSize: '17px' }}>{p.title}</h3>
                        <p style={{ margin: '0 0 10px', color: '#6b7280', fontSize: '13px' }}>
                          Gig: <strong style={{ color: '#374151' }}>{p.gigId?.title || p.gigId}</strong>
                          &nbsp;·&nbsp;Submitted {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                        <p style={{ margin: '0 0 12px', color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                          {p.description}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', color: '#374151' }}>
                            💰 <strong>Bid: ${p.bidAmount}</strong>
                          </span>
                          <span style={{ fontSize: '13px', color: '#374151' }}>
                            📅 <strong>{p.estimatedDays} days</strong>
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <span style={{
                          padding: '4px 14px', borderRadius: '20px', fontSize: '12px',
                          fontWeight: '700', background: s.bg, color: s.color,
                        }}>
                          {s.label}
                        </span>
                        {p.status === 'pending' && (
                          <button
                            onClick={() => withdrawProposal(p._id)}
                            style={{ background: 'none', border: '1px solid #e5e7eb', color: '#6b7280', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                          >
                            Withdraw
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/gig/${p.gigId?._id || p.gigId}`)}
                          style={{ background: '#f3f4f6', border: 'none', color: '#4f46e5', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                          View Gig →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ── CLIENT VIEW ── */}
        {role !== 'freelancer' && (
          <>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111827' }}>Proposals</h1>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Review proposals submitted to your gigs
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedGig ? '300px 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>

              {/* Gig list */}
              <div>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#374151', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Gigs
                </h3>
                {loading ? (
                  <p style={{ color: '#9ca3af' }}>Loading gigs...</p>
                ) : myGigs.length === 0 ? (
                  <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <p style={{ color: '#9ca3af', margin: '0 0 12px' }}>No gigs posted yet.</p>
                    <button
                      onClick={() => navigate('/gigs')}
                      style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                    >
                      Post a Gig
                    </button>
                  </div>
                ) : (
                  myGigs.map((gig) => (
                    <div
                      key={gig._id}
                      onClick={() => fetchGigProposals(gig)}
                      style={{
                        background: selectedGig?._id === gig._id ? '#eef2ff' : 'white',
                        border: selectedGig?._id === gig._id ? '2px solid #4f46e5' : '2px solid transparent',
                        borderRadius: '12px', padding: '16px', marginBottom: '10px',
                        cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#111827', fontSize: '14px' }}>
                        {gig.title}
                      </p>
                      <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '12px' }}>
                        {gig.category} · ${gig.budget?.min}–${gig.budget?.max}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '600' }}>
                          {gig.proposals?.length || 0} proposal{gig.proposals?.length !== 1 ? 's' : ''}
                        </span>
                        <span style={{
                          fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px',
                          background: gig.status === 'open' ? '#d1fae5' : '#f3f4f6',
                          color: gig.status === 'open' ? '#065f46' : '#6b7280',
                        }}>
                          {gig.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Proposals panel */}
              {selectedGig && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>
                      Proposals for: <em style={{ color: '#4f46e5' }}>{selectedGig.title}</em>
                    </h3>
                    <button
                      onClick={() => setSelectedGig(null)}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}
                    >
                      ✕
                    </button>
                  </div>

                  {loadingGigProposals ? (
                    <p style={{ color: '#9ca3af', padding: '40px', textAlign: 'center' }}>Loading proposals...</p>
                  ) : gigProposals.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '14px', padding: '48px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <p style={{ fontSize: '36px', margin: '0 0 12px' }}>📭</p>
                      <p style={{ color: '#6b7280' }}>No proposals received yet.</p>
                    </div>
                  ) : (
                    gigProposals.map((p) => {
                      const s = statusStyle(p.status);
                      return (
                        <div key={p._id} style={{
                          background: 'white', borderRadius: '14px', padding: '22px',
                          marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ margin: '0 0 4px', color: '#111827', fontSize: '16px' }}>{p.title}</h4>
                              <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
                                by <strong>{p.freelancerId?.name || 'Freelancer'}</strong>
                                &nbsp;·&nbsp;{new Date(p.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: s.bg, color: s.color }}>
                              {s.label}
                            </span>
                          </div>

                          <p style={{ margin: '0 0 14px', color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                            {p.description}
                          </p>

                          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 16px', textAlign: 'center' }}>
                              <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Bid Amount</p>
                              <p style={{ margin: 0, fontWeight: '800', color: '#111827', fontSize: '18px' }}>${p.bidAmount}</p>
                            </div>
                            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 16px', textAlign: 'center' }}>
                              <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>Delivery</p>
                              <p style={{ margin: 0, fontWeight: '800', color: '#111827', fontSize: '18px' }}>{p.estimatedDays}d</p>
                            </div>
                          </div>

                          {p.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                onClick={() => handleAccept(p._id)}
                                style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
                              >
                                ✓ Accept
                              </button>
                              <button
                                onClick={() => handleReject(p._id)}
                                style={{ flex: 1, background: 'white', color: '#ef4444', border: '1px solid #ef4444', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
                              >
                                ✕ Reject
                              </button>
                            </div>
                          )}

                          {p.status === 'accepted' && (
                            <div style={{ background: '#d1fae5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#065f46', fontWeight: '600' }}>
                              ✅ Accepted — You can now initiate payment for this gig.
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
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