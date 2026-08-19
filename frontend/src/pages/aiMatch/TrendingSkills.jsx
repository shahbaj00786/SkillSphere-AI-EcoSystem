const TrendingSkills = ({ trending }) => {
  return (
    <div className="trending-skills">

      <h3>🔥 Trending Skills</h3>

      {trending.length === 0 ? (
        <p className="trending-loading">
          Loading...
        </p>
      ) : (
        trending.map((t, i) => (
          <div
            key={t.skill}
            className="trending-skill"
          >
            <span className="trending-skill-name">
              <span>#{i + 1}</span>
              {t.skill}
            </span>

            <span
              className={`demand-badge ${t.demand.toLowerCase()}`}
            >
              {t.demand} · {t.count} gigs
            </span>
          </div>
        ))
      )}

    </div>
  )
}

export default TrendingSkills