import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import styles from "./TakenBooks.module.css";

import { fetchOrdersByUser } from "../api/usersApi";
import { getCurrentUser } from "../api/authApi";

export default function TakenBooks() {
  const [page, setPage] = useState(1);
  const ordersPerPage = 8;

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await getCurrentUser();

        const data = await fetchOrdersByUser(user.user_id);

        setOrders(data.results || data);
        setCount(data.count || data.length);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const start = (page - 1) * ordersPerPage;
  const paginatedOrders = orders.slice(start, start + ordersPerPage);

  const totalPages = Math.ceil(count / ordersPerPage);

  const formatId = (id) => id.slice(0, 8);

  const formatDate = (date) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Taken books</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Due date</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className={styles.row}
              >
                <td>{formatId(order.id)}</td>

                <td className={styles.titleCell}>
                  {order.book?.title || order.title}
                </td>

                <td className={styles[order.status]}>
                  {order.status}
                </td>

                <td>{formatDate(order.due_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationWrapper}>
        <Pagination
          page={page}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() =>
            setPage((p) => (p < totalPages ? p + 1 : p))
          }
        />
      </div>
    </div>
  );
}