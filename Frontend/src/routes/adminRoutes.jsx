import { Route } from "react-router-dom";
import AdminLayout from "../components/adminLayout/AdminLayout";
import AdminRoute from "../components/guards/AdminRoute";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminEditProfile from "../pages/admin/AdminEditProfile";
import AdminMessages from "../pages/admin/AdminMessages";

export const AdminRoutesList = (
  <>
  
    {/* Protected Admin Routes With Admin Layout */}
    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/profile/edit" element={<AdminEditProfile />} />
        <Route path="/admin/contacts" element={<AdminMessages />} />
      </Route>
    </Route>
  </>
);