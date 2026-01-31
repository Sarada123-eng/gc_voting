import { useEffect, useState, useMemo } from "react";

/* ---------------- TYPES ---------------- */

const MOCK_COORDINATORS = [
  { id: 1, name: "Priya Sharma", branch: "Computer Science", photoUrl: "https://i.pravatar.cc/150?img=1", _count: { votes: 127 } },
  { id: 2, name: "Rahul Verma", branch: "Computer Science", photoUrl: "https://i.pravatar.cc/150?img=3", _count: { votes: 98 } },
  { id: 3, name: "Ananya Patel", branch: "Electronics", photoUrl: "https://i.pravatar.cc/150?img=5", _count: { votes: 84 } },
  { id: 4, name: "Vikram Singh", branch: "Electronics", _count: { votes: 72 } },
  { id: 5, name: "Sneha Reddy", branch: "Mechanical", photoUrl: "https://i.pravatar.cc/150?img=9", _count: { votes: 65 } },
  { id: 6, name: "Arjun Nair", branch: "Mechanical", photoUrl: "https://i.pravatar.cc/150?img=11", _count: { votes: 58 } },
  { id: 7, name: "Kavya Iyer", branch: "Civil", photoUrl: "https://i.pravatar.cc/150?img=13", _count: { votes: 43 } },
  { id: 8, name: "Rohan Gupta", branch: "Civil", _count: { votes: 31 } },
];

const USE_MOCK_DATA = true;

/* ---------------- COMPONENT ---------------- */

export default function AdminDashboard() {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCK_DATA) {
          await new Promise((r) => setTimeout(r, 800));
          setCoordinators(
            [...MOCK_COORDINATORS].sort((a, b) =>
              a.branch.localeCompare(b.branch)
            )
          );
          return;
        }

        const res = await fetch("/admin/coordinators");

        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized");
        }

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setCoordinators(
          [...data].sort((a, b) => a.branch.localeCompare(b.branch))
        );
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return coordinators;
    const q = searchQuery.toLowerCase();
    return coordinators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q)
    );
  }, [coordinators, searchQuery]);

  const totalVotes = coordinators.reduce(
    (sum, c) => sum + c._count.votes,
    0
  );

  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  /* ---------------- RENDER ---------------- */

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: "#666" }}>
          Coordinator overview (read-only)
        </p>

        {!loading && !error && coordinators.length > 0 && (
          <div style={styles.stats}>
            <div style={styles.statCard}>
              <strong>Total Coordinators</strong>
              <div>{coordinators.length}</div>
            </div>
            <div style={styles.statCard}>
              <strong>Total Votes</strong>
              <div>{totalVotes}</div>
            </div>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2>Coordinators</h2>
            {!loading && !error && coordinators.length > 0 && (
              <input
                placeholder="Search by name or branch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.search}
              />
            )}
          </div>

          {loading && <p>⏳ Loading...</p>}

          {error && <p style={{ color: "red" }}>⚠ {error}</p>}

          {!loading && !error && coordinators.length === 0 && (
            <p>No data available</p>
          )}

          {!loading &&
            !error &&
            coordinators.length > 0 &&
            filtered.length === 0 && (
              <p>No results for "{searchQuery}"</p>
            )}

          {!loading && !error && filtered.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Branch</th>
                  <th style={{ textAlign: "right" }}>Votes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={styles.nameCell}>
                        {c.photoUrl ? (
                          <img
                            src={c.photoUrl}
                            alt={c.name}
                            style={styles.avatar}
                          />
                        ) : (
                          <div style={styles.fallback}>
                            {initials(c.name)}
                          </div>
                        )}
                        {c.name}
                      </div>
                    </td>
                    <td>{c.branch}</td>
                    <td style={{ textAlign: "right" }}>
                      {c._count.votes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "24px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "16px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  search: {
    padding: "6px 10px",
  },
  stats: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
  statCard: {
    background: "#fff",
    padding: "12px",
    borderRadius: "8px",
    flex: 1,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
  },
  fallback: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },
};
