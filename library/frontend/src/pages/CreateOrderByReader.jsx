import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CreateOrderByReader.module.css";

import { fetchBookById } from "../api/booksApi";
import { getCurrentUser } from "../api/authApi";

export default function CreateOrderByReader() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [weeks, setWeeks] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        console.log("Missing book id in route");
        setLoading(false);
        return;
      }

      try {
        const [bookData, userData] = await Promise.all([
          fetchBookById(id),
          getCurrentUser(),
        ]);

        setBook({
          id: bookData.id,
          title: bookData.title,
          author:
            typeof bookData.author === "object"
              ? `${bookData.author.first_name} ${bookData.author.last_name}`
              : bookData.author_name || bookData.author,
          image: bookData.photo,
        });

        setUser(userData);
      } catch (err) {
        console.log("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!book || !user) return <p>Not found</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      user_id: user.user_id,
      book_id: book.id,
      weeks,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.log("ORDER ERROR:", text);
        return;
      }

      const createdOrder = await response.json();

      navigate("/order-success", {
        state: createdOrder,
      });

    } catch (err) {
      console.log("Order failed:", err);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Order</h1>

      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.leftSection}>
          <img src={book.image?.trim() ? book.image : "/books/book.jpg"} alt={book.title} className={styles.image} />
        </div>

        <div className={styles.formSection}>
          <div className={styles.bookInfo}>
            <h2 className={styles.bookTitle}>{book.title}</h2>
            <p className={styles.author}>{book.author}</p>
          </div>

          <div className={styles.inputGroup}>
            <label>Borrowing period (weeks)</label>
            <input
              type="number"
              min="1"
              max="12"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button type="submit" className={styles.submitBtn}>
              Submit order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}