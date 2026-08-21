import { useNavigate } from 'react-router-dom';

const FreelancerProposalCard = ({
  proposal,
  withdrawProposal,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`proposal-card ${proposal.status}`}
    >
      <div className="proposal-card-left">
        <h3>{proposal.title}</h3>

        <p className="proposal-meta">
          Gig:{' '}
          <strong>
            {proposal.gigId?.title || proposal.gigId}
          </strong>
          {' · '}
          {new Date(
            proposal.createdAt
          ).toLocaleDateString()}
        </p>

        <p className="proposal-desc">
          {proposal.description}
        </p>

        <div className="proposal-stats">
          <span>
            💰 <strong>${proposal.bidAmount}</strong>
          </span>

          <span>
            📅 <strong>{proposal.estimatedDays} days</strong>
          </span>
        </div>
      </div>

      <div className="proposal-card-right">
        <span
          className={`status-badge ${proposal.status}`}
        >
          {proposal.status}
        </span>

        {proposal.status === 'pending' && (
          <button
            className="btn-withdraw"
            onClick={() =>
              withdrawProposal(proposal._id)
            }
          >
            Withdraw
          </button>
        )}

        <button
          className="btn-view-gig"
          onClick={() =>
            navigate(
              `/gig/${
                proposal.gigId?._id ||
                proposal.gigId
              }`
            )
          }
        >
          View Gig →
        </button>
      </div>
    </div>
  );
};

export default FreelancerProposalCard;