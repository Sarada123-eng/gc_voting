import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { toast } from "react-toastify";

function Login({ setIsAuth }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------- GOOGLE INIT ----------
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      { theme: "outline", size: "large", width: 280 }
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
      toast.success("Logged in with Google");
      navigate("/vote");
    } catch (err) {
      toast.error(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  // ---------- EMAIL LOGIN ----------
  async function handleLogin() {
    try {
      setLoading(true);
      const res = await apiRequest("/auth/login", "POST", {
        email,
        password,
      });

      localStorage.setItem("token", res.token);
      setIsAuth(true);
      toast.success("Login successful");
      navigate("/vote");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    if (!email || !password || !branch) {
      toast.error("All fields required");
      return;
    }

    if (!email.toLowerCase().endsWith("@iitbbs.ac.in")) {
      toast.error("Use IIT Bhubaneswar email");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/auth/signup", "POST", {
        email,
        password,
        branch,
      });

      toast.success("Account created. Login now.");
      setMode("login");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{mode === "login" ? "Login" : "Signup"}</h1>

        {/* GOOGLE BUTTON */}
        <div id="google-btn" style={{ marginBottom: "16px" }} />

        <div className="divider">OR</div>

        <input
          type="email"
          placeholder="joe@iitbbs.ac.in"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <select value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="">Select branch</option>
            <option value="Civil">Civil</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electrical">Electrical</option>
            <option value="ECE+Meta+EP">ECE+Meta+EP</option>
            <option value="M.Sc. + ITEP">M.Sc. + ITEP</option>
            <option value="PhD">PhD</option>
          </select>
        )}

        {mode === "login" ? (
          <button onClick={handleLogin} disabled={loading}>
            Login
          </button>
        ) : (
          <button onClick={handleSignup} disabled={loading}>
            Signup
          </button>
        )}

        <button
          className="secondary"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "Create account"
            : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}

export default Login;
