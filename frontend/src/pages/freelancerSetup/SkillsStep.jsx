const SkillsStep = ({
  skills,
  skillLevels,
  addSkill,
  removeSkill,
  updateSkill,
  canNext,
  setStep,
}) => {
  return (
    <div>
      <h2>Your Skills</h2>

      <p className="setup-description">
        Add your skills and proficiency levels
      </p>

      {skills.map((skill, index) => (
        <div className="skill-row" key={index}>
          <div className="setup-field skill-name">
            {index === 0 && (
              <label>Skill Name</label>
            )}

            <input
              value={skill.name}
              onChange={(e) =>
                updateSkill(
                  index,
                  'name',
                  e.target.value
                )
              }
              placeholder="e.g. React, Figma, Node.js"
            />
          </div>

          <div className="setup-field skill-level">
            {index === 0 && (
              <label>Level</label>
            )}

            <select
              value={skill.proficiencyLevel}
              onChange={(e) =>
                updateSkill(
                  index,
                  'proficiencyLevel',
                  e.target.value
                )
              }
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() +
                    level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {skills.length > 1 && (
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeSkill(index)}
            >
              ×
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="add-item-btn"
        onClick={addSkill}
      >
        + Add Skill
      </button>

      <div className="setup-actions">
        <button
          className="setup-secondary-btn"
          onClick={() => setStep(1)}
        >
          ← Back
        </button>

        <button
          className="setup-primary-btn"
          onClick={() => setStep(3)}
          disabled={!canNext}
        >
          Next: Portfolio →
        </button>
      </div>
    </div>
  );
};

export default SkillsStep;