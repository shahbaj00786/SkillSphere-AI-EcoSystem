import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

// ── Skill similarity engine (runs in browser, no API key needed) ──
// Uses Jaccard similarity on tokenized skill strings
const tokenize = (str) =>
  str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

const jaccardSimilarity = (setA, setB) => {
  const a = new Set(setA);
  const b = new Set(setB);
  const intersection = [...a].filter(x => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
};

const scoreGig = (gig, freelancerSkills) => {
  const gigSkillTokens = (gig.requiredSkills || []).flatMap(tokenize);
  const freelancerTokens = freelancerSkills.flatMap(tokenize);
  const skillScore = jaccardSimilarity(gigSkillTokens, freelancerTokens);

  // Boost for open gigs
  const statusBoost = gig.status === 'open' ? 0.1 : 0;

  // Boost based on proposal count (less competition = better)
  const proposalCount = gig.proposals?.length || 0;
  const competitionScore = proposalCount < 3 ? 0.1 : proposalCount < 7 ? 0.05 : 0;

  return Math.min(1, skillScore + statusBoost + competitionScore);
};

const MatchBadge = ({ score }) => {
  const pct = Math.round(score * 100);
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#6b7280';
  const label = pct >= 70 ? 'Great Match' : pct >= 40 ? 'Good Match' : 'Partial Match';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 6px' }}>
        <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '64px', height: '64px' }}>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${pct} 100`} strokeLinecap="round" />
        </svg>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '12px', fontWeight: '800', color }}>{pct}%</span>
      </div>
      <span style={{ fontSize: '10px', fontWeight: '700', color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
};

const AIMatchPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${token}` };

  const [profile, setProfile] = useState(null);
  const [allGigs, setAllGigs] = useState([]);
  const [matchedGigs, setMatchedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  const [customSkills, setCustomSkills] = useState([]);
  const [sortBy, setSortBy] = useState('score'); // score | budget | recent
  const [filterMin, setFilterMin] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gigsRes, profileRes] = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_API_URL}/gigs/all`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/users/me`, { headers }),
      ]);

      let gigs = [];
      if (gigsRes.status === 'fulfilled') {
        const d = gigsRes.value.data.data;
        gigs = Array.isArray(d) ? d : d?.gigs || [];
        setAllGigs(gigs);
      }

      let skills = [];
      if (profileRes.status === 'fulfilled') {
        const roleData = profileRes.value.data.roleData;
        setProfile(profileRes.value.data.user);
        skills = (roleData?.skills || []).map(s => s.name);
      }
      setCustomSkills(skills);
      runMatching(gigs, skills);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runMatching = (gigs, skills) => {
    if (!skills.length) { setMatchedGigs([]); return; }
    const scored = gigs
      .filter(g => g.status === 'open')
      .map(g => ({ ...g, _matchScore: scoreGig(g, skills) }))
      .filter(g => g._matchScore > 0)
      .sort((a, b) => b._matchScore - a._matchScore);
    setMatchedGigs(scored);
  };

  const addCustomSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || customSkills.includes(trimmed)) return;
    const updated = [...customSkills, trimmed];
    setCustomSkills(updated);
    setSkillInput('');
    runMatching(allGigs, updated);
  };

  const removeSkill = (skill) => {
    const updated = customSkills.filter(s => s !== skill);
    setCustomSkills(updated);
    runMatching(allGigs, updated);
  };

  const sortedFiltered = [...matchedGigs]
    .filter(g => filterMin === '' || (g.budget?.min || 0) >= Number(filterMin))
    .sort((a, b) => {
      if (sortBy === 'score') return b._matchScore - a._matchScore;
      if (sortBy === 'budget') return (b.budget?.max || 0) - (a.budget?.max || 0);
      if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <span style={{ fontSize: '28px' }}>🤖</span>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#111827' }}>AI Job Matching</h1>
          </div>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Gigs ranked by skill similarity score — your best matches appear first
          </p>
        </div>

        {/* Skills Panel */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 12px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
            🎯 Your Skills — used to calculate match scores
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {customSkills.length === 0 && (
              <span style={{ color: '#9ca3af', fontSize: '13px' }}>No skills added yet. Add skills below to see matches.</span>
            )}
            {customSkills.map(s => (
              <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                {s}
                <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: 0, fontSize: '14px', lineHeight: 1 }}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
              placeholder="Add a skill (e.g. React, Figma, Python)..."
              style={{ flex: 1, padding: '9px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
            />
            <button onClick={addCustomSkill}
              style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '9px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              + Add
            </button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {loading ? 'Loading...' : `${sortedFiltered.length} matches found`}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', background: 'white' }}>
              <option value="score">Sort: Best Match</option>
              <option value="budget">Sort: Highest Budget</option>
              <option value="recent">Sort: Most Recent</option>
            </select>
            <input type="number" value={filterMin} onChange={e => setFilterMin(e.target.value)}
              placeholder="Min budget $"
              style={{ width: '120px', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px' }}>Analyzing gigs with your skills...</p>
        ) : customSkills.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <p style={{ fontSize: '40px', margin: '0 0 12px' }}>🎯</p>
            <p style={{ color: '#6b7280', fontSize: '16px', margin: '0 0 20px' }}>Add your skills above to see personalized gig matches.</p>
          </div>
        ) : sortedFiltered.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <p style={{ fontSize: '40px', margin: '0 0 12px' }}>😕</p>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>No matching gigs found. Try adding more skills or adjusting filters.</p>
          </div>
        ) : (
          sortedFiltered.map((gig) => (
            <div key={gig._id} style={{
              background: 'white', borderRadius: '14px', padding: '20px 24px',
              marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              borderLeft: gig._matchScore >= 0.7 ? '4px solid #10b981' : gig._matchScore >= 0.4 ? '4px solid #f59e0b' : '4px solid #e5e7eb',
              display: 'flex', gap: '20px', alignItems: 'flex-start',
            }}>
              {/* Match score circle */}
              <div style={{ flexShrink: 0, paddingTop: '4px' }}>
                <MatchBadge score={gig._matchScore} />
              </div>

              {/* Gig info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ margin: '0 0 6px', color: '#111827', fontSize: '17px', fontWeight: '700' }}>{gig.title}</h3>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>
                    ${gig.budget?.min}–${gig.budget?.max}
                  </span>
                </div>
                <p style={{ margin: '0 0 10px', color: '#6b7280', fontSize: '13px' }}>
                  {gig.category?.replace(/-/g, ' ')} · {gig.duration} · Posted {new Date(gig.createdAt).toLocaleDateString()}
                </p>
                <p style={{ margin: '0 0 12px', color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                  {gig.description?.substring(0, 120)}{gig.description?.length > 120 ? '...' : ''}
                </p>

                {/* Skill tags with match highlighting */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {(gig.requiredSkills || []).map(skill => {
                    const isMatch = customSkills.some(cs =>
                      cs.toLowerCase().includes(skill.toLowerCase()) ||
                      skill.toLowerCase().includes(cs.toLowerCase())
                    );
                    return (
                      <span key={skill} style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                        background: isMatch ? '#d1fae5' : '#f3f4f6',
                        color: isMatch ? '#065f46' : '#6b7280',
                        border: isMatch ? '1px solid #a7f3d0' : '1px solid transparent',
                      }}>
                        {isMatch ? '✓ ' : ''}{skill}
                      </span>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => navigate(`/gig/${gig._id}`)}
                    style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                    View & Apply →
                  </button>
                  <span style={{ fontSize: '12px', color: '#9ca3af', padding: '8px 0' }}>
                    {gig.proposals?.length || 0} proposal{gig.proposals?.length !== 1 ? 's' : ''} submitted
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AIMatchPage;