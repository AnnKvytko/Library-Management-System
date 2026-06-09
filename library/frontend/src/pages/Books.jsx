import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import styles from "./Books.module.css";

import { fetchBooks } from "../api/booksApi";
import { getCurrentUser } from "../api/authApi";

import { useDebounce } from "../hooks/useDebounce";

export default function Books() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);


  const [page, setPage] = useState(1);
  const [filterBy, setFilterBy] = useState("title");
  const [genre, setGenre] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const booksPerPage = 8;
  const totalPages = Math.ceil(count / booksPerPage);

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();

        console.log("USER FROM API:", user);

        setUserRole(user?.role);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUserRole(null);
      }
    };

    init();
  }, []);



  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchBooks({
          page,
          search: debouncedSearch,
          genre,
          filterBy,
        });


        setBooks(data.results);
        setCount(data.count);

      } catch (err) {

        setError(null);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();

  }, [page, debouncedSearch, genre, filterBy]);


  return (
    <div className={styles.page}>

      <input
        type="text"
        placeholder={
          filterBy === "year"
            ? "Search by year..."
            : "Search books..."
        }
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className={styles.search}
      />

      <h1 className={styles.title}>Books collection</h1>

      <div className={styles.headerRow}>

        <span className={styles.results}>
          {count} results
        </span>

        {/* ---------------- FILTERS / SORTING ---------------- */}
        <div className={styles.filters}>

          {userRole === "librarian" && (
            <button
              className={styles.addBookBtn}
              onClick={() => navigate("/create-book")}
            >
              Add new book ➕
            </button>
          )}

          <select
            value={filterBy}
            onChange={(e) => {
              setFilterBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="year">Publication year</option>
          </select>

          <select
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All genres</option>
            <option value="classic">Classic</option>
            <option value="fantasy">Fantasy</option>
            <option value="dystopian">Dystopian</option>
            <option value="romance">Romance</option>
          </select>

        </div>
      </div>

      {loading && <p>Loading books...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* BOOK LIST */}
      <div className={styles.grid}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            userRole={userRole}
            onNavigate={() => navigate(`/books/${book.id}`)}
            onDelete={(id) => {
              setBooks((prev) => prev.filter((b) => b.id !== id));
            }}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}

        onPrev={() => setPage((p) => Math.max(1, p - 1))}

        onNext={() =>
          setPage((p) =>
            p < totalPages ? p + 1 : p
          )
        }
      />

    </div>
  );
}