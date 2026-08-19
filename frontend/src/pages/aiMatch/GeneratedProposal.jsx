const GeneratedProposal = ({
  gigId,
  generatedProposal,
  setGeneratedProposal,
  navigate
}) => {
  return (
    <div className="generated-proposal">

      <div className="generated-proposal-header">
        <p>✨ AI Generated Proposal</p>

        <button onClick={() => setGeneratedProposal(null)}>
          ✕
        </button>
      </div>

      <p className="generated-proposal-title">
        {generatedProposal.title}
      </p>

      <p className="generated-proposal-text">
        {generatedProposal.proposal}
      </p>

      <div className="generated-proposal-details">
        <span>
          💰 Suggested Bid:{' '}
          <strong>${generatedProposal.suggestedBid}</strong>
        </span>

        <span>
          📅 Est. Days:{' '}
          <strong>{generatedProposal.estimatedDays}</strong>
        </span>
      </div>

      <button
        onClick={() =>
          navigate(`/gig/${gigId}`, {
            state: { proposal: generatedProposal }
          })
        }
      >
        Use This Proposal →
      </button>

    </div>
  )
}

export default GeneratedProposal