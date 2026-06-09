import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/password-reset-confirm/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uidb64,
            token,
            new_password: formData.new_password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Reset failed");
      }

      alert("Password reset successful!");

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/login");

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reset Password</h1>

      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.formSection}>

          {/* NEW PASSWORD */}
          <div className={styles.inputGroup}>
            <label>New password</label>

            <div className={styles.passwordWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
              />

              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowNewPassword((p) => !p)}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.inputGroup}>
            <label>Confirm new password</label>

            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
              />

              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirmPassword((p) => !p)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>

            <button type="submit" className={styles.saveBtn}>
              Reset password
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}