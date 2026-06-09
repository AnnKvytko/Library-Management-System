import { useEffect, useState } from "react";
import styles from "./OrderDetail.module.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  fetchOrderById,
  updateOrder,
  deleteOrder,
} from "../api/ordersApi";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleSave = async () => {
    try {
      const updated = await updateOrder(id, {
        status: order.status,
      });

      setOrder(updated);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder(id);
      navigate("/orders");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className={styles.page}>Loading...</div>;
  if (error) return <div className={styles.page}>{error}</div>;
  if (!order) return null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Order{" "}
        <span className={styles.orderId}>{order.id}</span>
      </h1>

      <div className={styles.content}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>Reader</th>
                <td>
                  <Link
                    to={`/readers/${order.user.user_id}`}
                    className={styles.link}
                  >
                    {order.user?.email}
                  </Link>
                </td>
              </tr>

              <tr>
                <th>Book</th>
                <td>
                  <Link
                    to={`/books/${order.book.id}`}
                    className={styles.link}
                  >
                    {order.book?.title}
                  </Link>
                </td>
              </tr>

              <tr>
                <th>Status</th>
                <td className={styles[order.status]}>
                  {isEditing ? (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        setOrder({
                          ...order,
                          status: e.target.value,
                        })
                      }
                      className={styles.select}
                    >
                      <option value="pending">pending</option>
                      <option value="borrowed">borrowed</option>
                      <option value="returned">returned</option>
                      <option value="expired">expired</option>
                    </select>
                  ) : (
                    order.status
                  )}
                </td>
              </tr>

              <tr>
                <th>Due date</th>
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
            </tbody>
          </table>
        </div>

        <div className={styles.actions}>
          {!isEditing ? (
            <>
              <button
                className={styles.editBtn}
                onClick={() => setIsEditing(true)}
              >
                Edit ✏️
              </button>

              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
              >
                Delete 🗑
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className={styles.cancelBtn}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}