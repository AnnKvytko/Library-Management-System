import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./AuthorDetail.module.css";
import BackToPage from "../components/BackToPage";

import { fetchAuthorById, deleteAuthor } from "../api/authorsApi";
import { getCurrentUser } from "../api/authApi";
import { fetchBooksByAuthor } from "../api/booksApi";

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function AuthorDetail() {
  const { id } = useParams();

  const [author, setAuthor] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);

  const navigate = useNavigate();

  const isReader = userRole === "reader";
  const isLibrarian = userRole === "librarian";

  useEffect(() => {
    const loadData = async () => {
      try {
        // load author
        const authorData = await fetchAuthorById(id);

        const booksData = await fetchBooksByAuthor(id);

        setAuthor({
          id: authorData.id,
          first_name: authorData.first_name,
          last_name: authorData.last_name,
          nationality: authorData.nationality,
          born: authorData.date_of_birth,
          died: authorData.date_of_death,
          image: authorData.photo,
          biography: authorData.description,
        });

        setBooks(booksData.results);

        // load current user
        const user = await getCurrentUser();

        setUserRole(user.role);
      } catch (err) {
        console.log("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <p>Loading author...</p>;
  }

  if (!author) {
    return <p>Author not found</p>;
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this author?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAuthor(author.id);

      onDelete(author.id);

    } catch (err) {
      alert("Failed to delete author");
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <BackToPage page="Authors" />

      {isLibrarian && (
        <h1 className={styles.pageTitle}>
          Author{" "}
          <span className={styles.authorId}>
            {author.id}
          </span>
        </h1>
      )}
      {isReader && (
        <h1 className={styles.pageTitle}>
          Author info
        </h1>
      )}

      <div className={styles.containerWrapper}>
        <div className={styles.container}>

          {/* Author Image */}
          <div className={styles.imageColumn}>
            <img
              src={author.image?.trim() ? author.image : "/authors/nobody.jpg"}
              alt={`${author.first_name} ${author.last_name}`}
              className={styles.image}
            />

            {isLibrarian && (
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => navigate(`/edit-author/${author.id}`)}
                >
                  Edit ✏️
                </button>
                <button className={styles.actionBtn} onClick={handleDelete}>
                  Delete 🗑
                </button>
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className={styles.info}>
            <h1 className={styles.title}>
              {author.first_name} {author.last_name}
            </h1>

            <div className={styles.metaRow}>
              <span className={styles.label}>Nationality</span>
              <span className={styles.value}>
                {author.nationality}
              </span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.label}>Date of Birth / Death</span>

              <span className={styles.value}>
                {formatDate(author.born)} |{" "}
                {author.died ? formatDate(author.died) : "—"}
              </span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.label}>Biography</span>
              <span className={styles.description}>
                {author.biography}
              </span>
            </div>
          </div>

          {/* Books Section */}
          <div className={styles.booksSection}>
            <h3 className={styles.bookLabel}>Books</h3>

            <ul className={styles.booksList}>
              {books.length > 0 ? (
                books.map((book) => (
                  <li key={book.id}>
                    <Link
                      to={`/books/${book.id}`}
                      className={styles.bookLink}
                    >
                      {book.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No books found</li>
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}