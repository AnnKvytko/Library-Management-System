import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";

import { getMyProfile } from "../api/profileApi";
import { logout } from "../api/authApi";
import { getCurrentUser } from "../api/authApi";
import { fetchOrdersByUser } from "../api/usersApi";

export default function Profile() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const booksPerPage = 5;

  const [user, setUser] = useState(null);
  const [readBooks, setReadBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();

        console.log("USER FROM API:", user);

        setCurrentUser(user);
        setUserRole(user?.role);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUserRole(null);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();

        const userObj = {
          id: data.id,
          username: data.username || "unknown",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          address: data.address
            ? `${data.address.street} ${data.address.street_number}, ${data.address.city}, ${data.address.country}`
            : "",
          image: data.photo || "/nobody.jpg",
        };

        setUser(userObj);
      } catch (err) {
        console.log("Failed to load profile:", err);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!currentUser?.user_id) return;

    const loadOrders = async () => {
      try {
        const ordersData = await fetchOrdersByUser(currentUser.user_id);

        const orders = ordersData.results || ordersData;

        const closedOrders = orders.filter(
          (order) => order.status === "closed"
        );

        const unique = new Map();

        closedOrders.forEach((order) => {
          const id = order.book?.id;
          const title = order.book?.title || order.title;

          if (!unique.has(id)) {
            unique.set(id, { id, title });
          }
        });

        setReadBooks([...unique.values()]);
      } catch (err) {
        console.log("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentUser]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Failed to load user profile</p>;
  }

  const start = (page - 1) * booksPerPage;

  const paginatedBooks = readBooks.slice(
    start,
    start + booksPerPage
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* LEFT SIDE */}
        <div className={styles.sidebar}>

          <img
            src={user.image}
            alt={user.username}
            className={styles.image}
          />

          <h2 className={styles.username}>
            {user.username}
          </h2>

          <button
            className={styles.editBtn}
            onClick={() => navigate("/profile/edit")}
          >
            Edit profile
          </button>

          <button
            className={styles.logoutBtn}
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Log out
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className={styles.content}>

          {/* INFO */}
          <div className={styles.infoSection}>
            <h1 className={styles.title}>
              Profile information
            </h1>

            <div className={styles.infoGrid}>

              <div className={styles.infoItem}>
                <span className={styles.label}>First name</span>
                <span className={styles.value}>{user.first_name}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Last name</span>
                <span className={styles.value}>{user.last_name}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Phone number</span>
                <span className={styles.value}>{user.phone}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Address</span>
                <span className={styles.value}>{user.address}</span>
              </div>

            </div>
          </div>

          {userRole === "librarian" && (
            <div className={styles.managementSection}>
              <h2 className={styles.sectionTitle}>
                Management actions
              </h2>

              <div className={styles.managementButtons}>
                <button onClick={() => navigate("/create-order-librarian")}>
                  Create new Order
                </button>

                <button onClick={() => navigate("/create-book")}>
                  Create new Book
                </button>

                <button onClick={() => navigate("/create-author")}>
                  Create new Author
                </button>
              </div>
            </div>
          )}

          {/* BOOKS */}
          {userRole === "reader" && (
            <div className={styles.booksSection}>
              <h2 className={styles.booksTitle}>
                Books read:{" "}
                <span className={styles.booksCount}>
                  {readBooks.length}
                </span>
              </h2>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <tbody>
                    {paginatedBooks.map((book, index) => (
                      <tr key={index}>
                        <td
                          onClick={() => navigate(`/books/${book.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {book.title}
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
                    p * booksPerPage < readBooks.length
                      ? p + 1
                      : p
                  )
                }
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}