import { useNavigate } from "react-router-dom";

function AlreadyVoted() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="vote-page">
      <div className="vote-card fade-in">
        <h2 className="vote-title">Thank You for Voting 🙏</h2>

        <p className="vote-subtitle">
          Your vote has been recorded successfully.
        </p>

        <p style={{ marginTop: "16px", opacity: 0.8 }}>
          You can no longer vote again.
        </p>

        <button
          className="secondary-btn logout-btn"
          onClick={handleLogout}
          style={{ marginTop: "24px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AlreadyVoted;
