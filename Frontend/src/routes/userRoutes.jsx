import { Route } from "react-router-dom";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import UserLayout from "../components/userLayout/UserLayout";
import DashboardLayout from "../components/userLayout/DashboardLayout"; // Naya Sidebar layout

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

import UserLogin from "../pages/user/UserLogin";
import UserRegister from "../pages/user/UserRegister";
import ForgotPassword from "../pages/user/ForgotPassword";

import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import EditProfile from "../pages/user/EditProfile";
import ChangePassword from "../pages/user/ChangePassword";
import Workout from "../pages/user/WorkoutTracker";
import NutritionTracker from "../pages/user/NutritionTracker";
import ProgressTracker from "../pages/user/ProgressTracker";

export const UserRoutesList = (
  <>
    {/* --- 1. Auth & Public Non-Sidebar Pages --- */}
    <Route path="/user/login" element={<UserLogin />} />
    <Route path="/user/register" element={<UserRegister />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    {/* --- 2. Public Pages (Header & Footer only, NO Sidebar) --- */}
    <Route element={<UserLayout />}>
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Route>

    {/* --- 3. Protected User Portal (Sidebar + Protected Routes) --- */}
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/workouts" element={<Workout />} />
        <Route path="/user/nutrition" element={<NutritionTracker />} />
        <Route path="/user/progress" element={<ProgressTracker />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/profile/edit" element={<EditProfile />} />
        <Route path="/user/change-password" element={<ChangePassword />} />
      </Route>
    </Route>
  </>
);