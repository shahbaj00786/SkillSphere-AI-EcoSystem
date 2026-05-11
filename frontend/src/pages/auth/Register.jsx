import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService.js'
import { LOGO, REGISTER_IMG } from '../../constants/images.js'
import '../../styles/auth.css'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await authService.register(formData)

      if (result.success) {
        setSuccess('Registration successful! Please check your email to verify your account.')
        setTimeout(() => navigate('/login'), 3000)
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
          <img src={REGISTER_IMG} alt='Register' />
        </div>

        <h2>Create Account</h2>
        <p>Join SkillSphere as a client or freelancer</p>

        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Full Name</label>
            <input
              type='text'
              name='name'
              placeholder='Enter your full name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder='Minimum 8 characters'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label>I want to join as</label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
            >
              <option value='freelancer'>Freelancer</option>
              <option value='client'>Client</option>
            </select>
          </div>

          <button type='submit' disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className='auth-footer'>
          Already have an account? <Link to='/login'>Login here</Link>
        </div>

      </div>
    </div>
  )
}

export default Register