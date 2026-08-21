import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ freelancer }) => {
  const navigate = useNavigate();

  const user = freelancer.userId;

  const handleMessage = () => {
    navigate(
      `/chat?receiverId=${user?._id}&name=${encodeURIComponent(
        user?.name || 'User'
      )}`
    );
  };

  return (
    <div className="profile-header">

      <img
        className="profile-avatar"
        src={
          user?.avatar ||
          'https://img.icons8.com/color/96/user-male-circle--v1.png'
        }
        alt="avatar"
      />

      <div className="profile-header-info">
        <h2>{user?.name}</h2>

        <p className="profile-title">
          {freelancer.title}
        </p>

        <p className="profile-rate">
          ₹{freelancer.hourlyRate}/hr
        </p>

        <button
          className="profile-message-btn"
          onClick={handleMessage}
        >
          💬 Message
        </button>
      </div>

    </div>
  );
};

export default ProfileHeader;