import React from "react";

const ProposalForm = ({
  proposal,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="proposal-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="proposal-modal">

        {/* HEADER */}

        <div className="proposal-modal-header">
          <div>
            <h2>Submit Proposal</h2>

            <p>
              Tell the client why you're the right
              person for this project.
            </p>
          </div>

          <button
            type="button"
            className="proposal-close"
            onClick={onCancel}
            aria-label="Close proposal form"
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={onSubmit}>

          {/* TITLE */}

          <div className="proposal-field">
            <label htmlFor="proposal-title">
              Proposal Title
            </label>

            <input
              id="proposal-title"
              type="text"
              name="title"
              placeholder="e.g. Full Stack Web Developer"
              value={proposal.title}
              onChange={onChange}
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="proposal-field">
            <label htmlFor="proposal-description">
              Your Proposal
            </label>

            <textarea
              id="proposal-description"
              name="description"
              placeholder="Describe your approach, experience and how you will complete this project..."
              value={proposal.description}
              onChange={onChange}
              rows={6}
              required
            />
          </div>

          {/* BID + DAYS */}

          <div className="proposal-form-grid">

            <div className="proposal-field">
              <label htmlFor="proposal-bid">
                Bid Amount ($)
              </label>

              <input
                id="proposal-bid"
                type="number"
                name="bidAmount"
                placeholder="500"
                min="1"
                value={proposal.bidAmount}
                onChange={onChange}
                required
              />
            </div>

            <div className="proposal-field">
              <label htmlFor="proposal-days">
                Estimated Completion
              </label>

              <input
                id="proposal-days"
                type="number"
                name="estimatedDays"
                placeholder="7"
                min="1"
                value={proposal.estimatedDays}
                onChange={onChange}
                required
              />
            </div>

          </div>

          {/* BUTTONS */}

          <div className="proposal-form-actions">

            <button
              type="button"
              className="proposal-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="proposal-submit"
            >
              ✉ Send Proposal
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ProposalForm;