import { Link } from "react-router-dom";
import styles from "./BackToPage.module.css";

export default function BackToPage({ page }) {
  const pagePaths = {
    Books: "/books",
    Authors: "/authors",
  };

  return (
    <div className={styles.backWrapper}>
      <Link to={pagePaths[page] || "/"} className={styles.backLink}>
        ⇦ Back to {page}
      </Link>
    </div>
  );
}
