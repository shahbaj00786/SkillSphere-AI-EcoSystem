import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

const MatchBadge = ({ score }) => {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#6b7280';
  const label = score >= 70 ? 'Great Match' : score >= 40 ? 'Good Match' : 'Partial Match';
  return (
    <div style={{ textAlign: 'center', flexShrink: 0 }}>
      <div style={{ position: 'relative', width: '68px', height: '68px', margin: '0 auto 4px' }}>
        <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '68px', height: '68px' }}>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${score} 100`} strokeLinecap="round" />
        </svg>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '13px', fontWeight: '800', color }}>{score}%</span>
      </div>
      <span style={{ fontSize: '10px', fontWeight: '700', color, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</span>
    </div>
  );
};

const AIMatchPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${token}` };

  const [matches, setMatches] = useState([]);
  const [summary, setSummary] = useState('');
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null); // gigId being generated
  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [profileMissing, setProfileMissing] = useState(false);

  useEffect(() => { fetchMatches(); fetchTrending(); }, []);

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ai/match-gigs`, { headers });
      const data = res.data.data;
      setMatches(data.matches || []);
      setSummary(data.summary || '');
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.message?.includes('profile')) {
        setProfileMissing(true);
      } else {
        setError(err.response?.data?.message || 'Failed to load AI matches. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ai/trending-skills`);
      setTrending(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  const generateProposal = async (gigId) => {
    setGenerating(gigId);
    setGeneratedProposal(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ai/generate-proposal/${gigId}`, { headers });
      setGeneratedProposal({ gigId, ...res.data.data });
    } catch (err) {
      alert('Failed to generate proposal. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const sorted = [...matches].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'budget') return (b.gig?.budget?.max || 0) - (a.gig?.budget?.max || 0);
    return new Date(b.gig?.createdAt) - new Date(a.gig?.createdAt);
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>

        {/* Main column */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '28px' }}>🤖</span>
              <h1 style={{ margin: 0, fontSize: '28px', color: '#111827' }}>AI Job Matching</h1>
            </div>
            <p style={{ margin: 0, color: '#6b7280' }}>Powered by Gemini AI — gigs ranked by your skill fit</p>
          </div>

          {/* AI Summary */}
          {summary && (
            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', color: 'white' }}>
              <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '700', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gemini AI Assessment</p>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5' }}>💡 {summary}</p>
            </div>
          )}

          {/* Profile missing state */}
          {profileMissing && (
            <div style={{ background: 'white', borderRadius: '14px', padding: '48px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <p style={{ fontSize: '40px', margin: '0 0 12px' }}>👤</p>
              <h3 style={{ margin: '0 0 8px', color: '#111827' }}>Profile Setup Required</h3>
              <p style={{ color: '#6b7280', margin: '0 0 20px' }}>You need to set up your freelancer profile with skills before AI matching can work.</p>
              <button onClick={() => navigate('/freelancer-setup')}
                style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                Set Up Profile →
              </button>
            </div>
          )}

          {/* Error state */}
          {error && !profileMissing && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '16px 20px', borderRadius: '12px', marginBottom: '20px' }}>
              ❌ {error}
              <button onClick={fetchMatches} style={{ marginLeft: '16px', background: '#991b1b', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                Retry
              </button>
            </div>
          )}

          {/* Sort control */}
          {!loading && !profileMissing && matches.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}><strong>{matches.length}</strong> AI-curated matches</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', background: 'white' }}>
                <option value="score">Best Match First</option>
                <option value="budget">Highest Budget</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <p style={{ fontSize: '36px', margin: '0 0 12px' }}>🧠</p>
              <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>Gemini AI is analyzing your profile against available gigs...</p>
            </div>
          )}

          {/* No matches */}
          {!loading && !profileMissing && !error && matches.length === 0 && (
            <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <p style={{ fontSize: '36px', margin: '0 0 12px' }}>😕</p>
              <p style={{ color: '#6b7280' }}>No matching gigs found right now. Check back soon!</p>
            </div>
          )}

          {/* Match cards */}
          {sorted.map((m) => {
            const gig = m.gig;
            if (!gig) return null;
            return (
              <div key={gig._id} style={{
                background: 'white', borderRadius: '14px', padding: '20px 22px',
                marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                borderLeft: `4px solid ${m.score >= 70 ? '#10b981' : m.score >= 40 ? '#f59e0b' : '#e5e7eb'}`,
              }}>
                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  <MatchBadge score={m.score} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ margin: 0, color: '#111827', fontSize: '16px', fontWeight: '700' }}>{gig.title}</h3>
                      <span style={{ fontWeight: '800', color: '#10b981', fontSize: '15px' }}>
                        ${gig.budget?.min}–${gig.budget?.max}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '12px' }}>
                      {gig.category?.replace(/-/g, ' ')} · {gig.duration} · {new Date(gig.createdAt).toLocaleDateString()}
                    </p>

                    {/* AI reason */}
                    <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px', borderLeft: '3px solid #10b981' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#065f46' }}>
                        <strong>Why you match:</strong> {m.reason}
                      </p>
                    </div>

                    {m.skillGap && (
                      <div style={{ background: '#fefce8', borderRadius: '8px', padding: '6px 12px', marginBottom: '10px', borderLeft: '3px solid #f59e0b' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#92400e' }}>
                          <strong>Skill gap:</strong> {m.skillGap}
                        </p>
                      </div>
                    )}

                    {/* Required skills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {(gig.requiredSkills || []).map(skill => (
                        <span key={skill} style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', background: '#eef2ff', color: '#4f46e5' }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button onClick={() => navigate(`/gig/${gig._id}`)}
                        style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                        View & Apply →
                      </button>
                      <button onClick={() => generateProposal(gig._id)} disabled={generating === gig._id}
                        style={{ background: generating === gig._id ? '#d1d5db' : 'white', color: '#7c3aed', border: '1px solid #7c3aed', padding: '8px 18px', borderRadius: '8px', cursor: generating === gig._id ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px' }}>
                        {generating === gig._id ? '✨ Generating...' : '✨ AI Write Proposal'}
                      </button>
                    </div>

                    {/* Generated proposal preview */}
                    {generatedProposal?.gigId === gig._id && (
                      <div style={{ marginTop: '16px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <p style={{ margin: 0, fontWeight: '700', color: '#5b21b6', fontSize: '14px' }}>✨ AI Generated Proposal</p>
                          <button onClick={() => setGeneratedProposal(null)}
                            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                        </div>
                        <p style={{ margin: '0 0 6px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>{generatedProposal.title}</p>
                        <p style={{ margin: '0 0 12px', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>{generatedProposal.proposal}</p>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '13px', color: '#374151' }}>💰 Suggested Bid: <strong>${generatedProposal.suggestedBid}</strong></span>
                          <span style={{ fontSize: '13px', color: '#374151' }}>📅 Est. Days: <strong>{generatedProposal.estimatedDays}</strong></span>
                        </div>
                        <button onClick={() => navigate(`/gig/${gig._id}`, { state: { proposal: generatedProposal } })}
                          style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                          Use This Proposal →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div>
          {/* Trending skills */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#111827' }}>🔥 Trending Skills</h3>
            {trending.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '13px' }}>Loading...</p>
            ) : trending.map((t, i) => (
              <div key={t.skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                  <span style={{ color: '#9ca3af', marginRight: '6px' }}>#{i + 1}</span>{t.skill}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px',
                  background: t.demand === 'High' ? '#d1fae5' : t.demand === 'Medium' ? '#fef3c7' : '#f3f4f6',
                  color: t.demand === 'High' ? '#065f46' : t.demand === 'Medium' ? '#92400e' : '#6b7280',
                }}>
                  {t.demand} · {t.count} gigs
                </span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#111827' }}>Quick Actions</h3>
            <button onClick={() => navigate('/freelancer-setup')} style={{ display: 'block', width: '100%', textAlign: 'left', background: '#f5f3ff', border: 'none', color: '#5b21b6', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
              ✏️ Update Profile & Skills
            </button>
            <button onClick={() => navigate('/gigs')} style={{ display: 'block', width: '100%', textAlign: 'left', background: '#eff6ff', border: 'none', color: '#1d4ed8', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', fontWeight: '600', fontSize: '13px' }}>
              🔍 Browse All Gigs
            </button>
            <button onClick={() => navigate('/analytics')} style={{ display: 'block', width: '100%', textAlign: 'left', background: '#f0fdf4', border: 'none', color: '#065f46', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              📊 View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatchPage;