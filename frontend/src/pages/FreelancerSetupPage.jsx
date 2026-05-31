import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';

const SKILL_LEVELS = ['beginner', 'intermediate', 'expert'];
const PRICING_TYPES = ['hourly', 'milestone', 'both'];

const FreelancerSetupPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: '',
    pricingType: 'hourly',
    location: { city: '', state: '', country: '' },
    skills: [{ name: '', proficiencyLevel: 'intermediate' }],
    portfolioItems: [],
    workExperience: [],
    certifications: [],
  });

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #d1d5db',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const labelStyle = { display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' };

  // ── Skills ──
  const addSkill = () => setFormData(p => ({ ...p, skills: [...p.skills, { name: '', proficiencyLevel: 'intermediate' }] }));
  const removeSkill = (i) => setFormData(p => ({ ...p, skills: p.skills.filter((_, idx) => idx !== i) }));
  const updateSkill = (i, field, val) => setFormData(p => ({
    ...p, skills: p.skills.map((s, idx) => idx === i ? { ...s, [field]: val } : s),
  }));

  // ── Portfolio ──
  const addPortfolio = () => setFormData(p => ({ ...p, portfolioItems: [...p.portfolioItems, { title: '', url: '', description: '' }] }));
  const removePortfolio = (i) => setFormData(p => ({ ...p, portfolioItems: p.portfolioItems.filter((_, idx) => idx !== i) }));
  const updatePortfolio = (i, field, val) => setFormData(p => ({
    ...p, portfolioItems: p.portfolioItems.map((item, idx) => idx === i ? { ...item, [field]: val } : item),
  }));

  // ── Work Experience ──
  const addExp = () => setFormData(p => ({ ...p, workExperience: [...p.workExperience, { company: '', role: '', from: '', to: '' }] }));
  const removeExp = (i) => setFormData(p => ({ ...p, workExperience: p.workExperience.filter((_, idx) => idx !== i) }));
  const updateExp = (i, field, val) => setFormData(p => ({
    ...p, workExperience: p.workExperience.map((e, idx) => idx === i ? { ...e, [field]: val } : e),
  }));

  // ── Certifications ──
  const addCert = () => setFormData(p => ({ ...p, certifications: [...p.certifications, { name: '', issuer: '', year: '' }] }));
  const removeCert = (i) => setFormData(p => ({ ...p, certifications: p.certifications.filter((_, idx) => idx !== i) }));
  const updateCert = (i, field, val) => setFormData(p => ({
    ...p, certifications: p.certifications.map((c, idx) => idx === i ? { ...c, [field]: val } : c),
  }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        skills: formData.skills.filter(s => s.name.trim()),
        portfolioItems: formData.portfolioItems.filter(p => p.title.trim()),
        workExperience: formData.workExperience.filter(e => e.company.trim()),
        certifications: formData.certifications.filter(c => c.name.trim()),
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/freelancers/setup`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ['Basic Info', 'Skills', 'Portfolio', 'Experience'];
  const canNext1 = formData.bio.trim() && formData.hourlyRate && formData.location.country;
  const canNext2 = formData.skills.some(s => s.name.trim());

  const cardStyle = { background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 16px', boxSizing: 'border-box', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111827' }}>Set Up Your Freelancer Profile</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>Complete your profile to start receiving gig matches</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', marginBottom: '32px' , overflowX: 'auto'}}>
          {steps.map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={n} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '700',
                  background: done ? '#10b981' : active ? '#4f46e5' : '#e5e7eb',
                  color: done || active ? 'white' : '#9ca3af',
                }}>
                  {done ? '✓' : n}
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: active ? '#4f46e5' : '#9ca3af', fontWeight: active ? '700' : '400' }}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        <div style={cardStyle}>
          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              ❌ {error}
            </div>
          )}

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontSize: '20px', color: '#111827' }}>Basic Information</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Bio / About You <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} name="bio"
                  value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell clients about yourself, your expertise, and what makes you unique..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Hourly Rate ($) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input style={inputStyle} type="number" value={formData.hourlyRate}
                    onChange={e => setFormData(p => ({ ...p, hourlyRate: e.target.value }))}
                    placeholder="e.g. 25" min="1" />
                </div>
                <div>
                  <label style={labelStyle}>Pricing Type</label>
                  <select style={{ ...inputStyle, background: 'white' }} value={formData.pricingType}
                    onChange={e => setFormData(p => ({ ...p, pricingType: e.target.value }))}>
                    {PRICING_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                {['city', 'state', 'country'].map(field => (
                  <div key={field}>
                    <label style={labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)} {field === 'country' && <span style={{ color: '#ef4444' }}>*</span>}</label>
                    <input style={inputStyle} value={formData.location[field]}
                      onChange={e => setFormData(p => ({ ...p, location: { ...p.location, [field]: e.target.value } }))}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button onClick={() => setStep(2)} disabled={!canNext1}
                  style={{ background: canNext1 ? '#4f46e5' : '#d1d5db', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: canNext1 ? 'pointer' : 'not-allowed', fontWeight: '700' }}>
                  Next: Skills →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Skills ── */}
          {step === 2 && (
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#111827' }}>Your Skills</h2>
              <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '14px' }}>Add your skills and proficiency levels</p>

              {formData.skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 2 }}>
                    {i === 0 && <label style={labelStyle}>Skill Name</label>}
                    <input style={inputStyle} value={s.name}
                      onChange={e => updateSkill(i, 'name', e.target.value)}
                      placeholder="e.g. React, Figma, Node.js" />
                  </div>
                  <div style={{ flex: 1 }}>
                    {i === 0 && <label style={labelStyle}>Level</label>}
                    <select style={{ ...inputStyle, background: 'white' }} value={s.proficiencyLevel}
                      onChange={e => updateSkill(i, 'proficiencyLevel', e.target.value)}>
                      {SKILL_LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                    </select>
                  </div>
                  {formData.skills.length > 1 && (
                    <button type="button" onClick={() => removeSkill(i)}
                      style={{ background: 'none', border: '1px solid #fee2e2', color: '#ef4444', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '0', flexShrink: 0 }}>×</button>
                  )}
                </div>
              ))}

              <button type="button" onClick={addSkill}
                style={{ border: '2px dashed #d1d5db', background: 'none', color: '#6b7280', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
                + Add Skill
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'white', color: '#6b7280', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>← Back</button>
                <button onClick={() => setStep(3)} disabled={!canNext2}
                  style={{ background: canNext2 ? '#4f46e5' : '#d1d5db', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: canNext2 ? 'pointer' : 'not-allowed', fontWeight: '700' }}>
                  Next: Portfolio →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Portfolio ── */}
          {step === 3 && (
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#111827' }}>Portfolio</h2>
              <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '14px' }}>Showcase your previous work (optional but highly recommended)</p>

              {formData.portfolioItems.map((item, i) => (
                <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: '#374151', fontSize: '14px' }}>Project {i + 1}</p>
                    <button type="button" onClick={() => removePortfolio(i)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>×</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Project Title</label>
                      <input style={inputStyle} value={item.title} onChange={e => updatePortfolio(i, 'title', e.target.value)} placeholder="e.g. E-commerce App" />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Project URL</label>
                      <input style={inputStyle} value={item.url} onChange={e => updatePortfolio(i, 'url', e.target.value)} placeholder="https://..." />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ ...labelStyle, fontSize: '12px' }}>Description</label>
                      <input style={inputStyle} value={item.description} onChange={e => updatePortfolio(i, 'description', e.target.value)} placeholder="Brief description of what you built" />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addPortfolio}
                style={{ width: '100%', padding: '12px', border: '2px dashed #d1d5db', borderRadius: '8px', background: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
                + Add Portfolio Item
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} style={{ background: 'white', color: '#6b7280', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>← Back</button>
                <button onClick={() => setStep(4)} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                  Next: Experience →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Experience & Certifications ── */}
          {step === 4 && (
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#111827' }}>Work Experience & Certifications</h2>
              <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: '14px' }}>Optional — helps clients trust your profile</p>

              {/* Work Experience */}
              <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#374151' }}>Work Experience</h3>
              {formData.workExperience.map((exp, i) => (
                <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: '#374151', fontSize: '13px' }}>Experience {i + 1}</p>
                    <button type="button" onClick={() => removeExp(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>×</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[['company', 'Company'], ['role', 'Role/Position'], ['from', 'From (Year)'], ['to', 'To (Year / Present)']].map(([field, placeholder]) => (
                      <div key={field}>
                        <input style={inputStyle} value={exp[field]} onChange={e => updateExp(i, field, e.target.value)} placeholder={placeholder} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addExp}
                style={{ border: '2px dashed #d1d5db', background: 'none', color: '#6b7280', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
                + Add Experience
              </button>

              {/* Certifications */}
              <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#374151' }}>Certifications</h3>
              {formData.certifications.map((cert, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                  <input style={{ ...inputStyle, flex: 2 }} value={cert.name} onChange={e => updateCert(i, 'name', e.target.value)} placeholder="Certificate name" />
                  <input style={{ ...inputStyle, flex: 1 }} value={cert.issuer} onChange={e => updateCert(i, 'issuer', e.target.value)} placeholder="Issuer" />
                  <input style={{ ...inputStyle, flex: 0.6 }} value={cert.year} onChange={e => updateCert(i, 'year', e.target.value)} placeholder="Year" />
                  <button type="button" onClick={() => removeCert(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', flexShrink: 0 }}>×</button>
                </div>
              ))}
              <button type="button" onClick={addCert}
                style={{ border: '2px dashed #d1d5db', background: 'none', color: '#6b7280', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '28px' }}>
                + Add Certification
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(3)} style={{ background: 'white', color: '#6b7280', border: '1px solid #e5e7eb', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>← Back</button>
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ background: submitting ? '#a5b4fc' : '#4f46e5', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px' }}>
                  {submitting ? 'Saving...' : '🎉 Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerSetupPage;