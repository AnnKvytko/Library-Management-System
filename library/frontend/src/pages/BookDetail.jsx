import { useEffect, useState } from "react";
import styles from "./BookDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import BackToPage from "../components/BackToPage";

import { fetchBookById, deleteBook, addFavorite, removeFavorite } from "../api/booksApi";
import { getCurrentUser } from "../api/authApi";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const isReader = userRole === "reader";
  const isLibrarian = userRole === "librarian";


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {

        const bookData = await fetchBookById(id);
        console.log(bookData);

        setBook({
          id: bookData.id,
          title: bookData.title,
          author: `${bookData.author.first_name} ${bookData.author.last_name}`,
          genre: bookData.genre,
          year: bookData.publication_year,
          image: bookData.photo,
          description: bookData.description,
          amount: bookData.amount,
        });
      } catch (err) {
        console.log("Failed to load book:", err);
        setBook(null);
      }



      try {
        const token = localStorage.getItem("access");

        if (token) {
          try {
            const user = await getCurrentUser();
            setUserRole(user.role);
          } catch {
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.log("Favorite error:", err);
    }
  };

  if (loading) {
    return <p>Loading book...</p>;
  }

  if (!book) {
    return <p>Book not found</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.backWrapper}>
        <BackToPage page="Books" />
      </div>

      {isLibrarian && (
        <h1 className={styles.pageTitle}>
          Book{" "}
          <span className={styles.bookId}>
            {book.id}
          </span>
        </h1>
      )}

      <div className={styles.containerWrapper}>
        <div className={styles.container}>

          {/* IMAGE */}
          <div className={styles.imageColumn}>
            <img
              src={book.image?.trim() ? book.image : "/books/book.jpg"}
              alt={book.title}
              className={styles.image}
            />

            {isReader && (
              <div className={styles.actions}>
                <button
                  className={styles.borrowBtn}
                  onClick={() => navigate(`/create-order/${book.id}`)}
                >
                  Borrow
                </button>

                <button
                  className={styles.favoriteBtn}
                  onClick={handleFavoriteClick}
                >
                  {isFavorite ? "★" : "☆"}
                </button>
              </div>
            )}

            {isLibrarian && (
              <div className={styles.actions}>
                <button
                  className={styles.deleteBtn}
                  onClick={() => navigate(`/edit-book/${book.id}`)}
                >
                  Edit ✏️
                </button>
                <button className={styles.deleteBtn} onClick={handleDelete}>
                  Delete 🗑
                </button>
              </div>
            )}
          </div>

          {/* INFO */}
          <div className={styles.info}>
            <h1 className={styles.title}>
              {book.title}
            </h1>

            <div className={styles.metaRow}>
              <span className={styles.label}>Author</span>
              <span className={styles.value}>
                {book.author}
              </span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.label}>Genre</span>
              <span className={styles.value}>
                {book.genre}
              </span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.label}>Publication year</span>
              <span className={styles.value}>
                {book.year}
              </span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.label}>Description</span>
              <span className={styles.description}>
                {book.description}
              </span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.label}>Available books</span>
              <span className={styles.value}>
                {book.amount}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}