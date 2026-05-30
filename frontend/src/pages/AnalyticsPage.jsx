import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar.jsx';

// Simple bar chart component (no external lib needed)
const BarChart = ({ data, color = '#4f46e5', label }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <p style={{ margin: '0 0 12px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600' }}>
              {d.value > 0 ? (d.value >= 1000 ? `$${(d.value/1000).toFixed(1)}k` : d.value) : ''}
            </span>
            <div style={{
              width: '100%', background: color, borderRadius: '4px 4px 0 0',
              height: `${Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0)}px`,
              minHeight: d.value > 0 ? '4px' : '0',
              transition: 'height 0.4s ease',
              opacity: 0.85,
            }} />
            <span style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center' }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color = '#4f46e5' }) => (
  <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderTop: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '800', color: '#111827' }}>{value}</p>
        {sub && <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{sub}</p>}
      </div>
      <span style={{ fontSize: '28px' }}>{icon}</span>
    </div>
  </div>
);

const AnalyticsPage = () => {
  const token = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [reviews, setReviews] = useState({ rating: null, reviews: [] });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, proposalsRes, reviewsRes, paymentsRes] = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_API_URL}/payments/freelancer/stats`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/proposals/my-proposals`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/reviews/freelancer/${userId}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/payments/freelancer/payments`, { headers }),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
      if (proposalsRes.status === 'fulfilled') {
        const d = proposalsRes.value.data.data;
        setProposals(Array.isArray(d) ? d : d?.proposals || []);
      }
      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data.data || {});
      if (paymentsRes.status === 'fulfilled') {
        const d = paymentsRes.value.data.data;
        setPayments(Array.isArray(d) ? d : []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ── Derived data ──
  const proposalStats = {
    total: proposals.length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    pending: proposals.filter(p => p.status === 'pending').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
  };
  const acceptRate = proposalStats.total > 0
    ? Math.round((proposalStats.accepted / proposalStats.total) * 100) : 0;

  // Monthly earnings from payments (last 6 months)
  const monthlyEarnings = (() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ label: d.toLocaleString('default', { month: 'short' }), month: d.getMonth(), year: d.getFullYear(), value: 0 });
    }
    payments.filter(p => p.status === 'completed').forEach(p => {
      const d = new Date(p.createdAt);
      const m = months.find(mo => mo.month === d.getMonth() && mo.year === d.getFullYear());
      if (m) m.value += p.freelancerAmount || p.amount || 0;
    });
    return months;
  })();

  // Proposal status bar chart
  const proposalChart = [
    { label: 'Accepted', value: proposalStats.accepted },
    { label: 'Pending', value: proposalStats.pending },
    { label: 'Rejected', value: proposalStats.rejected },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      <p style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontSize: '16px' }}>Loading analytics...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111827' }}>Analytics Dashboard</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>Track your performance, earnings, and reputation</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard icon="💰" label="Total Earnings" value={`$${(stats?.totalEarnings || 0).toFixed(2)}`} sub="All completed payments" color="#10b981" />
          <StatCard icon="⏳" label="Pending Amount" value={`$${(stats?.pendingAmount || 0).toFixed(2)}`} sub="Awaiting release" color="#f59e0b" />
          <StatCard icon="✅" label="Completed Jobs" value={stats?.completedPayments || 0} sub="Paid gigs" color="#4f46e5" />
          <StatCard icon="📄" label="Proposals Sent" value={proposalStats.total} sub={`${acceptRate}% acceptance rate`} color="#8b5cf6" />
          <StatCard icon="⭐" label="Avg Rating" value={reviews.rating?.averageRating?.toFixed(1) || '—'} sub={`${reviews.rating?.totalReviews || 0} reviews`} color="#f59e0b" />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>

          {/* Monthly earnings chart */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <BarChart data={monthlyEarnings} color="#4f46e5" label="Monthly Earnings ($) — Last 6 Months" />
          </div>

          {/* Proposal breakdown chart */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <BarChart
              data={proposalChart}
              color="#8b5cf6"
              label="Proposal Status Breakdown"
            />
            {/* Acceptance rate meter */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Acceptance Rate</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5' }}>{acceptRate}%</span>
              </div>
              <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${acceptRate}%`, background: '#10b981', borderRadius: '4px', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews breakdown */}
        {reviews.rating && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '28px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', color: '#111827' }}>⭐ Rating Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Communication', value: reviews.rating.avgCommunication },
                { label: 'Quality', value: reviews.rating.avgQuality },
                { label: 'Timeliness', value: reviews.rating.avgTimeliness },
                { label: 'Professionalism', value: reviews.rating.avgProfessionalism },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#6b7280' }}>{item.label}</p>
                  <p style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '800', color: '#111827' }}>
                    {item.value?.toFixed(1) || '—'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ color: s <= Math.round(item.value || 0) ? '#f59e0b' : '#d1d5db', fontSize: '14px' }}>★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '28px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#111827' }}>💳 Recent Transactions</h3>
          {payments.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px' }}>No transactions yet.</p>
          ) : (
            <div>
              {payments.slice(0, 5).map(p => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                      {p.gigId?.title || `Payment #${p._id?.substring(0, 6)}`}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                      {new Date(p.createdAt).toLocaleDateString()} · {p.paymentMethod}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 2px', fontWeight: '800', color: '#10b981', fontSize: '15px' }}>
                      +${(p.freelancerAmount || p.amount || 0).toFixed(2)}
                    </p>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px',
                      background: p.status === 'completed' ? '#d1fae5' : p.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                      color: p.status === 'completed' ? '#065f46' : p.status === 'pending' ? '#92400e' : '#6b7280',
                    }}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Proposals */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#111827' }}>📄 Recent Proposals</h3>
            <a href="/proposals" style={{ fontSize: '13px', color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>View all →</a>
          </div>
          {proposals.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px' }}>No proposals submitted yet.</p>
          ) : (
            proposals.slice(0, 4).map(p => {
              const statusMap = { pending: { bg: '#fef3c7', c: '#92400e' }, accepted: { bg: '#d1fae5', c: '#065f46' }, rejected: { bg: '#fee2e2', c: '#991b1b' } };
              const s = statusMap[p.status] || statusMap.pending;
              return (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: '600', color: '#111827', fontSize: '14px' }}>{p.title}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                      ${p.bidAmount} · {p.estimatedDays} days · {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: s.bg, color: s.c }}>
                    {p.status}
                  </span>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;