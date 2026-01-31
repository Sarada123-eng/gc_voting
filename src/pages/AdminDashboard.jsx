import { useEffect, useState } from "react";
import { apiRequest } from "../api";

function AdminDashboard() {
  const [branch, setBranch] = useState("");
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    fetchData();
  }, [branch]);

  async function fetchData() {
    const query = branch ? `?branch=${branch}` : "";
    const data = await apiRequest(`/admin/coordinators${query}`);
    setCoordinators(data);
  }

  return (
    <div className="admin-page">
      <h2>Admin – Results</h2>

      <select value={branch} onChange={e => setBranch(e.target.value)}>
        <option value="">All branches</option>
        <option value="Civil">Civil</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Mechanical">Mechanical</option>
        <option value="Electrical">Electrical</option>
        <option value="ECE+Meta+EP">ECE+Meta+EP</option>
        <option value="M.Sc. + ITEP">M.Sc. + ITEP</option>
        <option value="PhD">PhD</option>
      </select>

      {coordinators.map(c => (
        <div key={c.id} className="admin-card">
          <img src={c.photoUrl || "/avatar.png"} alt={c.name} className="admin-photo" />
          <p>{c.name}</p>
          <p>{c.branch}</p>
          <strong>Votes: {c._count.votes}</strong>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
