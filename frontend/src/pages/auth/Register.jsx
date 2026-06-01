import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService.js'
import '../../styles/auth.css'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'freelancer' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      const result = await authService.register(formData)
      if (result.success) {
        setSuccess('Account created! Check your email to verify.')
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setError(result.message || 'Registration failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-wrapper">

        <div className="auth-logo">
          <div className="auth-logo-inner">
            <div className="auth-logo-icon">💼</div>
            <span className="auth-logo-text">SkillSphere</span>
          </div>
          <p className="auth-logo-sub">Intelligent Freelance Ecosystem</p>
        </div>

        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="subtitle">Join as a client or freelancer</p>

          {error && <div className="auth-error">❌ {error}</div>}
          {success && <div className="auth-success">✅ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Shahbaj Hussain" required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters" required />
            </div>

            <div className="form-group">
              <label>Join as</label>
              <div className="role-grid">
                {[['freelancer','👨‍💻'], ['client','🏢']].map(([r, icon]) => (
                  <div key={r} className={`role-card ${formData.role === r ? 'active' : ''}`}
                    onClick={() => setFormData(p => ({ ...p, role: r }))}>
                    <div className="role-icon">{icon}</div>
                    <div className="role-label">{r}</div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Register