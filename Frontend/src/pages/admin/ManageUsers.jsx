import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((u, index) => (
            <li key={index}>{u.name || u.email}</li>
          ))}
        </ul>
      ) : (
        <p>No user data loaded yet.</p>
      )}
    </div>
  );
};

export default ManageUsers;