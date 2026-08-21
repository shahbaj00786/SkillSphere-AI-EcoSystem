const ProfileBio = ({ bio }) => {
  return (
    <div className="profile-section">
      <h3>About</h3>

      <p className="profile-bio">
        {bio || 'No bio provided.'}
      </p>
    </div>
  );
};

export default ProfileBio;