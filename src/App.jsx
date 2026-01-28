import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Vote from "./pages/Vote";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync auth state once on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
    setLoading(false);
  }, []);

  // Prevent route flicker
  if (loading) {
    return null;
  }

  return (
    <>
      <div className="header">
        GC Coordinator Voting System
      </div>

      <div className="page">
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuth={setIsAuth} />}
          />

          <Route
            path="/vote"
            element={
              isAuth ? (
                <Vote setIsAuth={setIsAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
