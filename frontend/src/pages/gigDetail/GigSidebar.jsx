const GigSidebar = ({
  gig,
  userRole,
  onMessageClient,
  onSubmitProposal,
}) => {
  const client =
    gig.clientId || {};

  const freelancer =
    gig.selectedProposal?.freelancerId;

  return (
    <aside className="gig-detail-sidebar">

      {/* BUDGET */}

      <div className="sidebar-card budget-sidebar">

        <p className="sidebar-label">
          PROJECT BUDGET
        </p>

        <h2>
          ${gig.budget?.min}
          <span> - </span>
          ${gig.budget?.max}
        </h2>

        <div className="duration-box">
          <span>⏱️</span>

          <div>
            <small>Estimated duration</small>
            <strong>
              {gig.duration || "Flexible"}
            </strong>
          </div>
        </div>

      </div>

      {/* USER INFO */}

      <div className="sidebar-card">

        <p className="sidebar-label">
          {userRole === "client"
            ? "ASSIGNED FREELANCER"
            : "ABOUT THE CLIENT"}
        </p>

        {userRole === "client" ? (
          freelancer ? (
            <div className="person-info">

              <div className="person-avatar">
                {freelancer.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {freelancer.name}
                </strong>

                <p>
                  Freelancer
                </p>
              </div>

            </div>
          ) : (
            <p className="muted-text">
              No freelancer assigned yet.
            </p>
          )
        ) : (
          <div className="person-info">

            <div className="person-avatar">
              {client.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {client.name ||
                  "Client"}
              </strong>

              <p>
                {client.email ||
                  "Client"}
              </p>
            </div>

          </div>
        )}

      </div>

      {/* ACTIONS */}

      {userRole === "freelancer" && (
        <div className="sidebar-actions">

          <button
            className="primary-action"
            onClick={onSubmitProposal}
          >
            ✉️ Submit a Proposal
          </button>

          <button
            className="secondary-action"
            onClick={onMessageClient}
          >
            💬 Message Client
          </button>

        </div>
      )}

      {userRole === "client" && (
        <div className="client-action-info">
          <span>💡</span>

          <p>
            Review freelancer proposals
            to assign the best candidate
            for this project.
          </p>
        </div>
      )}

    </aside>
  );
};

export default GigSidebar;