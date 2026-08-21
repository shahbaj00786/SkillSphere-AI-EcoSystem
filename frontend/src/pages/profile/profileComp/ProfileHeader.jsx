import { DEFAULT_AVATAR } from "../../../constants/images.js";

const ProfileHeader = ({
  user,
  editMode,
  onEdit,
}) => {
  return (
    <section className="profile-header">

      <div className="profile-avatar-wrapper">
        <img
          className="profile-avatar"
          src={user?.avatar || DEFAULT_AVATAR}
          alt="Profile"
        />
      </div>

      <div className="profile-header-info">

        <h2>
          {user?.name || "User"}
        </h2>

        <p className="profile-email">
          {user?.email || "No email available"}
        </p>

        <span className="role-badge">
          {user?.role || "User"}
        </span>

      </div>

      {!editMode && (
        <button
          type="button"
          className="profile-edit-btn"
          onClick={onEdit}
        >
          ✏ Edit Profile
        </button>
      )}

    </section>
  );
};

export default ProfileHeader;