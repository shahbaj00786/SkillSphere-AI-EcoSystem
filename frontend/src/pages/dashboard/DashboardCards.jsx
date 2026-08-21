const DashboardCards = ({ cards, loading }) => {
  return (
    <div className="dashboard-cards">
      {cards.map((card, i) => (
        <div className="dashboard-card" key={i}>
          <span className="dashboard-card-icon">
            {card.icon}
          </span>

          <h3>
            {loading ? '...' : card.value}
          </h3>

          <p>
            {card.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default DashboardCards