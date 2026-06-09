import { useEffect, useState } from "react";
import AuthorCard from "../components/AuthorCard";
import Pagination from "../components/Pagination";
import styles from "./Authors.module.css";
import { Link, useNavigate } from "react-router-dom";

import { fetchAuthors, fetchNationalities } from "../api/authorsApi";
import { getCurrentUser } from "../api/authApi";

import { useDebounce } from "../hooks/useDebounce";

export default function Authors() {
  const navigate = useNavigate();

  const [authors, setAuthors] = useState([]);
  const [count, setCount] = useState(0);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [nationality, setNationality] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [nationalities, setNationalities] = useState([]);
  const [userRole, setUserRole] = useState(null);

  const authorsPerPage = 5;
  const totalPages = Math.ceil(count / authorsPerPage);

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();

      if (user) {
        setUserRole(user.role);
      } else {
        setUserRole(null);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const loadNationalities = async () => {
      try {
        const data = await fetchNationalities();
        setNationalities(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadNationalities();
  }, []);

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchAuthors({
          page,
          pageSize: authorsPerPage,
          search: debouncedSearch,
          nationality,
        });

        setAuthors(data.results);
        setCount(data.count);
      } catch (err) {
        setAuthors([]);
        if (page === 1) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, [page, debouncedSearch, nationality]);

  return (
    <div className={styles.page}>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className={styles.search}
        placeholder="Search authors..."
      />

      <h1 className={styles.title}>Authors</h1>

      <div className={styles.headerRow}>
        <span className={styles.results}>{count} results</span>

        <div>
          {userRole === "librarian" && (
            <button
              className={styles.addAuthorBtn}
              onClick={() => navigate("/create-author")}
            >
              Add new author ➕
            </button>
          )}

          <select
            value={nationality}
            onChange={(e) => {
              setNationality(e.target.value);
              setPage(1);
            }}
            className={styles.filter}
          >
            <option value="all">All nationalities</option>
            {nationalities.map((nat) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading authors...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className={styles.grid}>
        {authors.map((author) => (
          <Link
            key={author.id}
            to={`/authors/${author.id}`}
            className={styles.cardLink}
          >
            <AuthorCard author={author} userRole={userRole} />
          </Link>
        ))}
      </div>

      <Pagination
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() =>
          setPage((p) => (p < totalPages ? p + 1 : p))
        }
      />
    </div>
  );
}