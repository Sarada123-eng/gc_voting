import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Vote from "./pages/Vote";
import BranchSelection from "./pages/BranchSelection";
import AlreadyVoted from "./pages/AlreadyVoted";
import { apiRequest } from "./api";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [branch, setBranch] = useState(null);
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
          <Route
            path="/login"
            element={<Login setIsAuth={setIsAuth} />}
          />

          <Route
            path="/select-branch"
            element={
              isAuth && (!branch || branch === "Unknown") ? (
                <BranchSelection />
              ) : (
                <Navigate to="/vote" />
              )
            }
          />

          <Route
            path="/vote"
            element={
              isAuth ? (
                branch && branch !== "Unknown" ? (
                  <Vote />
                ) : (
                  <Navigate to="/select-branch" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
  path="/thank-you"
  element={
    isAuth ? <AlreadyVoted /> : <Navigate to="/login" />
  }
/>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
