import { useState } from "react";
import { apiRequest } from "../api";
import { toast } from "react-toastify";

function AddCoordinator() {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [photo, setPhoto] = useState("");

  async function handleAdd() {
    await apiRequest("/admin/coordinator", "POST", {
      name,
      branch,
      photo
    });

    toast.success("Coordinator added");
    setName("");
    setBranch("");
    setPhoto("");
  }

  return (
    <div className="admin-page">
      <h2>Add Coordinator</h2>

      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Photo URL" value={photo} onChange={e => setPhoto(e.target.value)} />

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

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddCoordinator;
