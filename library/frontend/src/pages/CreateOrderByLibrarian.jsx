import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateOrderByLibrarian.module.css";

import { createOrder } from "../api/ordersApi";

export default function CreateOrderByLibrarian() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    book_id: "",
    weeks: 1,
    status: "pending",
  });


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "weeks"
          ? Number(e.target.value)
          : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const createdOrder = await createOrder(formData);

      navigate("/order-success", { state: createdOrder });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Order</h1>

      <form className={styles.container} onSubmit={handleSubmit}>

        <div className={styles.formSection}>

          <div className={styles.inputGroup}>
            <label>User ID</label>
            <input
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              type="text"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Book ID</label>
            <input
              name="book_id"
              value={formData.book_id}
              onChange={handleChange}
              type="text"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Weeks</label>
            <input
              name="weeks"
              value={formData.weeks}
              onChange={handleChange}
              type="number"
              min="1"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/orders")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create order"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}