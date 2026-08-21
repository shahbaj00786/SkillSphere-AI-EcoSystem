const GigCard = ({ gig, navigate }) => {
  const openGig = () => {
    navigate(`/gig/${gig._id}`);
  };

  return (
    <div
      className="marketplace-gig-card"
      onClick={openGig}
    >

      <div className="gig-card-top">

        <span className="gig-category">
          {gig.category?.replace(/-/g, " ")}
        </span>

        <span
          className={`gig-status ${
            gig.status === "open"
              ? "open"
              : "closed"
          }`}
        >
          {gig.status}
        </span>

      </div>

      <h3 className="gig-card-title">
        {gig.title}
      </h3>

      <p className="gig-card-description">
        {gig.description?.substring(0, 90)}
        {gig.description?.length > 90
          ? "..."
          : ""}
      </p>

      {gig.requiredSkills?.length > 0 && (
        <div className="gig-card-skills">

          {gig.requiredSkills
            .slice(0, 3)
            .map((skill) => (
              <span
                key={skill}
                className="gig-skill"
              >
                {skill}
              </span>
            ))}

          {gig.requiredSkills.length > 3 && (
            <span className="more-skills">
              +{gig.requiredSkills.length - 3}
            </span>
          )}

        </div>
      )}

      <div className="gig-card-budget">

        <span>
          ${gig.budget?.min}–$
          {gig.budget?.max}
        </span>

        <span>
          {gig.duration}
        </span>

      </div>

      <div className="gig-card-footer">

        <span>
          By {gig.clientId?.name || "Client"}
        </span>

        <span>
          {gig.proposals?.length || 0} proposals
        </span>

      </div>

    </div>
  );
};

export default GigCard;