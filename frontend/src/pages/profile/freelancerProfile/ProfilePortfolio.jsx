const ProfilePortfolio = ({ portfolio }) => {
  if (!portfolio?.length) {
    return null;
  }

  return (
    <div className="profile-section">
      <h3>Portfolio</h3>

      <div className="profile-portfolio">
        {portfolio.map((item, idx) => (
          <div
            key={idx}
            className="portfolio-card"
          >
            <p className="portfolio-title">
              {item.title}
            </p>

            <p className="portfolio-description">
              {item.description}
            </p>

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="portfolio-link"
              >
                View Project →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePortfolio;