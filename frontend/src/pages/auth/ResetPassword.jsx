import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import authService from '../../services/authService.js'
import { LOGO, RESET_IMG } from '../../constants/images.js'
import '../../styles/auth.css'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await authService.resetPassword({ token, password })
      if (result.success) {
        setSuccess('Password reset successfully!')
        setTimeout(() => navigate('/login'), 2000)
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
          <img src={RESET_IMG} alt='Reset Password' />
        </div>

        <h2>Reset Password</h2>
        <p>Enter your new password below</p>

        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>New Password</label>
            <input
              type='password'
              placeholder='Minimum 8 characters'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type='submit' disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className='auth-footer'>
          <Link to='/login'>Back to Login</Link>
        </div>

      </div>
    </div>
  )
}

export default ResetPassword