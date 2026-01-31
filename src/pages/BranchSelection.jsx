import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { toast } from "react-toastify";

const BRANCHES = [
  "Civil",
  "Computer Science",
  "Mechanical",
  "Electrical",
  "ECE+Meta+EP",
  "M.Sc. + ITEP",
  "PhD",
];

function BranchSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!selected) {
      toast.error("Please select your branch");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/auth/set-branch", "POST", {
        branch: selected,
      });

      toast.success("Branch selected successfully");
      navigate("/vote");
    } catch (err) {
      toast.error(err.message || "Failed to save branch");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Select Your Branch</h1>

        <div className="branch-grid">
          {BRANCHES.map(branch => (
            <button
              key={branch}
              className={`branch-card ${
                selected === branch ? "active" : ""
              }`}
              onClick={() => setSelected(branch)}
            >
              {branch}
            </button>
          ))}
        </div>

        <button
          className="primary-btn"
          onClick={handleContinue}
          disabled={loading}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default BranchSelection;
