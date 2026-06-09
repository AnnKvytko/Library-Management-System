import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { fetchOrders } from "../api/ordersApi";
import styles from "./Orders.module.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ordersPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const start = (page - 1) * ordersPerPage;
  const paginatedOrders = orders.slice(start, start + ordersPerPage);

  const formatId = (id) => id.slice(0, 8);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Orders</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Orders</h1>

      <button
        className={styles.button}
        onClick={() => navigate("/create-order-librarian")}
      >
        Create new Order
      </button>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Book</th>
              <th>User</th>
              <th>Status</th>
              <th>Due date</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className={styles.row}
              >
                <td>{formatId(order.id)}</td>

                <td className={styles.titleCell}>
                  {order.book?.title}
                </td>

                <td>
                  {order.user?.email}
                </td>

                <td className={styles[order.status]}>
                  {order.status}
                </td>

                <td>
                  {order.due_date
                    ? formatDate(order.due_date)
                    : "-"}
                </td>
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
            setPage((p) =>
              p * ordersPerPage < orders.length ? p + 1 : p
            )
          }
        />
      </div>
    </div>
  );
}