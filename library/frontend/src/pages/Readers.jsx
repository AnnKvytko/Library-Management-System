import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import styles from "./Readers.module.css";

import {
  fetchReaders,
  fetchProfileByUser,
} from "../api/usersApi";

export default function Readers() {
  const [page, setPage] = useState(1);
  const readersPerPage = 8;
  const navigate = useNavigate();

  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReaders = async () => {
      try {
        setLoading(true);

        const usersData = await fetchReaders();

        const users = Array.isArray(usersData)
          ? usersData
          : usersData.results;

        const enrichedReaders = await Promise.all(
          users.map(async (user) => {
            try {
              const profile = await fetchProfileByUser(
                user.user_id
              );

              return {
                id: user.user_id,
                username: user.username,
                first_name: profile.first_name,
                last_name: profile.last_name,
                phone: profile.phone,
                address: profile.address
                  ? `${profile.address.country}, ${profile.address.city}, ${profile.address.street} ${profile.address.street_number}`
                  : "-",
              };
            } catch (e) {
              return {
                id: user.user_id,
                username: user.username,
                first_name: "-",
                last_name: "-",
                phone: "-",
                address: "-",
              };
            }
          })
        );

        setReaders(enrichedReaders);
      } catch (err) {
        console.error("Failed to load readers:", err);
        setReaders([]);
      } finally {
        setLoading(false);
      }
    };

    loadReaders();
  }, []);

  const start = (page - 1) * readersPerPage;

  const paginatedReaders = readers.slice(
    start,
    start + readersPerPage
  );

  if (loading) {
    return <div className={styles.page}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Readers</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Phone number</th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>
            {paginatedReaders.map((reader) => (
              <tr
                key={reader.id}
                onClick={() =>
                  navigate(`/readers/${reader.id}`)
                }
                className={styles.row}
              >
                <td>{reader.id.slice(0, 8)}</td>
                <td className={styles.usernameCell}>
                  {reader.username}
                </td>
                <td>{reader.first_name}</td>
                <td>{reader.last_name}</td>
                <td>{reader.phone}</td>
                <td>{reader.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationWrapper}>
        <Pagination
          page={page}
          onPrev={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          onNext={() =>
            setPage((p) =>
              p * readersPerPage < readers.length
                ? p + 1
                : p
            )
          }
        />
      </div>
    </div>
  );
}