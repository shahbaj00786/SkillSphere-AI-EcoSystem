const RecentActivity = ({ activity, loading, emptyImage }) => {
  return (
    <div className="dashboard-section">
      <h3>Recent Activity</h3>

      {loading ? (
        <p className="activity-loading">
          Loading...
        </p>
      ) : activity.length === 0 ? (
        <div className="activity-empty">
          <img
            src={emptyImage}
            alt="No activity"
          />

          <p>
            No recent activity yet
          </p>
        </div>
      ) : (
        <div className="activity-list">
          {activity.map((a, i) => (
            <div className="activity-item" key={i}>
              <span className="activity-icon">
                {a.icon}
              </span>

              <div>
                <p className="activity-text">
                  {a.text}
                </p>

                <p className="activity-time">
                  {a.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentActivity