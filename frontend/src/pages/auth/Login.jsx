import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess, setLoading, setError } from '../../redux/authSlice.js'
import authService from '../../services/authService.js'
import { LOGO, LOGIN_IMG } from '../../constants/images.js'
import '../../styles/auth.css'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setErrorMsg] = useState('')
  const [loading, setLoadingState] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingState(true)
    setErrorMsg('')

    try {
      const result = await authService.login(formData)

      if (result.success) {
        dispatch(loginSuccess(result))
        navigate('/dashboard')
      } else {
        setErrorMsg(result.message)
      }
    } catch (error) {
      console.log(error)
      setErrorMsg('Something went wrong. Please try again.')
    }

    setLoadingState(false)
  }

  return (
    <div className='auth-container'>
      <div className='auth-box'>

        <div className='auth-logo'>
          <img src={LOGO} alt='SkillSphere Logo' />
        </div>

        <div className='auth-image'>
          <img src={LOGIN_IMG} alt='Login' />
        </div>

        <h2>Welcome Back</h2>
        <p>Login to your SkillSphere account</p>

        {error && <p className='error'>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              name='email'
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Enter your password'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '14px' }}>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>

          <button type='submit' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='auth-footer'>
          Don't have an account? <Link to='/register'>Register here</Link>
        </div>

      </div>
    </div>
  )
}

export default Login