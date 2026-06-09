import { useNavigate } from "react-router-dom";
import styles from "./OrderSuccess.module.css";

export default function AuthorSuccess() {
  const navigate = useNavigate();

  const author = {
    id: "f369851c-d78a-4785-949e-3d4dcbc5557a",
    full_name: "J.K. Rowling",
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.icon}>
          ✓
        </div>

        <h1 className={styles.title}>
          Author created successfully
        </h1>

        <p className={styles.subtitle}>
          The author has been successfully added to the library.
        </p>

        <div className={styles.infoBox}>

          <div className={styles.row}>
            <span className={styles.label}>
              Author ID
            </span>

            <span className={styles.value}>
              {author.id}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>
              Author
            </span>

            <span className={styles.bookTitle}>
              {author.full_name}
            </span>
          </div>

        </div>

        <div className={styles.buttons}>

          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/authors")}
          >
            View authors
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/create-author")}
          >
            Create another
          </button>

        </div>
      </div>
    </div>
  );
}