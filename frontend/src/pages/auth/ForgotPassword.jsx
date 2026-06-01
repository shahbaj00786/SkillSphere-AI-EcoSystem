import { useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '../../services/authService.js'
import { LOGO, FORGOT_IMG } from '../../constants/images.js'
import '../../styles/auth.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await authService.forgotPassword({ email })
      if (result.success) {
        setSuccess('Password reset link sent to your email!')
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.log(error)
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className='auth-container'>
      <div className='auth-box'>
        <div className='auth-logo'>
          <img src={LOGO} alt='SkillSphere Logo' />
        </div>

        <div className='auth-image'>
          <img src={FORGOT_IMG} alt='Forgot Password' />
        </div>

        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset link</p>

        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type='submit' disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className='auth-footer'>
          Remember your password? <Link to='/login'>Login here</Link>
        </div>

      </div>
    </div>
  )
  
}

export default ForgotPassword