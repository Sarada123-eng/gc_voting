import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function Vote() {
  const navigate = useNavigate();

  const [coordinators, setCoordinators] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  async function fetchCoordinators() {
    try {
      const data = await apiRequest("/coordinators");
      setCoordinators(data);
    } catch (err) {
      setMessage(err.message || "Failed to load coordinators");
    }
  }

  async function handleVote(coordinatorId) {
  setLoading(true);
  setMessage("");

  try {
    await apiRequest(`/vote/${coordinatorId}`, "POST");
    navigate("/thank-you");
  } catch (err) {
    setMessage(err.message || "Voting failed");
  } finally {
    setLoading(false);
  }
}


  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="vote-page">
      <div className="vote-card fade-in">
        <h2 className="vote-title">Branch Coordinator Election</h2>
        <p className="vote-subtitle">
          You can vote only once. Please choose carefully.
        </p>

        {message && (
          <p className={hasVoted ? "success" : "error"}>
            {message}
          </p>
        )}

        <div className="vote-list">
          {coordinators.map(coord => (
            <div key={coord.id} className="vote-item-modern">
              <img
                src={coord.photoUrl}
                alt={coord.name}
                className="coord-photo"
              />

              <div className="coord-info">
                <p className="vote-name">{coord.name}</p>

                <button
                  onClick={() => handleVote(coord.id)}
                  disabled={loading || hasVoted}
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="secondary-btn logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Vote;
