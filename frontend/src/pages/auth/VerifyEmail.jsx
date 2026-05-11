import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../services/api.js'
import { LOGO, VERIFY_IMG } from '../../constants/images.js'
import '../../styles/auth.css'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState('Verifying your email...')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`)
        if (response.data.success) {
          setSuccess(true)
          setMessage('Email verified successfully! You can now login.')
        } else {
          setMessage(response.data.message)
        }
      } catch (error) {
        console.log(error)
        setMessage('Something went wrong. Please try again.')
      }
    }

    if (token) {
      verify()
    } else {
      setMessage('Invalid verification link.')
    }
  }, [token])

  return (
    <div className='auth-container'>
      <div className='auth-box'>

        <div className='auth-logo'>
          <img src={LOGO} alt='SkillSphere Logo' />
        </div>

        <div className='auth-image'>
          <img src={VERIFY_IMG} alt='Verify Email' />
        </div>

        <h2>Email Verification</h2>

        {success
          ? <p className='success'>{message}</p>
          : <p className='error'>{message}</p>
        }

        <div className='auth-footer'>
          <Link to='/login'>Go to Login</Link>
        </div>

      </div>
    </div>
  )
}

export default VerifyEmail