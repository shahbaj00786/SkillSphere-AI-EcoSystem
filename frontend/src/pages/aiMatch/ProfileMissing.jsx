const ProfileMissing = ({ navigate }) => {
  return (
    <div className="profile-missing">
      <p className="profile-missing-icon">👤</p>

      <h3>Profile Setup Required</h3>

      <p>
        You need to set up your freelancer profile with skills
        before AI matching can work.
      </p>

      <button onClick={() => navigate('/freelancer-setup')}>
        Set Up Profile →
      </button>
    </div>
  )
}

export default ProfileMissing