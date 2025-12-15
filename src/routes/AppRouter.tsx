import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import LeaderBoard from "@/pages/LeaderBoard";
import Refferal from "@/pages/Refferal";
import Cashback from "@/pages/Cashback";
import OfferTaskPage from "@/pages/OfferTask";
import ProfilePage from "@/pages/Profile";
import WalletManagement from "@/pages/Wallet";
import SignupForm from "@/pages/Signup";

import Users from "@/pages/admin/Users";
import NotFoundPage from "@/pages/Notfound";
import CashbackManagement from "@/pages/admin/CashbackManagement";
import TaskManagement from "@/pages/admin/TaskManagement";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import TransactionManagementPage from "@/pages/admin/Transaction";
import AdminDashboard from "@/pages/admin/DashboardAdmin";
import ConfigManagement from "@/pages/admin/ConfigManagent";
import TaskSubmissionManagement from "@/pages/admin/TaskSubmissionManagement";
import AdminLogin from "@/pages/admin/Login";

import SettingsPage from "@/pages/Setting";
import Activities from "@/pages/Activities";
import HomePage from "@/pages/Home";

import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { GuestRoute } from "./GuestRoute";
import { ClientRoute } from "./ClientRoute";
import UserDetailPage from "@/pages/admin/UserDetail";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* ===== AUTH PAGES ===== */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <SignupForm />
          </GuestRoute>
        }
      />

      <Route
        path="/admin/login"
        element={
          <GuestRoute>
            <AdminLogin />
          </GuestRoute>
        }
      />

      {/* ===== CLIENT ROUTES ===== */}
      <Route element={<ClientRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ranks" element={<LeaderBoard />} />
        <Route path="/referrals" element={<Refferal />} />
        <Route path="/cashback" element={<Cashback />} />
        <Route path="/tasks" element={<OfferTaskPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletManagement />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* ===== ADMIN ROUTES ===== */}
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="management-cashback" element={<CashbackManagement />} />
          <Route path="management-task" element={<TaskManagement />} />
          <Route path="user/:id" element={<UserDetailPage />} />
          <Route
            path="management-notification"
            element={<NotificationManagement />}
          />
          <Route
            path="management-transactions"
            element={<TransactionManagementPage />}
          />
          <Route path="management-configs" element={<ConfigManagement />} />
          <Route path="submissions" element={<TaskSubmissionManagement />} />
        </Route>
      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
