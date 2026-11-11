import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AdminHeader />
      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: "25px", background: "#f8fafc" }}>
          <Outlet /> {/* Yahan Admin pages render hongy */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;