import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Vote from "./pages/Vote";
import BranchSelection from "./pages/BranchSelection";
import AlreadyVoted from "./pages/AlreadyVoted";
import AdminDashboard from "./pages/AdminDashboard";
import { apiRequest } from "./api";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [branch, setBranch] = useState(null);
  const [role, setRole] = useState(null); // "student" | "admin"
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiRequest("/auth/me");
        setIsAuth(true);
        setBranch(res.branch);
        setHasVoted(res.hasVoted);

        // role comes from JWT payload (stored during login)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) return null;

  return (
    <>
      <div className="header">GC Coordinator Voting System</div>

      <div className="page">
        <Routes>
          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login setIsAuth={setIsAuth} />}
          />

          {/* BRANCH SELECTION */}
          <Route
            path="/select-branch"
            element={
              isAuth && role === "student" && (!branch || branch === "Unknown") ? (
                <BranchSelection />
              ) : (
                <Navigate to="/vote" />
              )
            }
          />

          {/* VOTE */}
          <Route
            path="/vote"
            element={
              isAuth && role === "student" ? (
                hasVoted ? (
                  <Navigate to="/thank-you" />
                ) : branch && branch !== "Unknown" ? (
                  <Vote />
                ) : (
                  <Navigate to="/select-branch" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* THANK YOU */}
          <Route
            path="/thank-you"
            element={
              isAuth && role === "student" ? (
                <AlreadyVoted />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              isAuth && role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
