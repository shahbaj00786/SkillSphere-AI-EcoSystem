const QuickActions = ({ navigate }) => {
  return (
    <div className="quick-actions">

      <h3>Quick Actions</h3>

      <button
        onClick={() => navigate('/freelancer-setup')}
        className="quick-profile-btn"
      >
        ✏️ Update Profile & Skills
      </button>

      <button
        onClick={() => navigate('/gigs')}
        className="quick-gigs-btn"
      >
        🔍 Browse All Gigs
      </button>

    </div>
  )
}

export default QuickActions