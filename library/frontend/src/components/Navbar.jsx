import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

import { getCurrentUser } from "../api/authApi";

export default function Navbar() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const isAuthenticated = !!localStorage.getItem("access");

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) {
        setUserRole(null);
        return;
      }

      try {
        const user = await getCurrentUser();
        setUserRole(user?.role);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUserRole(null);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    };

    init();
  }, [isAuthenticated]);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.brand}>Library</span>

        <div className={styles.links}>
          <Link to="/home" className={styles.link}>Home</Link>
          <Link to="/books" className={styles.link}>Books</Link>
          <Link to="/authors" className={styles.link}>Authors</Link>
        </div>
      </div>

      <div className={styles.right}>
        {userRole === "reader" && (
          <>
            <Link to="/favorites" className={styles.link}>Favorites</Link>
            <Link to="/taken-books" className={styles.link}>Taken books</Link>
          </>
        )}
        {userRole === "librarian" && (
          <>
            <Link to="/readers" className={styles.link}>Readers</Link>
            <Link to="/orders" className={styles.link}>Orders</Link>
          </>
        )}

        {/* PROFILE ICON LOGIC */}
        {!isAuthenticated && (
          <button
            onClick={handleProfileClick}
            className={styles.profileIcon}
          >
            <FaUserCircle />
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={handleProfileClick}
            className={styles.profileIconAuthenticated}
          >
            <FaUserCircle />
          </button>
        )}
      </div>
    </nav>
  );
}

