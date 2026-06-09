import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import styles from "./ReaderDetail.module.css";

import {
  fetchUser,
  fetchProfileByUser,
  fetchOrdersByUser,
} from "../api/usersApi";

export default function ReaderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [page, setPage] = useState(1);
  const ordersPerPage = 5;

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const userData = await fetchUser(id);
        setUser(userData);

        try {
          const profileData = await fetchProfileByUser(id);
          setProfile(profileData);
        } catch (e) {
          console.warn("Profile not found:", e);
          setProfile(null);
        }

        try {
          const ordersData = await fetchOrdersByUser(id);
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (e) {
          console.warn("Orders not found:", e);
          setOrders([]);
        }
      } catch (err) {
        console.error("User fetch failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const start = (page - 1) * ordersPerPage;

  const paginatedOrders = orders.slice(
    start,
    start + ordersPerPage
  );

  if (loading) {
    return <div className={styles.page}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* LEFT SIDE */}
        <div className={styles.sidebar}>
          <img
            src={profile?.photo || "/nobody.jpg"}
            alt={user?.username}
            className={styles.image}
          />

          <h2 className={styles.username}>
            {user?.username || "-"}
          </h2>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.content}>
          {/* INFO SECTION */}
          <div className={styles.infoSection}>
            <h1 className={styles.title}>
              Reader information
            </h1>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>
                  First name
                </span>
                <span className={styles.value}>
                  {profile?.first_name || "-"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Last name
                </span>
                <span className={styles.value}>
                  {profile?.last_name || "-"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Phone number
                </span>
                <span className={styles.value}>
                  {profile?.phone || "-"}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>
                  Address
                </span>
                <span className={styles.value}>
                  {profile?.address
                    ? `${profile.address.city}, ${profile.address.street} ${profile.address.street_number}`
                    : "-"}
                </span>
              </div>

              <div className={`${styles.infoItem} ${styles.idItem}`}>
                <span className={styles.label}>
                  User ID
                </span>
                <span className={styles.idValue}>
                  {user?.user_id || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* ORDERS SECTION */}
          <div className={styles.ordersSection}>
            <h2 className={styles.ordersTitle}>
              Orders:{" "}
              <span className={styles.ordersCount}>
                {orders.length}
              </span>
            </h2>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Book</th>
                    <th>Status</th>
                    <th>Due date</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={styles.row}
                      onClick={() =>
                        navigate(`/orders/${order.id}`)
                      }
                    >
                      <td>{order.id.slice(0, 8)}</td>

                      <td className={styles.bookCell}>
                        {order.book?.title || "-"}
                      </td>

                      <td className={styles[order.status]}>
                        {order.status}
                      </td>

                      <td>
                        {order.due_date
                          ? new Date(order.due_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              onPrev={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              onNext={() =>
                setPage((p) =>
                  p * ordersPerPage < orders.length
                    ? p + 1
                    : p
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}