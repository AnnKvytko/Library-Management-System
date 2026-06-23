import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./OrderSuccess.module.css";

import { getCurrentUser } from "../api/authApi";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state;

  const [userRole, setUserRole] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
  
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

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!order) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>No order data found</h1>

          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/orders")}
          >
            Go to orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.icon}>✓</div>

        <h1 className={styles.title}>
          Order created successfully
        </h1>

        <p className={styles.subtitle}>
          Your order has been successfully registered.
        </p>

        <div className={styles.infoBox}>
          <div className={styles.row}>
            <span className={styles.label}>Order ID</span>
            <span className={styles.value}>
              {order.id || order.order_id}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Book</span>
            <span className={styles.bookTitle}>
              {order.book_title || order.book?.title || order.book_id}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Due date</span>
            <span className={styles.value}>
              {formatDate(order.due_date) || "Not set yet"}
            </span>
          </div>
        </div>

        <p className={styles.emailMessage}>
          A confirmation message was sent to{" "}
          <span className={styles.email}>
            {order.email || "user email"}
          </span>
        </p>

        <div className={styles.buttons}>
          {userRole === "librarian" && (
            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/orders")}
            >
              View orders
            </button>
          )}
          {userRole === "reader" && (
            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/taken-books")}
            >
              View taken books
            </button>
          )}
          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/books")}
          >
            Back to books
          </button>
        </div>
      </div>
    </div>
  );
}