const MatchSort = ({ matches, sortBy, setSortBy }) => {
  return (
    <div className="match-sort">
      <span>
        <strong>{matches.length}</strong> AI-curated matches
      </span>

      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
      >
        <option value="score">Best Match First</option>
        <option value="budget">Highest Budget</option>
        <option value="recent">Most Recent</option>
      </select>
    </div>
  )
}

export default MatchSort