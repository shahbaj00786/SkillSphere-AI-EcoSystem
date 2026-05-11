import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/authSlice.js'
import authService from '../../services/authService.js'
import Navbar from '../../components/common/Navbar.jsx'
import { DASHBOARD_IMG, FREELANCER_IMG, CLIENT_IMG, EMPTY_IMG } from '../../constants/images.js'
import '../../styles/dashboard.css'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await authService.getProfile()
        if (result.success) {
          dispatch(setUser(result.user))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfile()
  }, [])

  return (
    <div className='dashboard-container'>
      <Navbar />
      <div className='dashboard-content'>

        {/* welcome section */}
        <div className='dashboard-welcome'>
          <img src={DASHBOARD_IMG} alt='Dashboard' />
          <div>
            <h2>Welcome back, {user?.name || 'User'}! 👋</h2>
            <p>Here is what is happening on your SkillSphere account today.</p>
            <span className={`role-badge ${user?.role}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* stats cards */}
        <div className='dashboard-cards'>
          <div className='dashboard-card'>
            <img src={FREELANCER_IMG} alt='Gigs' />
            <h3>0</h3>
            <p>Active Gigs</p>
          </div>
          <div className='dashboard-card'>
            <img src={CLIENT_IMG} alt='Proposals' />
            <h3>0</h3>
            <p>Proposals</p>
          </div>
          <div className='dashboard-card'>
            <img src={DASHBOARD_IMG} alt='Earnings' />
            <h3>₹0</h3>
            <p>Total Earnings</p>
          </div>
          <div className='dashboard-card'>
            <img src={FREELANCER_IMG} alt='Reviews' />
            <h3>0</h3>
            <p>Reviews</p>
          </div>
        </div>

        {/* recent activity */}
        <div className='dashboard-section'>
          <h3>Recent Activity</h3>
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <img src={EMPTY_IMG} alt='No activity' style={{ width: '80px' }} />
            <p style={{ color: '#999', marginTop: '10px' }}>No recent activity yet</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard