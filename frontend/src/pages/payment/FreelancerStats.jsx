const FreelancerStats = ({ stats }) => {
  return (
    <div className="stats-grid">

      <div className="stat-card">
        <p className="stat-label">
          Total Earnings
        </p>

        <p className="stat-value green">
          $
          {stats.totalEarnings?.toFixed(2) ||
            '0.00'}
        </p>
      </div>

      <div className="stat-card">
        <p className="stat-label">
          Completed Payments
        </p>

        <p className="stat-value indigo">
          {stats.completedPayments || 0}
        </p>
      </div>

      <div className="stat-card">
        <p className="stat-label">
          Pending Amount
        </p>

        <p className="stat-value amber">
          $
          {stats.pendingAmount?.toFixed(2) ||
            '0.00'}
        </p>
      </div>

    </div>
  );
};

export default FreelancerStats;