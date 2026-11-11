import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  const avatarUrl = user?.avatar
    ? `http://localhost:5000${user.avatar}`
    : "https://via.placeholder.com/100";

  return (
    <div style={{ padding: "20px", maxWidth: "500px", background: "#f8f9fa" }}>
      <h2>Admin Profile ({user?.role?.toUpperCase()})</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0" }}>
        <img
          src={avatarUrl}
          alt="Admin Avatar"
          style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <h3>{user?.name}</h3>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>

      <div style={{ margin: "20px 0" }}>
        <h4>Bio</h4>
        <p>{user?.bio || "No admin bio added yet."}</p>
      </div>

      <Link to="/admin/profile/edit">
        <button style={{ padding: "8px 16px", cursor: "pointer" }}>Edit Admin Profile</button>
      </Link>
    </div>
  );
};

export default AdminProfile;