import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside style={{
      width: "220px",
      background: "#0f172a",
      color: "#fff",
      minHeight: "calc(100vh - 60px)",
      padding: "20px 10px"
    }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link to="/admin/dashboard" style={{ color: "#cbd5e1", textDecoration: "none", padding: "8px" }}>
          📊 Dashboard
        </Link>
        <Link to="/admin/profile" style={{ color: "#cbd5e1", textDecoration: "none", padding: "8px" }}>
          👤 Admin Profile
        </Link>
        <Link to="/admin/users" style={{ color: "#cbd5e1", textDecoration: "none", padding: "8px" }}>
          👥 Manage Users
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;