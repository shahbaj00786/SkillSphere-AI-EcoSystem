import { useNavigate } from 'react-router-dom';

const ClientGigList = ({
  myGigs,
  selectedGig,
  loading,
  fetchGigProposals,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <p className="gigs-list-title">
        Your Gigs
      </p>

      {loading ? (
        <p className="proposals-loading-text">
          Loading gigs...
        </p>
      ) : myGigs.length === 0 ? (
        <div className="empty-state">
          <p>No gigs posted yet.</p>

          <button
            className="btn-primary"
            onClick={() =>
              navigate('/gigs/create')
            }
          >
            Post a Gig
          </button>
        </div>
      ) : (
        myGigs.map((gig) => (
          <div
            key={gig._id}
            className={`gig-item ${
              selectedGig?._id === gig._id
                ? 'active'
                : ''
            }`}
            onClick={() =>
              fetchGigProposals(gig)
            }
          >
            <p className="gig-item-title">
              {gig.title}
            </p>

            <p className="gig-item-meta">
              {gig.category} · $
              {gig.budget?.min}–
              ${gig.budget?.max}
            </p>

            <div className="gig-item-footer">
              <span className="gig-proposals-count">
                {gig.proposals?.length || 0} proposals
              </span>

              <span
                className={`gig-status ${gig.status}`}
              >
                {gig.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClientGigList;