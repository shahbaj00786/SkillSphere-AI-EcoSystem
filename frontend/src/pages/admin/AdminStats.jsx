const AdminStats = ({ stats }) => {
  return (
    <div className="stats-section">
      <div className="stats-grid">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
          <p className="stat-detail">Active: {stats.activeUsers}</p>
        </div>

        <div className="stat-box">
          <h3>Suspended Users</h3>
          <p className="stat-number">{stats.suspendedUsers}</p>
          <p className="stat-detail">Inactive accounts</p>
        </div>

        <div className="stat-box">
          <h3>Total Gigs</h3>
          <p className="stat-number">{stats.totalGigs}</p>
          <p className="stat-detail">Active projects</p>
        </div>

        <div className="stat-box">
          <h3>Completed Payments</h3>
          <p className="stat-number">{stats.totalPayments}</p>
          <p className="stat-detail">
            Revenue: ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminStats