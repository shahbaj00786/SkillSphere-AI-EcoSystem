const ExperienceStep = ({
  workExperience,
  certifications,
  addExperience,
  removeExperience,
  updateExperience,
  addCertification,
  removeCertification,
  updateCertification,
  setStep,
  handleSubmit,
  submitting,
}) => {
  return (
    <div>
      <h2>
        Work Experience & Certifications
      </h2>

      <p className="setup-description">
        Optional — helps clients trust your profile
      </p>

      {/* EXPERIENCE */}

      <h3 className="setup-subheading">
        Work Experience
      </h3>

      {workExperience.map((experience, index) => (
        <div
          className="experience-item"
          key={index}
        >
          <div className="item-header">
            <p>Experience {index + 1}</p>

            <button
              type="button"
              className="remove-text-btn"
              onClick={() =>
                removeExperience(index)
              }
            >
              ×
            </button>
          </div>

          <div className="experience-grid">
            {[
              ['company', 'Company'],
              ['role', 'Role/Position'],
              ['from', 'From (Year)'],
              ['to', 'To (Year / Present)'],
            ].map(([field, placeholder]) => (
              <input
                key={field}
                value={experience[field]}
                onChange={(e) =>
                  updateExperience(
                    index,
                    field,
                    e.target.value
                  )
                }
                placeholder={placeholder}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="add-item-btn"
        onClick={addExperience}
      >
        + Add Experience
      </button>

      {/* CERTIFICATIONS */}

      <h3 className="setup-subheading certification-heading">
        Certifications
      </h3>

      {certifications.map((cert, index) => (
        <div
          className="certification-row"
          key={index}
        >
          <input
            value={cert.name}
            onChange={(e) =>
              updateCertification(
                index,
                'name',
                e.target.value
              )
            }
            placeholder="Certificate name"
          />

          <input
            value={cert.issuer}
            onChange={(e) =>
              updateCertification(
                index,
                'issuer',
                e.target.value
              )
            }
            placeholder="Issuer"
          />

          <input
            value={cert.year}
            onChange={(e) =>
              updateCertification(
                index,
                'year',
                e.target.value
              )
            }
            placeholder="Year"
          />

          <button
            type="button"
            className="remove-text-btn"
            onClick={() =>
              removeCertification(index)
            }
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        className="add-item-btn"
        onClick={addCertification}
      >
        + Add Certification
      </button>

      <div className="setup-actions">
        <button
          className="setup-secondary-btn"
          onClick={() => setStep(3)}
        >
          ← Back
        </button>

        <button
          className="setup-primary-btn complete-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? 'Saving...'
            : '🎉 Complete Setup'}
        </button>
      </div>
    </div>
  );
};

export default ExperienceStep;