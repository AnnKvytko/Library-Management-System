import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditProfile.module.css";

import {
  getMyProfile,
  updateMyProfile,
  createProfile,
} from "../api/profileApi";

export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();

        setProfileExists(true);

        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          country: data.address?.country || "",
          city: data.address?.city || "",
          street: data.address?.street || "",
          street_number: data.address?.street_number || "",
          photo: data.photo || "/authors/nobody.jpg",
          photoFile: null,
        });
      } catch {
        setProfileExists(false);
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

    try {
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