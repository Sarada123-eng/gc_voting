
const API_BASE = "http://localhost:3000/api";

export async function apiRequest(endpoint, method = "GET", body) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
}
