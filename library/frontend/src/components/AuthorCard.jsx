import styles from "./AuthorCard.module.css";
import { deleteAuthor } from "../api/authorsApi";

export default function AuthorCard({
  author,
  userRole,
  onDelete,
}) {

  const isLibrarian =
    userRole === "librarian";

  const handleDelete = async (e) => {

    e.preventDefault();

    const confirmDelete = window.confirm(
      `Delete ${author.first_name} ${author.last_name}?`
    );

    if (!confirmDelete) return;

    try {

      await deleteAuthor(author.id);

      if (onDelete) {
        onDelete(author.id);
      }

    } catch (err) {
      alert("Failed to delete author");
      console.error(err);
    }
  };

  return (
    <div className={styles.card}>

      {/* AUTHOR IMAGE */}
      <img
        src={
          author.photo ||
          "/authors/nobody.jpg"
        }
        alt={author.last_name}
        className={styles.image}
      />

      {/* AUTHOR NAME */}
      <h3 className={styles.name}>
        {author.first_name} {author.last_name}
      </h3>

      {/* NATIONALITY */}
      <p className={styles.meta}>
        {author.nationality} author
      </p>

      {/* DATE OF BIRTH */}
      <p className={styles.meta}>
        Born: {
          author.date_of_birth
            ? new Date(
              author.date_of_birth
            ).getFullYear()
            : "Unknown"
        }
      </p>

      {/* DELETE BUTTON */}
      {isLibrarian && (
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
        >
          Delete 🗑
        </button>
      )}

    </div>
  );
}