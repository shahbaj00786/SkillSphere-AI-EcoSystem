const MatchBadge = ({ score }) => {
  const color =
    score >= 70
      ? '#10b981'
      : score >= 40
      ? '#f59e0b'
      : '#6b7280'

  const label =
    score >= 70
      ? 'Great Match'
      : score >= 40
      ? 'Good Match'
      : 'Partial Match'

  return (
    <div className="match-badge">
      <div className="match-badge-circle">
        <svg viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />

          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${score} 100`}
            strokeLinecap="round"
          />
        </svg>

        <span
          className="match-badge-score"
          style={{ color }}
        >
          {score}%
        </span>
      </div>

      <span
        className="match-badge-label"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  )
}

export default MatchBadge