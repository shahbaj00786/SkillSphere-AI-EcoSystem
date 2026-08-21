import React from 'react';

const BudgetTimelineStep = ({
  formData,
  handleChange,
  canNext,
  setStep,
}) => {
  const invalidBudget =
    formData.budget.min &&
    formData.budget.max &&
    Number(formData.budget.max) <
      Number(formData.budget.min);

  return (
    <div>
      <h2 className="form-section-title">
        Budget & Timeline
      </h2>

      <div className="budget-grid">

        <div className="form-group">
          <label>
            Min Budget ($)
            <span className="required">*</span>
          </label>

          <input
            type="number"
            name="budgetMin"
            value={formData.budget.min}
            onChange={handleChange}
            placeholder="500"
            min="1"
          />
        </div>

        <div className="form-group">
          <label>
            Max Budget ($)
            <span className="required">*</span>
          </label>

          <input
            type="number"
            name="budgetMax"
            value={formData.budget.max}
            onChange={handleChange}
            placeholder="2000"
            min="1"
          />
        </div>

      </div>

      {invalidBudget && (
        <p className="budget-warning">
          ⚠ Max budget must be greater than min budget
        </p>
      )}

      <div className="form-group">
        <label>
          Project Duration
          <span className="required">*</span>
        </label>

        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        >
          <option value="">
            Select duration
          </option>

          <option value="Less than 1 week">
            Less than 1 week
          </option>

          <option value="1-2 weeks">
            1–2 weeks
          </option>

          <option value="2-4 weeks">
            2–4 weeks
          </option>

          <option value="1-3 months">
            1–3 months
          </option>

          <option value="3-6 months">
            3–6 months
          </option>

          <option value="More than 6 months">
            More than 6 months
          </option>
        </select>
      </div>

      <div className="form-actions between-actions">
        <button
          className="secondary-btn"
          onClick={() => setStep(1)}
        >
          ← Back
        </button>

        <button
          className="primary-btn"
          onClick={() => setStep(3)}
          disabled={!canNext}
        >
          Next: Milestones →
        </button>
      </div>
    </div>
  );
};

export default BudgetTimelineStep;