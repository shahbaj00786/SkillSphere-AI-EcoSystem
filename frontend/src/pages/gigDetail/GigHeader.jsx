const GigHeader = ({ gig }) => {
  return (
    <div className="gig-header-new">

      <div className="gig-header-content">

        <div className="gig-header-tags">
          <span className="category-tag">
            {gig.category?.replace(
              /-/g,
              " "
            )}
          </span>

          <span
            className={`status-tag ${
              gig.status === "open"
                ? "status-open"
                : "status-closed"
            }`}
          >
            ● {gig.status}
          </span>
        </div>

        <h1>{gig.title}</h1>

        <p className="gig-header-subtitle">
          Find the right freelancer for
          this project
        </p>

      </div>

    </div>
  );
};

export default GigHeader;