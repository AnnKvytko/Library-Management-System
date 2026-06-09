import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateBook.module.css";

import { createAuthor } from "../api/authorsApi";

export default function CreateAuthor() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    date_of_death: "",
    nationality: "",
    description: "",
    photo: null,
  });

  const [preview, setPreview] = useState(
    "/authors/nobody.jpg"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setFormData({
        ...formData,
        photo: file,
      });

      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError(null);

      const data = new FormData();

      data.append(
        "first_name",
        formData.first_name
      );

      data.append(
        "last_name",
        formData.last_name
      );

      data.append(
        "date_of_birth",
        formData.date_of_birth
      );

      data.append(
        "date_of_death",
        formData.date_of_death
      );

      data.append(
        "nationality",
        formData.nationality
      );

      data.append(
        "description",
        formData.description
      );

      if (formData.photo) {

        data.append(
          "photo",
          formData.photo
        );
      }

      await createAuthor(data);

      navigate("/authors");

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Failed to create author"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className={styles.page}>

      <h1 className={styles.title}>
        Create Author
      </h1>

      <form
        className={styles.container}
        onSubmit={handleSubmit}
      >

        {/* LEFT SIDE */}
        <div className={styles.leftSection}>

          <img
            src={preview}
            alt="Author"
            className={styles.cover}
          />

          <label className={styles.uploadLabel}>

            Change photo

            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImageChange}
            />

          </label>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.formSection}>

          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "20px",
              }}
            >
              {error}
            </p>
          )}

          <div className={styles.row}>

            <div className={styles.inputGroup}>

              <label>First name</label>

              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />

            </div>

            <div className={styles.inputGroup}>

              <label>Last name</label>

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className={styles.row}>

            <div className={styles.inputGroup}>

              <label>Date of birth</label>

              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />

            </div>

            <div className={styles.inputGroup}>

              <label>Date of death</label>

              <input
                type="date"
                name="date_of_death"
                value={formData.date_of_death}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className={styles.inputGroup}>

            <label>Nationality</label>

            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
            />

          </div>

          <div className={styles.inputGroup}>

            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
            />

          </div>

          {/* BUTTONS */}
          <div className={styles.buttons}>

            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/authors")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
              disabled={loading}
            >
              {
                loading
                  ? "Creating..."
                  : "Create author"
              }
            </button>

          </div>

        </div>
      </form>
    </div>
  );
}