import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logoutSuccess } from '../../redux/authSlice.js'
import authService from '../../services/authService.js'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.log(error)
    }
    dispatch(logoutSuccess())
    navigate('/login')
  }

  return (
    <nav style={{
      backgroundColor: '#4f46e5',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to='/dashboard' style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none' }}>
        SkillSphere
      </Link>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to='/dashboard' style={{ color: 'white' }}>Dashboard</Link>
        <Link to='/gigs' style={{ color: 'white' }}>Gigs</Link>
        <Link to='/chat' style={{ color: 'white' }}>Messages</Link>
        <Link to='/payments' style={{ color: 'white' }}>Payments</Link>
        {user?.role === 'freelancer' && (
          <Link to='/reviews' style={{ color: 'white' }}>Reviews</Link>
        )}
        {user?.role === 'admin' && (
          <Link to='/admin' style={{ color: 'white' }}>Admin</Link>
        )}
        <Link to='/profile' style={{ color: 'white' }}>{user?.name || 'Profile'}</Link>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'white',
            color: '#4f46e5',
            padding: '6px 14px',
            width: 'auto',
            borderRadius: '5px',
            cursor: 'pointer',
            border: 'none'
          }}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar