import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../../redux/authSlice.js'
import authService from '../../services/authService.js'
import api from '../../services/api.js'
import Navbar from '../../components/common/Navbar.jsx'
import { DEFAULT_AVATAR, PROFILE_IMG, PORTFOLIO_IMG, RESUME_IMG } from '../../constants/images.js'
import '../../styles/profile.css'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [freelancerData, setFreelancerData] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ name: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await api.get('/users/me')
        if (result.data.success) {
          dispatch(setUser(result.data.user))
          setFormData({ name: result.data.user.name })
          setFreelancerData(result.data.roleData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfile()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const result = await api.put('/users/me', formData)
      if (result.data.success) {
        dispatch(setUser(result.data.user))
        setMessage('Profile updated successfully!')
        setEditMode(false)
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <div className='profile-container'>
      <Navbar />
      <div className='profile-content'>

        {/* profile header */}
        <div className='profile-header'>
          <img
            src={user?.avatar || DEFAULT_AVATAR}
            alt='Profile'
          />
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <p>
              <span className={`role-badge ${user?.role}`}
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: '#e0e7ff',
                  color: '#4f46e5'
                }}>
                {user?.role}
              </span>
            </p>
          </div>
        </div>

        {/* basic info */}
        <div className='profile-section'>
          <h3>
            <img src={PROFILE_IMG} alt='' style={{ width: '22px', marginRight: '8px', verticalAlign: 'middle' }} />
            Basic Information
          </h3>

          {message && <p className='success'>{message}</p>}

          {editMode ? (
            <form className='profile-form' onSubmit={handleUpdate}>
              <label>Full Name</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type='submit' className='btn-small' disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type='button'
                  className='btn-small btn-danger'
                  onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className='info-row'>
                <span>Full Name</span>
                <span>{user?.name}</span>
              </div>
              <div className='info-row'>
                <span>Email</span>
                <span>{user?.email}</span>
              </div>
              <div className='info-row'>
                <span>Role</span>
                <span>{user?.role}</span>
              </div>
              <div className='info-row'>
                <span>Email Verified</span>
                <span>{user?.isVerified ? '✅ Verified' : '❌ Not Verified'}</span>
              </div>
              <div className='info-row'>
                <span>Member Since</span>
                <span>{new Date(user?.createdAt).toDateString()}</span>
              </div>
              <button
                className='btn-small'
                style={{ marginTop: '14px', width: 'auto', padding: '8px 20px' }}
                onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* freelancer skills */}
        {user?.role === 'freelancer' && freelancerData && (
          <>
            <div className='profile-section'>
              <h3>
                <img src={RESUME_IMG} alt='' style={{ width: '22px', marginRight: '8px', verticalAlign: 'middle' }} />
                Skills
              </h3>
              <div>
                {freelancerData.skills?.length > 0
                  ? freelancerData.skills.map((skill, i) => (
                    <span key={i} className='skill-tag'>
                      {skill.name} — {skill.proficiencyLevel}
                    </span>
                  ))
                  : <p style={{ color: '#999' }}>No skills added yet</p>
                }
              </div>
            </div>

            <div className='profile-section'>
              <h3>
                <img src={PORTFOLIO_IMG} alt='' style={{ width: '22px', marginRight: '8px', verticalAlign: 'middle' }} />
                Portfolio
              </h3>
              {freelancerData.portfolioItems?.length > 0
                ? freelancerData.portfolioItems.map((item, i) => (
                  <div key={i} className='portfolio-item'>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    {item.url && <a href={item.url} target='_blank' rel='noreferrer'>View Project →</a>}
                  </div>
                ))
                : <p style={{ color: '#999' }}>No portfolio items added yet</p>
              }
            </div>

            <div className='profile-section'>
              <h3>Availability</h3>
              {freelancerData.availabilitySlots?.length > 0
                ? freelancerData.availabilitySlots.map((slot, i) => (
                  <div key={i} className='info-row'>
                    <span>{slot.date}</span>
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                ))
                : <p style={{ color: '#999' }}>No availability slots added yet</p>
              }
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Profile