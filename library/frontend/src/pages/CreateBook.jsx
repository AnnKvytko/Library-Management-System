import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateBook.module.css";
import { createBook } from "../api/booksApi";

export default function CreateBook() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    publication_year: "",
    description: "",
    amount: "",
    genre: "",
    author_id: "",
    photo: null,
  });

  const [preview, setPreview] = useState("/books/book.jpg");
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

      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("publication_year", formData.publication_year);
      data.append("description", formData.description);
      data.append("amount", formData.amount);
      data.append("genre", formData.genre);

      data.append("author_id", formData.author_id);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      await createBook(data);

      navigate("/books");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Book</h1>

      <form className={styles.container} onSubmit={handleSubmit}>
        {/* LEFT SIDE */}
        <div className={styles.leftSection}>
          <img src={preview} alt="Book" className={styles.cover} />

          <label className={styles.uploadLabel}>
            Change cover
            <input
              type="file"
              className={styles.fileInput}
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.formSection}>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={styles.inputGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Publication year</label>
              <input
                type="number"
                name="publication_year"
                value={formData.publication_year}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Genre</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="">Select genre</option>
                <option value="dystopian">Dystopian</option>
                <option value="fantasy">Fantasy</option>
                <option value="fiction">Fiction</option>
                <option value="romance">Romance</option>
                <option value="science_fiction">Science Fiction</option>
                <option value="thriller">Thriller</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Author ID</label>
              <input
                type="text"
                name="author_id"
                value={formData.author_id}
                onChange={handleChange}
              />
            </div>
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

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/books")}
            >
              Cancel
            </button>

            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Creating..." : "Create book"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}