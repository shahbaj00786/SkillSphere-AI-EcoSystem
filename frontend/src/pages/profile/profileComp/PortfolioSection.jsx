import { PORTFOLIO_IMG } from "../../../constants/images.js";

const PortfolioSection = ({
  portfolio = [],
  editMode,
  onChange,
}) => {

  const addPortfolio = () => {

    onChange([
      ...portfolio,
      {
        title: "",
        description: "",
        url: "",
      },
    ]);
  };

  const updatePortfolio = (
    index,
    field,
    value
  ) => {

    const updated = [...portfolio];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  const removePortfolio = (index) => {

    onChange(
      portfolio.filter(
        (_, i) => i !== index
      )
    );
  };

  return (
    <section className="profile-section">

      <div className="section-heading">

        <div className="section-title">

          <img
            src={PORTFOLIO_IMG}
            alt=""
          />

          <h3>Portfolio</h3>

        </div>

      </div>

      {editMode ? (

        <div className="editor-box">

          {portfolio.map(
            (item, index) => (

              <div
                className="portfolio-edit-card"
                key={index}
              >

                <input
                  type="text"
                  placeholder="Project title"
                  value={
                    item.title || ""
                  }
                  onChange={(e) =>
                    updatePortfolio(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                />

                <textarea
                  placeholder="Project description"
                  value={
                    item.description || ""
                  }
                  onChange={(e) =>
                    updatePortfolio(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                />

                <input
                  type="url"
                  placeholder="Project URL"
                  value={
                    item.url || ""
                  }
                  onChange={(e) =>
                    updatePortfolio(
                      index,
                      "url",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="remove-project-btn"
                  onClick={() =>
                    removePortfolio(index)
                  }
                >
                  Remove Project
                </button>

              </div>
            )
          )}

          <button
            type="button"
            className="add-btn"
            onClick={addPortfolio}
          >
            + Add Project
          </button>

        </div>

      ) : (

        portfolio.length > 0 ? (

          <div className="portfolio-list">

            {portfolio.map(
              (item, index) => (

                <div
                  className="portfolio-item"
                  key={index}
                >

                  <h4>
                    {item.title}
                  </h4>

                  <p>
                    {item.description}
                  </p>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Project →
                    </a>
                  )}

                </div>
              )
            )}

          </div>

        ) : (

          <div className="empty-state">
            No portfolio items added yet.
          </div>

        )
      )}

    </section>
  );
};

export default PortfolioSection;