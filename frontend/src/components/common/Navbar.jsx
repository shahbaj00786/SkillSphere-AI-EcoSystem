import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logoutSuccess } from '../../redux/authSlice.js'
import authService from '../../services/authService.js'
import NotificationBell from './NotificationBell.jsx'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    try { await authService.logout() } catch (e) { console.log(e) }
    dispatch(logoutSuccess())
    navigate('/login')
  }

  const linkStyle = { color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '13px', fontWeight: '500', padding: '5px 8px', borderRadius: '6px', transition: 'background 0.15s' }
  const highlightLink = { ...linkStyle, color: '#a5f3fc', fontWeight: '700' }

  return (
    <nav style={{
      backgroundColor: '#4f46e5',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'visible',
      zIndex: 100,
      height: '56px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>

      {/* Left — Logo */}
      <Link to='/dashboard' style={{ color: 'white', fontSize: '18px', fontWeight: '800', textDecoration: 'none', letterSpacing: '-0.3px', flexShrink: 0 }}>
        SkillSphere
      </Link>

      {/* Center — Nav Links */}
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center', flexWrap: 'nowrap' }}>
        <Link to='/dashboard' style={linkStyle}>Dashboard</Link>
        <Link to='/gigs' style={linkStyle}>Gigs</Link>
        <Link to='/chat' style={linkStyle}>Messages</Link>
        <Link to='/payments' style={linkStyle}>Payments</Link>
        <Link to='/proposals' style={linkStyle}>Proposals</Link>
        <Link to='/disputes' style={linkStyle}>Disputes</Link>

        {/* Freelancer only */}
        {user?.role === 'freelancer' && (
          <>
            <Link to='/ai-match' style={highlightLink}>🤖 AI Match</Link>
            <Link to='/analytics' style={linkStyle}>Analytics</Link>
            <Link to='/reviews' style={linkStyle}>Reviews</Link>
            <Link to='/freelancer-setup' style={linkStyle}>Setup Profile</Link>
          </>
        )}

        {/* Client only */}
        {user?.role === 'client' && (
          <Link to='/gigs/create' style={{ ...linkStyle, color: '#bbf7d0', fontWeight: '700' }}>+ Post Gig</Link>
        )}

        {/* Admin only */}
        {user?.role === 'admin' && (
          <Link to='/admin' style={{ ...linkStyle, color: '#fde68a', fontWeight: '700' }}>Admin</Link>
        )}
      </div>

      {/* Right — Bell + Profile + Logout */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <NotificationBell />
        </div>
        <Link to='/profile' style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '600', background: 'rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '6px' }}>
          {user?.name?.split(' ')[0] || 'Profile'}
        </Link>
        <button onClick={handleLogout} style={{
          backgroundColor: 'white', color: '#4f46e5',
          padding: '5px 14px', borderRadius: '6px',
          cursor: 'pointer', border: 'none',
          fontWeight: '700', fontSize: '13px',
        }}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar