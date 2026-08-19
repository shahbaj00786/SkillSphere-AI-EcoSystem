const MatchError = ({ error, fetchMatches }) => {
  return (
    <div className="match-error">
      ❌ {error}

      <button onClick={fetchMatches}>
        Retry
      </button>
    </div>
  )
}

export default MatchError