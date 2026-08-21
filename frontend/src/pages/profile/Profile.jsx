import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setUser } from "../../redux/authSlice.js";
import api from "../../services/api.js";

import Navbar from "../../components/common/Navbar.jsx";

import ProfileHeader from "./profileComp/ProfileHeader.jsx";
import BasicInformation from "./profileComp/BasicInformation.jsx";
import SkillsSection from "./profileComp/SkillsSection.jsx";
import PortfolioSection from "./profileComp/PortfolioSection.jsx";
import AvailabilitySection from "./profileComp/AvailabilitySection.jsx";

import "../../styles/profile.css";

const Profile = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [freelancerData, setFreelancerData] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    skills: [],
    portfolioItems: [],
    availabilitySlots: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/me");

      if (!response.data.success) {
        return;
      }

      const currentUser = response.data.user;

      const roleData = response.data.roleData;

      dispatch(setUser(currentUser));

      setFreelancerData(roleData || null);

      setFormData({
        name: currentUser?.name || "",

        skills: roleData?.skills ? [...roleData.skills] : [],

        portfolioItems: roleData?.portfolioItems
          ? [...roleData.portfolioItems]
          : [],

        availabilitySlots: roleData?.availabilitySlots
          ? [...roleData.availabilitySlots]
          : [],
      });
    } catch (error) {
      console.error("Profile fetch error:", error);

      setMessage("Failed to load profile");
    }
  };
  const handleEdit = () => {
    setMessage("");

    setFormData({
      name: user?.name || "",

      skills: freelancerData?.skills ? [...freelancerData.skills] : [],

      portfolioItems: freelancerData?.portfolioItems
        ? [...freelancerData.portfolioItems]
        : [],

      availabilitySlots: freelancerData?.availabilitySlots
        ? [...freelancerData.availabilitySlots]
        : [],
    });

    setEditMode(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",

      skills: freelancerData?.skills ? [...freelancerData.skills] : [],

      portfolioItems: freelancerData?.portfolioItems
        ? [...freelancerData.portfolioItems]
        : [],

      availabilitySlots: freelancerData?.availabilitySlots
        ? [...freelancerData.availabilitySlots]
        : [],
    });

    setEditMode(false);
    setMessage("");
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      // CLIENT PROFILE UPDATE
      if (user?.role === "client") {
        const response = await api.put("/users/me", {
          name: formData.name,
        });

        if (response.data.success) {
          dispatch(setUser(response.data.user));

          setMessage("Profile updated successfully!");
          setEditMode(false);
        }

        return;
      }

      // =========================
      // FREELANCER PROFILE UPDATE
      // =========================
      if (user?.role === "freelancer") {
        const response = await api.put("/freelancers/profile", {
          name: formData.name,
          skills: formData.skills,
          portfolioItems: formData.portfolioItems,
          availabilitySlots: formData.availabilitySlots,
        });

        if (response.data.success) {
          if (response.data.user) {
            dispatch(setUser(response.data.user));
          }

          if (response.data.roleData) {
            setFreelancerData(response.data.roleData);
          } else {
            setFreelancerData((prev) => ({
              ...prev,
              skills: formData.skills,
              portfolioItems: formData.portfolioItems,
              availabilitySlots: formData.availabilitySlots,
            }));
          }

          setMessage("Profile updated successfully!");
          setEditMode(false);
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);

      setMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  // RENDER
  return (
    <div className="profile-container">
      <Navbar />

      <main className="profile-content">
        <ProfileHeader user={user} editMode={editMode} onEdit={handleEdit} />

        {message && <div className="profile-message">{message}</div>}

        <BasicInformation
          user={user}
          name={formData.name}
          editMode={editMode}
          onChange={(value) => updateField("name", value)}
        />

        {user?.role === "freelancer" && (
          <>
            <SkillsSection
              skills={formData.skills}
              editMode={editMode}
              onChange={(value) => updateField("skills", value)}
            />

            <PortfolioSection
              portfolio={formData.portfolioItems}
              editMode={editMode}
              onChange={(value) => updateField("portfolioItems", value)}
            />

            <AvailabilitySection
              availability={formData.availabilitySlots}
              editMode={editMode}
              onChange={(value) => updateField("availabilitySlots", value)}
            />
          </>
        )}

        {editMode && (
          <div className="profile-edit-actions">
            <button
              type="button"
              className="profile-save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="profile-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
