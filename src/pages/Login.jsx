import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";


function Login({ setIsAuth }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const res = await apiRequest("/auth/login", "POST", {
        email,
        password
      });

      localStorage.setItem("token", res.token);
      setIsAuth(true);
      navigate("/vote");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    setError("");

    if (!email || !password || !branch) {
      setError("All fields are required");
      return;
    }

    const emailLower = email.toLowerCase();

    if (!emailLower.endsWith("@iitbbs.ac.in")) {
      setError("Use your IIT Bhubaneswar email ID");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/signup", "POST", {
        email,
        password,
        branch
      });
      setMode("login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h1 className="auth-title">
          {mode === "login" ? "Login to Your Account" : "Create an Account"}
        </h1>

        <p className="auth-subtitle">
          {mode === "login"
            ? "Welcome back! Please enter your details"
            : "Sign up to participate in GC voting"}
        </p>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="joe@iitbbs.ac.in"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <>
            <label>Branch</label>
            <select
              value={branch}
              onChange={e => setBranch(e.target.value)}
            >
              <option value="">Select branch</option>
              <option value="Civil">Civil</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="ECE+Meta+EP">ECE+Meta+EP</option>
              <option value="M.Sc. + ITEP">M.Sc. + ITEP</option>
              <option value="M.tech.">M.tech.</option>
              <option value="PhD">PhD</option>
            </select>
          </>
        )}

        {mode === "login" ? (
          <button
            className="primary-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            Login
          </button>
        ) : (
          <button
            className="primary-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            Signup
          </button>
        )}

        <button
          className="secondary-btn"
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
