import styles from "./Home.module.css";

let option = 1;

export default function Home() {

  const renderContent = () => {
    switch (option) {
      case 1:
        return (
          <>
            <h1 className={styles.title}>Welcome to Library</h1>
            <p>
              Explore a modern, user-friendly library experience.<br /> Browse our collection,
              discover new books, and learn more about what our library offers.
            </p>
            <p>
              To access your personalized dashboard, borrow books, or track your reading
              history, please log in or create an account.
            </p>
            <button className={styles.button} onClick={() => window.location.href = "/books"}>
              Explore Books
            </button>
          </>
        );

      case 2:
        return (
          <>
            <h1 className={styles.title}>Welcome back to Library</h1>
            <p>
              Your reading journey continues here. Browse our collection, borrow new titles,
              track your due dates, and explore personalized recommendations.
            </p>
            <p>
              Thank you for being part of our community!
            </p>
            <button className={styles.button} onClick={() => window.location.href = "/books"}>
              Explore Books
            </button>
          </>
        );

      case 3:
        return (
          <>
            <h1 className={styles.title}>Welcome, Librarian</h1>
            <p>
              Track reader activity, update book records,
              review borrowing history, and keep our collection up to date.
            </p>
            <p>
              Thank you for your essential work!
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.textBlock}>{renderContent()}</div>
      <img
        src="/home.jpg"
        alt="Library"
        className={styles.image}
      />
    </div>
  );
}