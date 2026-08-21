const GigOverview = ({ description }) => {
  return (
    <div className="detail-card">

      <div className="section-heading">
        <span>📋</span>

        <h2>About this project</h2>
      </div>

      <p className="project-description">
        {description}
      </p>

    </div>
  );
};

export default GigOverview;