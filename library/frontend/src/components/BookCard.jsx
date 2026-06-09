import styles from "./BookCard.module.css";
import { useNavigate } from "react-router-dom";
import { deleteBook } from "../api/booksApi";

export default function BookCard({ book, userRole, onNavigate, onDelete }) {
  const isReader = userRole === "reader";
  const isLibrarian = userRole === "librarian";
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBook(book.id);

      onDelete(book.id);

    } catch (err) {
      alert("Failed to delete book");
      console.error(err);
    }
  };

  return (
    <div className={styles.card}>

      <div
        className={styles.clickArea}
        onClick={onNavigate}
      >
        {/* LEFT SIDE */}
        <div className={styles.imageBlock}>
          <img
            src={book.photo || "/books/book.jpg"}
            alt={book.title}
            className={styles.image}
          />

          <h3 className={styles.title}>
            {book.title}
          </h3>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.infoBlock}>
          <p>
            <strong>Author:</strong><br />
            {book.author?.first_name} {book.author?.last_name}
          </p>

          <p>
            <strong>Genre:</strong><br />
            {book.genre}
          </p>

          <p>
            <strong>Year:</strong><br />
            {book.publication_year}
          </p>

          {isReader && (
            <div className={styles.actions}>
              <button
                className={styles.borrowBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/create-order/${book.id}`);
                }}
              >
                Borrow
              </button>

              <button
                className={styles.favoriteBtn}
                onClick={(e) => e.stopPropagation()}
              >
                ☆
              </button>
            </div>
          )}

          {isLibrarian && (
            <div className={styles.actions}>
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                Delete 🗑
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
