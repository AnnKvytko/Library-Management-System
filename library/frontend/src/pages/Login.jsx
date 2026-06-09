import { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const data = await loginUser(email, password);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/profile");

    } catch (err) {
      setError("Wrong credentials");
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    try {
      setError(null);

      const response = await fetch(
        "http://127.0.0.1:8000/api/password-reset/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setResetSent(true);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.textBlock}>
        <h1 className={styles.title}>Welcome back</h1>

        <form className={styles.form} onSubmit={handleLogin}>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          {/* RESET PASSWORD */}
          {error === "Wrong credentials" && (
            <p className={styles.registerText}>
              Forgot your password?{" "}
              <button
                type="button"
                onClick={handleResetPassword}
                className={styles.resetButton}
              >
                Reset here
              </button>
            </p>
          )}

          {/* SUCCESS */}
          {resetSent && (
            <p className={styles.success}>
              Reset email sent! Check your inbox.
            </p>
          )}

          {/* LOGIN BUTTON */}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>

          <button
            type="button"
            className={styles.googleButton}
            onClick={() => navigate("/home")}
          >
            <img src="/google.png" alt="Google" className={styles.googleIcon} />
            Continue with Google
          </button>

        </form>

        <p className={styles.registerText}>
          Don’t have an account?{" "}
          <Link to="/register" className={styles.link}>
            Create one
          </Link>
        </p>
      </div>

      <img src="/home.jpg" alt="Library" className={styles.image} />
    </div>
  );
}