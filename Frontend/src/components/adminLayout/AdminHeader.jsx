import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminHeader = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{
      background: "#1e293b",
      color: "#fff",
      padding: "15px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h3>Admin Portal Control Center</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>Welcome, <strong>{user?.name}</strong></span>
        <button 
          onClick={logout} 
          style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;