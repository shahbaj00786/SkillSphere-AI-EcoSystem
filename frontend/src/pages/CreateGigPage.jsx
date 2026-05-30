import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

const CATEGORIES = [
  'web-development', 'mobile-development', 'design', 'writing',
  'marketing', 'data-science', 'video-editing', 'seo', 'other',
];

const emptyMilestone = { name: '', description: '', amount: '', dueDate: '' };

const CreateGigPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [step, setStep] = useState(1); // 3-step form
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: { min: '', max: '' },
    duration: '',
    requiredSkills: '',
    milestones: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'budgetMin') return setFormData(p => ({ ...p, budget: { ...p.budget, min: value } }));
    if (name === 'budgetMax') return setFormData(p => ({ ...p, budget: { ...p.budget, max: value } }));
    setFormData(p => ({ ...p, [name]: value }));
  };

  // ── Milestones ──
  const addMilestone = () =>
    setFormData(p => ({ ...p, milestones: [...p.milestones, { ...emptyMilestone }] }));

  const removeMilestone = (i) =>
    setFormData(p => ({ ...p, milestones: p.milestones.filter((_, idx) => idx !== i) }));

  const updateMilestone = (i, field, value) =>
    setFormData(p => ({
      ...p,
      milestones: p.milestones.map((m, idx) => idx === i ? { ...m, [field]: value } : m),
    }));

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formData,
        budget: { min: Number(formData.budget.min), max: Number(formData.budget.max) },
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        milestones: formData.milestones.map(m => ({ ...m, amount: Number(m.amount) })),
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/gigs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/gigs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create gig. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canNext1 = formData.title && formData.description && formData.category;
  const canNext2 = formData.budget.min && formData.budget.max && formData.duration;

  // ── Styles ──
  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
    fontFamily: 'inherit', outline: 'none',
  };
  const labelStyle = { display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' };
  const sectionStyle = { marginBottom: '20px' };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />

      <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111827' }}>Post a New Gig</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>Find the perfect freelancer for your project</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '32px' }}>
          {['Project Details', 'Budget & Timeline', 'Milestones'].map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={n} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: '700',
                  background: done ? '#10b981' : active ? '#4f46e5' : '#e5e7eb',
                  color: done || active ? 'white' : '#9ca3af',
                }}>
                  {done ? '✓' : n}
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: active ? '#4f46e5' : '#9ca3af', fontWeight: active ? '700' : '400' }}>
                  {label}
                </p>
                {i < 2 && (
                  <div style={{
                    position: 'absolute', top: '18px', left: '50%', width: '100%',
                    height: '2px', background: done ? '#10b981' : '#e5e7eb', zIndex: 0,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              ❌ {error}
            </div>
          )}

          {/* ── STEP 1: Project Details ── */}
          {step === 1 && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontSize: '20px', color: '#111827' }}>Project Details</h2>

              <div style={sectionStyle}>
                <label style={labelStyle}>Project Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={inputStyle} name="title" value={formData.title}
                  onChange={handleChange} placeholder="e.g. Build a React e-commerce website" />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Category <span style={{ color: '#ef4444' }}>*</span></label>
                <select style={{ ...inputStyle, background: 'white' }} name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Description <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} name="description"
                  value={formData.description} onChange={handleChange} rows={5}
                  placeholder="Describe your project in detail — requirements, goals, deliverables..." />
              </div>

              <div style={sectionStyle}>
                <label style={labelStyle}>Required Skills</label>
                <input style={inputStyle} name="requiredSkills" value={formData.requiredSkills}
                  onChange={handleChange} placeholder="e.g. React, Node.js, MongoDB (comma separated)" />
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>Separate skills with commas</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button onClick={() => setStep(2)} disabled={!canNext1}
                  style={{ background: canNext1 ? '#4f46e5' : '#d1d5db', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: canNext1 ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '15px' }}>
                  Next: Budget & Timeline →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Budget & Timeline ── */}
          {step === 2 && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontSize: '20px', color: '#111827' }}>Budget & Timeline</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Min Budget ($) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="number" name="budgetMin" value={formData.budget.min}
                    onChange={handleChange} placeholder="500" min="1" />
                </div>
                <div>
                  <label style={labelStyle}>Max Budget ($) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="number" name="budgetMax" value={formData.budget.max}
                    onChange={handleChange} placeholder="2000" min="1" />
                </div>
              </div>

              {formData.budget.min && formData.budget.max && Number(formData.budget.max) < Number(formData.budget.min) && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>⚠ Max budget must be greater than min budget</p>
              )}

              <div style={sectionStyle}>
                <label style={labelStyle}>Project Duration <span style={{ color: '#ef4444' }}>*</span></label>
                <select style={{ ...inputStyle, background: 'white' }} name="duration" value={formData.duration} onChange={handleChange}>
                  <option value="">Select duration</option>
                  <option value="Less than 1 week">Less than 1 week</option>
                  <option value="1-2 weeks">1–2 weeks</option>
                  <option value="2-4 weeks">2–4 weeks</option>
                  <option value="1-3 months">1–3 months</option>
                  <option value="3-6 months">3–6 months</option>
                  <option value="More than 6 months">More than 6 months</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button onClick={() => setStep(1)}
                  style={{ background: 'white', color: '#6b7280', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  ← Back
                </button>
                <button onClick={() => setStep(3)} disabled={!canNext2}
                  style={{ background: canNext2 ? '#4f46e5' : '#d1d5db', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: canNext2 ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '15px' }}>
                  Next: Milestones →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Milestones ── */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#111827' }}>Milestones</h2>
              <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '14px' }}>
                Break your project into milestones for easier tracking and payment. (Optional)
              </p>

              {formData.milestones.map((m, i) => (
                <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: '#374151' }}>Milestone {i + 1}</p>
                    <button type="button" onClick={() => removeMilestone(i)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Name</label>
                      <input style={inputStyle} value={m.name} onChange={e => updateMilestone(i, 'name', e.target.value)} placeholder="e.g. Design mockups" />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Amount ($)</label>
                      <input style={inputStyle} type="number" value={m.amount} onChange={e => updateMilestone(i, 'amount', e.target.value)} placeholder="500" />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Due Date</label>
                      <input style={inputStyle} type="date" value={m.dueDate} onChange={e => updateMilestone(i, 'dueDate', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Description</label>
                      <input style={inputStyle} value={m.description} onChange={e => updateMilestone(i, 'description', e.target.value)} placeholder="Brief description" />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addMilestone}
                style={{ width: '100%', padding: '12px', border: '2px dashed #d1d5db', borderRadius: '8px', background: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
                + Add Milestone
              </button>

              {/* Summary */}
              <div style={{ background: '#eef2ff', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                <p style={{ margin: '0 0 8px', fontWeight: '700', color: '#4f46e5', fontSize: '14px' }}>Project Summary</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { label: 'Category', value: formData.category },
                    { label: 'Budget', value: `$${formData.budget.min}–$${formData.budget.max}` },
                    { label: 'Duration', value: formData.duration },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#818cf8' }}>{item.label}</p>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#3730a3' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" onClick={() => setStep(2)}
                  style={{ background: 'white', color: '#6b7280', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  ← Back
                </button>
                <button type="submit" disabled={submitting}
                  style={{ background: submitting ? '#a5b4fc' : '#4f46e5', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px' }}>
                  {submitting ? 'Posting...' : '🚀 Post Gig'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGigPage;