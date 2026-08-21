const GigMilestones = ({
  milestones = [],
}) => {
  return (
    <div className="detail-card">

      <div className="section-heading">
        <span>🎯</span>

        <h2>Project Milestones</h2>
      </div>

      {milestones.length === 0 ? (
        <div className="no-milestones">
          No milestones defined yet.
        </div>
      ) : (
        <div className="milestones-list">

          {milestones.map(
            (milestone, index) => (
              <div
                className="milestone-item"
                key={index}
              >

                <div className="milestone-number">
                  {index + 1}
                </div>

                <div className="milestone-info">

                  <h4>
                    {milestone.name}
                  </h4>

                  <p>
                    Due{" "}
                    {milestone.dueDate
                      ? new Date(
                          milestone.dueDate
                        ).toLocaleDateString()
                      : "Not specified"}
                  </p>

                </div>

                <strong>
                  ${milestone.amount}
                </strong>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
};

export default GigMilestones;