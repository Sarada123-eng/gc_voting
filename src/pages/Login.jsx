import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../api";

function Login({ setIsAuth }) {
  const navigate = useNavigate();

  async function handleGoogleSuccess(credentialResponse) {
    try {
      const res = await apiRequest("/auth/google", "POST", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.token);
      setIsAuth(true);

      toast.success("Login successful 🎉");
      navigate("/vote");
    } catch (err) {
      toast.error(err.message || "Google login failed");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h1 className="auth-title">GC Coordinator Voting</h1>

        <p className="auth-subtitle">
          Login using your IIT Bhubaneswar Google account
        </p>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google Login Failed")}
          useOneTap
        />
      </div>
    </div>
  );
}

export default Login;
