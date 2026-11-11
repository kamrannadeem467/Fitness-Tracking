import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/login", { email, password });
      const { user, token } = response.data;

      // Strict Admin Role Check
      if (user.role !== "admin") {
        setError("Unauthorized access! You are not an Admin.");
        return;
      }

      login(user, token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Admin Login failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", background: "#f8f9fa" }}>
      <h2>Admin Portal Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login to Admin Portal</button>
      </form>
    </div>
  );
};

export default AdminLogin;