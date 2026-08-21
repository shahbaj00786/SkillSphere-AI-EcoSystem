const BasicInfoStep = ({
  formData,
  updateBasicInfo,
  updateLocation,
  pricingTypes,
  canNext,
  setStep,
}) => {
  return (
    <div>
      <h2>Basic Information</h2>

      <div className="setup-field">
        <label>
          Bio / About You <span>*</span>
        </label>

        <textarea
          rows="4"
          value={formData.bio}
          onChange={(e) =>
            updateBasicInfo('bio', e.target.value)
          }
          placeholder="Tell clients about yourself, your expertise, and what makes you unique..."
        />
      </div>

      <div className="setup-grid">
        <div className="setup-field">
          <label>
            Hourly Rate ($) <span>*</span>
          </label>

          <input
            type="number"
            min="1"
            value={formData.hourlyRate}
            onChange={(e) =>
              updateBasicInfo(
                'hourlyRate',
                e.target.value
              )
            }
            placeholder="e.g. 25"
          />
        </div>

        <div className="setup-field">
          <label>Pricing Type</label>

          <select
            value={formData.pricingType}
            onChange={(e) =>
              updateBasicInfo(
                'pricingType',
                e.target.value
              )
            }
          >
            {pricingTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() +
                  type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="setup-location-grid">
        {['city', 'state', 'country'].map(
          (field) => (
            <div className="setup-field" key={field}>
              <label>
                {field.charAt(0).toUpperCase() +
                  field.slice(1)}

                {field === 'country' && (
                  <span> *</span>
                )}
              </label>

              <input
                value={formData.location[field]}
                onChange={(e) =>
                  updateLocation(
                    field,
                    e.target.value
                  )
                }
                placeholder={
                  field.charAt(0).toUpperCase() +
                  field.slice(1)
                }
              />
            </div>
          )
        )}
      </div>

      <div className="setup-actions right">
        <button
          className="setup-primary-btn"
          onClick={() => setStep(2)}
          disabled={!canNext}
        >
          Next: Skills →
        </button>
      </div>
    </div>
  );
};

export default BasicInfoStep;