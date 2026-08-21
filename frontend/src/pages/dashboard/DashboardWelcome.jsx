const DashboardWelcome = ({ user, dashboardImage }) => {
  return (
    <div className="dashboard-welcome">
      <img src={dashboardImage} alt="Dashboard" />

      <div>
        <h2>
          Welcome back, {user?.name || 'User'}! 👋
        </h2>

        <p>
          Here is what is happening on your SkillSphere account today.
        </p>

        <span className={`role-badge ${user?.role}`}>
          {user?.role}
        </span>
      </div>
    </div>
  )
}

export default DashboardWelcome