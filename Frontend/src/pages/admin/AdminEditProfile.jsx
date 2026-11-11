import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const AdminEditProfile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      if (user.avatar) {
        setPreview(`http://localhost:5000${user.avatar}`);
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await API.put("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const token = localStorage.getItem("token");
      login(response.data, token);

      // Successful update ke baad Admin Profile page par redirect
      navigate("/admin/profile");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update admin profile");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", background: "#f8f9fa" }}>
      <h2>Edit Admin Profile</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {preview && (
        <img
          src={preview}
          alt="Avatar Preview"
          style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
        />
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
        <div>
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", margin: "8px 0" }}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", margin: "8px 0" }}
          />
        </div>
        <div>
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: "100%", margin: "8px 0" }}
          />
        </div>
        <button type="submit" style={{ marginRight: "10px" }}>Save Changes</button>
        <button type="button" onClick={() => navigate("/admin/profile")}>Cancel</button>
      </form>
    </div>
  );
};

export default AdminEditProfile;