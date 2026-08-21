const GigMainContent = ({ gig }) => {
  return (
    <div className="gig-main">

      <div className="gig-description-section">
        <h2>Description</h2>
        <p>{gig.description}</p>
      </div>

      <div className="gig-skills">
        <h3>Required Skills</h3>

        <div className="skills-list">
          {gig.requiredSkills?.map((skill, idx) => (
            <span
              key={idx}
              className="skill-badge"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="gig-milestones">
        <h3>Milestones</h3>

        {gig.milestones?.map((milestone, idx) => (
          <div
            key={idx}
            className="milestone"
          >
            <p className="milestone-name">
              {milestone.name}
            </p>

            <p className="milestone-amount">
              ${milestone.amount}
            </p>

            <p className="milestone-date">
              {new Date(
                milestone.dueDate
              ).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GigMainContent;