import { useNavigate } from 'react-router-dom';

const ProposalReviewCard = ({
  proposal,
  selectedGig,
  handleAccept,
  handleReject,
}) => {
  const navigate = useNavigate();

  const freelancer = proposal.freelancerId;

  const handleMessage = () => {
    if (!freelancer?._id) {
      return;
    }

    navigate(
      `/chat?receiverId=${freelancer._id}&name=${encodeURIComponent(
        freelancer.name || 'Freelancer'
      )}`
    );
  };

  return (
    <div className="proposal-review-card">

      <div className="proposal-review-header">
        <div>
          <h4>{proposal.title}</h4>

          <p>
            by{' '}
            <strong>
              {freelancer?.name || 'Freelancer'}
            </strong>
            {' · '}
            {new Date(
              proposal.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`status-badge ${proposal.status}`}
        >
          {proposal.status}
        </span>
      </div>

      <p className="proposal-review-desc">
        {proposal.description}
      </p>

      <div className="proposal-amounts">
        <div className="amount-box">
          <p className="amount-label">
            Bid Amount
          </p>

          <p className="amount-value">
            ${proposal.bidAmount}
          </p>
        </div>

        <div className="amount-box">
          <p className="amount-label">
            Delivery
          </p>

          <p className="amount-value">
            {proposal.estimatedDays}d
          </p>
        </div>
      </div>

      {proposal.status === 'pending' && (
        <div className="proposal-actions">
          <button
            className="btn-accept"
            onClick={() =>
              handleAccept(proposal._id)
            }
          >
            ✓ Accept
          </button>

          <button
            className="btn-reject"
            onClick={() =>
              handleReject(proposal._id)
            }
          >
            ✕ Reject
          </button>

          <button
            className="btn-message"
            onClick={handleMessage}
          >
            💬 Message Freelancer
          </button>
        </div>
      )}

      {proposal.status === 'accepted' && (
        <div className="accepted-actions">

          <button
            className="btn-message"
            onClick={handleMessage}
          >
            💬 Message Freelancer
          </button>

          <button
            className="btn-pay"
            onClick={() =>
              navigate(
                `/payments?gigId=${selectedGig._id}&proposalId=${proposal._id}&freelancerId=${freelancer?._id}&amount=${proposal.bidAmount}`
              )
            }
          >
            💳 Pay Now — ${proposal.bidAmount}
          </button>

        </div>
      )}

    </div>
  );
};

export default ProposalReviewCard;