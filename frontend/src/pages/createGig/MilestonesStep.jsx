import React from 'react';

const MilestonesStep = ({
  formData,
  setStep,
  addMilestone,
  removeMilestone,
  updateMilestone,
  handleSubmit,
  submitting,
}) => {
  return (
    <form onSubmit={handleSubmit}>

      <h2 className="form-section-title milestone-title">
        Milestones
      </h2>

      <p className="milestone-description">
        Break your project into milestones for easier
        tracking and payment. (Optional)
      </p>

      {formData.milestones.map((milestone, index) => (
        <div
          className="milestone-card"
          key={index}
        >
          <div className="milestone-header">
            <p>
              Milestone {index + 1}
            </p>

            <button
              type="button"
              className="remove-milestone"
              onClick={() => removeMilestone(index)}
            >
              ×
            </button>
          </div>

          <div className="milestone-grid">

            <div className="form-group">
              <label>Name</label>

              <input
                value={milestone.name}
                onChange={(e) =>
                  updateMilestone(
                    index,
                    'name',
                    e.target.value
                  )
                }
                placeholder="e.g. Design mockups"
              />
            </div>

            <div className="form-group">
              <label>Amount ($)</label>

              <input
                type="number"
                value={milestone.amount}
                onChange={(e) =>
                  updateMilestone(
                    index,
                    'amount',
                    e.target.value
                  )
                }
                placeholder="500"
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>

              <input
                type="date"
                value={milestone.dueDate}
                onChange={(e) =>
                  updateMilestone(
                    index,
                    'dueDate',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <input
                value={milestone.description}
                onChange={(e) =>
                  updateMilestone(
                    index,
                    'description',
                    e.target.value
                  )
                }
                placeholder="Brief description"
              />
            </div>

          </div>
        </div>
      ))}

      <button
        type="button"
        className="add-milestone-btn"
        onClick={addMilestone}
      >
        + Add Milestone
      </button>

      <div className="project-summary">
        <p className="summary-title">
          Project Summary
        </p>

        <div className="summary-grid">

          <div>
            <p className="summary-label">
              Category
            </p>
            <p className="summary-value">
              {formData.category}
            </p>
          </div>

          <div>
            <p className="summary-label">
              Budget
            </p>
            <p className="summary-value">
              ${formData.budget.min}–
              ${formData.budget.max}
            </p>
          </div>

          <div>
            <p className="summary-label">
              Duration
            </p>
            <p className="summary-value">
              {formData.duration}
            </p>
          </div>

        </div>
      </div>

      <div className="form-actions between-actions">

        <button
          type="button"
          className="secondary-btn"
          onClick={() => setStep(2)}
        >
          ← Back
        </button>

        <button
          type="submit"
          className="primary-btn submit-btn"
          disabled={submitting}
        >
          {submitting
            ? 'Posting...'
            : '🚀 Post Gig'}
        </button>

      </div>
    </form>
  );
};

export default MilestonesStep;