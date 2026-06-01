import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/authSlice.js'
import authService from '../../services/authService.js'
import '../../styles/auth.css'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await authService.login(formData)
      if (result.success) {
        dispatch(loginSuccess(result))
        navigate('/dashboard')
      } else {
        setError(result.message || 'Login failed')
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
          <h2>Welcome back</h2>
          <p className="subtitle">Login to your SkillSphere account</p>

          {error && <div className="auth-error">❌ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
            </div>

            <div className="auth-forgot">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login