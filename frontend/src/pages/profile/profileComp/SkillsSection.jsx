import { RESUME_IMG } from "../../../constants/images.js";

const SkillsSection = ({
  skills = [],
  editMode,
  onChange,
}) => {

  const addSkill = () => {

    onChange([
      ...skills,
      {
        name: "",
        proficiencyLevel: "beginner",
      },
    ]);
  };

  const updateSkill = (
    index,
    field,
    value
  ) => {

    const updated = [...skills];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  const removeSkill = (index) => {

    onChange(
      skills.filter(
        (_, i) => i !== index
      )
    );
  };

  return (
    <section className="profile-section">

      <div className="section-heading">

        <div className="section-title">

          <img
            src={RESUME_IMG}
            alt=""
          />

          <h3>Skills</h3>

        </div>

      </div>

      {editMode ? (

        <div className="editor-box">

          {skills.map(
            (skill, index) => (

              <div
                className="skill-edit-row"
                key={index}
              >

                <input
                  type="text"
                  placeholder="Skill name"
                  value={
                    skill.name || ""
                  }
                  onChange={(e) =>
                    updateSkill(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                <select
                  value={
                    skill.proficiencyLevel ||
                    "beginner"
                  }
                  onChange={(e) =>
                    updateSkill(
                      index,
                      "proficiencyLevel",
                      e.target.value
                    )
                  }
                >

                  <option value="beginner">
                    Beginner
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="advanced">
                    Advanced
                  </option>

                </select>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    removeSkill(index)
                  }
                >
                  ✕
                </button>

              </div>
            )
          )}

          <button
            type="button"
            className="add-btn"
            onClick={addSkill}
          >
            + Add Skill
          </button>

        </div>

      ) : (

        skills.length > 0 ? (

          <div className="skills-container">

            {skills.map(
              (skill, index) => (

                <span
                  className="skill-tag"
                  key={index}
                >

                  {skill.name}

                  <span className="skill-level">
                    {skill.proficiencyLevel}
                  </span>

                </span>

              )
            )}

          </div>

        ) : (

          <div className="empty-state">
            No skills added yet.
          </div>

        )
      )}

    </section>
  );
};

export default SkillsSection;