const ProfileSkills = ({ skills }) => {
  return (
    <div className="profile-section">
      <h3>Skills</h3>

      <div className="profile-skills">
        {skills?.map((skill, idx) => (
          <span
            key={idx}
            className="profile-skill"
          >
            {skill.name} — {skill.proficiencyLevel}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkills;