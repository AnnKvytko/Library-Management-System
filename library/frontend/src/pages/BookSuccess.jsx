import { useNavigate, useLocation } from "react-router-dom";
import styles from "./OrderSuccess.module.css";

export default function BookSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const book = location.state?.book || null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.icon}>✓</div>

        <h1 className={styles.title}>
          Book created successfully
        </h1>

        <p className={styles.subtitle}>
          The book has been successfully added to the library.
        </p>

        <div className={styles.infoBox}>

          <div className={styles.row}>
            <span className={styles.label}>
              Book ID
            </span>

            <span className={styles.value}>
              {book?.id || "-"}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>
              Title
            </span>

            <span className={styles.bookTitle}>
              {book?.title || "-"}
            </span>
          </div>

        </div>

        <div className={styles.buttons}>

          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/books")}
          >
            View books
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/create-book")}
          >
            Create another
          </button>

        </div>

      </div>
    </div>
  );
}