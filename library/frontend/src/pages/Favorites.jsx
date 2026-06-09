import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import styles from "./Favorites.module.css";

import { getFavoriteBooks } from "../api/booksApi";

export default function Favorites() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const booksPerPage = 8;

  const [filterBy, setFilterBy] = useState("title");
  const [genre, setGenre] = useState("all");

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getFavoriteBooks();

        setFavorites(data.results || data);
      } catch (err) {
        console.log(err);
        setError("Failed to load favorite books");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const filteredBooks = favorites.filter((book) => {
    const value = String(book[filterBy]).toLowerCase();
    const matchesSearch = value.includes(search.toLowerCase());
    const matchesGenre = genre === "all" || book.genre === genre;
    return matchesSearch && matchesGenre;
  });

  const start = (page - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(start, start + booksPerPage);

  if (loading) return <p className={styles.page}>Loading...</p>;

  if (error)
    return <p className={styles.page} style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.page}>
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className={styles.search}
      />

      <h1 className={styles.title}>My Favorite Books</h1>

      <div className={styles.headerRow}>
        <span className={styles.results}>
          {filteredBooks.length} results
        </span>

        <div className={styles.filters}>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
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
            <option value="Classic">Classic</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Dystopian">Dystopian</option>
            <option value="Romance">Romance</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} userRole="reader" />
        ))}
      </div>

      <Pagination
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() =>
          setPage((p) =>
            p * booksPerPage < filteredBooks.length ? p + 1 : p
          )
        }
      />
    </div>
  );
}