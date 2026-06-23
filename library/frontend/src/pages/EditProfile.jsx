import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditProfile.module.css";

import {
  getMyProfile,
  updateMyProfile,
  createProfile,
} from "../api/profileApi";

import { getCurrentUser } from "../api/authApi";

export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  // 🔥 NEW: onboarding flag
  const [showOnboarding, setShowOnboarding] = useState(false);

  // profile fields
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",

    country: "",
    city: "",
    street: "",
    street_number: "",

    photo: "/authors/nobody.jpg",
    photoFile: null,
  });

  // 🔥 NEW: user onboarding fields
  const [userData, setUserData] = useState({
    username: "",
    role: "reader",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getCurrentUser();
        const profile = await getMyProfile();

        setProfileExists(!!profile);

        if (profile) {
          setFormData({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            phone: profile.phone || "",
            country: profile.address?.country || "",
            city: profile.address?.city || "",
            street: profile.address?.street || "",
            street_number: profile.address?.street_number || "",
            photo: profile.photo || "/authors/nobody.jpg",
            photoFile: null,
          });

          setShowOnboarding(false);
        } else {
          // no profile yet
          setShowOnboarding(user.is_social_user);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUserChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      photo: URL.createObjectURL(file),
      photoFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    try {
      // 1. 🔥 UPDATE USER (ONLY FOR GOOGLE USERS)
      if (showOnboarding) {
        await fetch("http://127.0.0.1:8000/api/users/update_me/", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        });
      }

      // 2. PROFILE DATA
      const data = new FormData();

      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("phone", formData.phone);

      data.append("address.country", formData.country);
      data.append("address.city", formData.city);
      data.append("address.street", formData.street);
      data.append("address.street_number", formData.street_number);

      if (formData.photoFile) {
        data.append("photo", formData.photoFile);
      }

      if (profileExists) {
        await updateMyProfile(data);
      } else {
        await createProfile(data);
      }

      navigate("/profile");
    } catch (err) {
      console.log("PROFILE SAVE ERROR:", err);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Profile</h1>

      <form className={styles.container} onSubmit={handleSubmit}>

        {/* LEFT SIDE */}
        <div className={styles.leftSection}>
          <img
            src={formData.photo}
            alt="Profile"
            className={styles.avatar}
          />

          <label className={styles.uploadLabel}>
            Change photo
            <input
              type="file"
              className={styles.fileInput}
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </label>

          
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.formSection}>
            {/* 🔥 GOOGLE ONBOARDING BLOCK */}
          {showOnboarding && (
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Username</label>
                <input
                  name="username"
                  value={userData.username}
                  onChange={handleUserChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Role</label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleUserChange}
                >
                  <option value="reader">Reader</option>
                  <option value="librarian">Librarian</option>
                </select>
              </div>
            </div>
          )}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>First name</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Last name</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Phone number</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Country</label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Street</label>
              <input
                name="street"
                value={formData.street}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Street number</label>
              <input
                name="street_number"
                value={formData.street_number}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>

            <button type="submit" className={styles.saveBtn}>
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}