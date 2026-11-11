import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f8ff" }}>
      <h1>Admin Control Panel</h1>
      <p>Welcome, Admin {user?.name}!</p>
      <button onClick={logout}>Admin Logout</button>
    </div>
  );
};

export default AdminDashboard;