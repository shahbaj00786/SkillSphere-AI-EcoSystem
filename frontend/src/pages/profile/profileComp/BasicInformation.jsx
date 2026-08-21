import { PROFILE_IMG } from "../../../constants/images.js";

const BasicInformation = ({
  user,
  name,
  editMode,
  onChange,
}) => {

  return (
    <section className="profile-section">

      <div className="section-heading">

        <div className="section-title">

          <img
            src={PROFILE_IMG}
            alt=""
          />

          <h3>
            Basic Information
          </h3>

        </div>

      </div>

      {editMode ? (

        <div className="profile-form">

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              value={name || ""}
              onChange={(e) =>
                onChange(
                  e.target.value
                )
              }
            />

          </div>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
            />

          </div>

        </div>

      ) : (

        <div className="profile-info">

          <div className="info-row">
            <span>Full Name</span>
            <strong>
              {user?.name || "-"}
            </strong>
          </div>

          <div className="info-row">
            <span>Email</span>
            <strong>
              {user?.email || "-"}
            </strong>
          </div>

          <div className="info-row">
            <span>Role</span>
            <strong>
              {user?.role || "-"}
            </strong>
          </div>

          <div className="info-row">
            <span>Email Verified</span>

            <strong>
              {user?.isVerified
                ? "✅ Verified"
                : "❌ Not Verified"}
            </strong>
          </div>

          <div className="info-row">
            <span>Member Since</span>

            <strong>
              {user?.createdAt
                ? new Date(
                    user.createdAt
                  ).toDateString()
                : "-"}
            </strong>
          </div>

        </div>
      )}

    </section>
  );
};

export default BasicInformation;