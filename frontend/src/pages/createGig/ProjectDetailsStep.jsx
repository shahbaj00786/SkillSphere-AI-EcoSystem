import React from 'react';

const ProjectDetailsStep = ({
  formData,
  handleChange,
  categories,
  canNext,
  setStep,
}) => {
  return (
    <div>
      <h2 className="form-section-title">
        Project Details
      </h2>

      <div className="form-group">
        <label>
          Project Title
          <span className="required">*</span>
        </label>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Build a React e-commerce website"
        />
      </div>

      <div className="form-group">
        <label>
          Category
          <span className="required">*</span>
        </label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">
            Select a category
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (letter) =>
                  letter.toUpperCase()
                )}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>
          Description
          <span className="required">*</span>
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your project in detail — requirements, goals, deliverables..."
        />
      </div>

      <div className="form-group">
        <label>Required Skills</label>

        <input
          name="requiredSkills"
          value={formData.requiredSkills}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, MongoDB (comma separated)"
        />

        <p className="field-hint">
          Separate skills with commas
        </p>
      </div>

      <div className="form-actions next-action">
        <button
          className="primary-btn"
          onClick={() => setStep(2)}
          disabled={!canNext}
        >
          Next: Budget & Timeline →
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailsStep;