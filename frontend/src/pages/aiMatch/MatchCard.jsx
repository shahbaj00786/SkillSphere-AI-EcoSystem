import MatchBadge from './MatchBadge.jsx'
import GeneratedProposal from './GeneratedProposal.jsx'

const MatchCard = ({
  match,
  gig,
  navigate,
  generateProposal,
  generatedProposal,
  setGeneratedProposal
}) => {
  const borderColor =
    match.score >= 70
      ? '#10b981'
      : match.score >= 40
      ? '#f59e0b'
      : '#e5e7eb'

  return (
    <div
      className="match-card"
      style={{ borderLeftColor: borderColor }}
    >
      <div className="match-card-content">

        <MatchBadge score={match.score} />

        <div className="match-card-details">

          <div className="match-card-header">
            <h3>{gig.title}</h3>

            <span>
              ${gig.budget?.min}–${gig.budget?.max}
            </span>
          </div>

          <p className="match-card-meta">
            {gig.category?.replace(/-/g, ' ')} · {gig.duration} ·{' '}
            {new Date(gig.createdAt).toLocaleDateString()}
          </p>

          <div className="match-reason">
            <p>
              <strong>Why you match:</strong> {match.reason}
            </p>
          </div>

          {match.skillGap && (
            <div className="match-skill-gap">
              <p>
                <strong>Skill gap:</strong> {match.skillGap}
              </p>
            </div>
          )}

          <div className="required-skills">
            {(gig.requiredSkills || []).map(skill => (
              <span key={skill}>
                {skill}
              </span>
            ))}
          </div>

          <div className="match-actions">

            <button
              onClick={() => navigate(`/gig/${gig._id}`)}
              className="view-apply-btn"
            >
              View & Apply →
            </button>

            <button
              onClick={() => generateProposal(gig._id)}
              className="ai-proposal-btn"
            >
              ✨ AI Write Proposal
            </button>

          </div>

          {generatedProposal?.gigId === gig._id && (
            <GeneratedProposal
              gigId={gig._id}
              generatedProposal={generatedProposal}
              setGeneratedProposal={setGeneratedProposal}
              navigate={navigate}
            />
          )}

        </div>
      </div>
    </div>
  )
}

export default MatchCard