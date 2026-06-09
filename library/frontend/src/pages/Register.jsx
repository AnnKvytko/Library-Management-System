import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import styles from "./Register.module.css";

import { registerUser } from "../api/authApi";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "reader",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM SUBMIT WORKS", formData);

    try {
      setLoading(true);
      setError(null);

      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        role: formData.role,
      });

      console.log("REGISTER SUCCESS:", data);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/profile/edit");
    } catch (err) {
      console.log("REGISTER FAILED:", err);
      setError(err?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.textBlock}>

        <h1 className={styles.title}>
          Create account
        </h1>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          <div className={styles.inputGroup}>
            <label>Username</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm password</label>
            <input
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Register as</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="reader">Reader</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create account"}
          </button>

          <button
            type="button"
            className={styles.googleButton}
            onClick={() =>
              navigate("/home")
            }
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>

        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link
            to="/login"
            className={styles.link}
          >
            Log in
          </Link>
        </p>

      </div>

      <img
        src="/home.jpg"
        alt="Library"
        className={styles.image}
      />

    </div>
  );
}