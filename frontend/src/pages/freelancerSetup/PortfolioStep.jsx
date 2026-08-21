const PortfolioStep = ({
  portfolioItems,
  addPortfolio,
  removePortfolio,
  updatePortfolio,
  setStep,
}) => {
  return (
    <div>
      <h2>Portfolio</h2>

      <p className="setup-description">
        Showcase your previous work (optional but
        highly recommended)
      </p>

      {portfolioItems.map((item, index) => (
        <div
          className="portfolio-item"
          key={index}
        >
          <div className="item-header">
            <p>Project {index + 1}</p>

            <button
              type="button"
              className="remove-text-btn"
              onClick={() => removePortfolio(index)}
            >
              ×
            </button>
          </div>

          <div className="portfolio-grid">
            <div className="setup-field">
              <label>Project Title</label>

              <input
                value={item.title}
                onChange={(e) =>
                  updatePortfolio(
                    index,
                    'title',
                    e.target.value
                  )
                }
                placeholder="e.g. E-commerce App"
              />
            </div>

            <div className="setup-field">
              <label>Project URL</label>

              <input
                value={item.url}
                onChange={(e) =>
                  updatePortfolio(
                    index,
                    'url',
                    e.target.value
                  )
                }
                placeholder="https://..."
              />
            </div>

            <div className="setup-field full-width">
              <label>Description</label>

              <input
                value={item.description}
                onChange={(e) =>
                  updatePortfolio(
                    index,
                    'description',
                    e.target.value
                  )
                }
                placeholder="Brief description of what you built"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="add-item-btn full-add-btn"
        onClick={addPortfolio}
      >
        + Add Portfolio Item
      </button>

      <div className="setup-actions">
        <button
          className="setup-secondary-btn"
          onClick={() => setStep(2)}
        >
          ← Back
        </button>

        <button
          className="setup-primary-btn"
          onClick={() => setStep(4)}
        >
          Next: Experience →
        </button>
      </div>
    </div>
  );
};

export default PortfolioStep;