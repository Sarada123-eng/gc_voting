import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { toast } from "react-toastify";

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ---------- GOOGLE INIT ----------
  useEffect(() => {
    if (!window.google) {
      toast.error("Google SDK not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      {
        theme: "outline",
        size: "large",
        width: 280,
      }
    );
  }, []);

  async function handleGoogleLogin(response) {
    try {
      setLoading(true);

      const res = await apiRequest("/auth/google", "POST", {
        token: response.credential,
      });

      localStorage.setItem("token", res.token);
      setIsAuth(true);

      toast.success("Logged in with IIT Bhubaneswar Google account");
      navigate("/vote");
    } catch (err) {
      toast.error(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">GC Voting Login</h1>

        <p className="auth-subtitle">
          Only <b>@iitbbs.ac.in</b> Google accounts are allowed
        </p>

        {/* GOOGLE BUTTON */}
        <div id="google-btn" style={{ marginTop: "20px" }} />

        {loading && (
          <p style={{ marginTop: "12px", opacity: 0.7 }}>
            Signing you in...
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
