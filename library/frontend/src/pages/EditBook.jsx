import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CreateBook.module.css";

import { fetchBookById, updateBook } from "../api/booksApi";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [preview, setPreview] = useState("/books/book.jpg");

  const [formData, setFormData] = useState({
    title: "",
    publication_year: "",
    description: "",
    amount: "",
    genre: "",
    author_id: "",
    photo: null,
  });

  useEffect(() => {
    const loadBook = async () => {
      try {
        const book = await fetchBookById(id);

        setFormData({
          title: book.title,
          publication_year: book.publication_year,
          description: book.description,
          amount: book.amount,
          genre: book.genre,
          author_id: book.author.id,
          photo: null,
        });

        setPreview(book.photo || "/books/book.jpg");
      } catch (err) {
        setError("Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData({
      ...formData,
      photo: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
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

      await updateBook(id, data);

      navigate(`/books/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Book</h1>

      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.leftSection}>
          <img
            src={preview}
            alt="Book"
            className={styles.cover}
          />

          <label className={styles.uploadLabel}>
            Change cover
            <input
              type="file"
              className={styles.fileInput}
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className={styles.formSection}>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={styles.inputGroup}>
            <label>Title</label>

            <input
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
                name="author_id"
                value={formData.author_id}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Description</label>

            <textarea
              className={styles.textarea}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate(`/books/${id}`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}