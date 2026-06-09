import styles from "./Pagination.module.css";

export default function Pagination({ page, onPrev, onNext }) {
  return (
    <div className={styles.pagination}>
      <button
        onClick={onPrev}
        disabled={page === 1}
        className={styles.button}
      >
        Previous
      </button>

      <span className={styles.page}>Page {page}</span>

      <button
        onClick={onNext}
        className={styles.button}
      >
        Next
      </button>
    </div>
  );
}
