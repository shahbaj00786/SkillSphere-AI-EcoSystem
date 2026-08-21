const GigSkills = ({ skills = [] }) => {
  return (
    <div className="detail-card">

      <div className="section-heading">
        <span>🛠️</span>

        <h2>Required Skills</h2>
      </div>

      <div className="detail-skills">

        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              className="detail-skill"
              key={index}
            >
              {skill}
            </span>
          ))
        ) : (
          <p>No specific skills mentioned.</p>
        )}

      </div>

    </div>
  );
};

export default GigSkills;