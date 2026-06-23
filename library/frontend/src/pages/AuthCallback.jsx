import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../api/profileApi";
import { API_BASE_URL } from "../api/config";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/google-token/`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Auth failed");

        const data = await res.json();

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        // ✅ ONLY THIS
        const profile = await getMyProfile();

        if (profile) {
          navigate("/profile");
        } else {
          navigate("/profile/edit");
        }

      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    run();
  }, [navigate]);

  return <p>Logging you in...</p>;
}