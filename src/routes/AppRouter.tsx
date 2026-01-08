import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import LeaderBoard from "@/pages/LeaderBoard";
import Refferal from "@/pages/Refferal";
import Cashback from "@/pages/Cashback";
import OfferTaskPage from "@/pages/OfferTask";
import OfferDetail from "@/pages/OfferDetail";
import ProfilePage from "@/pages/Profile";
import WalletManagement from "@/pages/Wallet";
import SignupForm from "@/pages/Signup";
import SignupRedirect from "@/pages/SignupRedirect";
import NotificationPage from "@/pages/Notification";
import NotificationDetail from "@/pages/NotificationDetail";
import ScrollToTopOnNavigate from "@/components/common/ScrollToTopOnNavigate";

import Users from "@/pages/admin/Users";
import FinancialManagement from "@/pages/admin/FinancialManagement";
import NotFoundPage from "@/pages/Notfound";
import CashbackManagement from "@/pages/admin/CashbackManagement";
import TaskManagement from "@/pages/admin/TaskManagement";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import AdminDashboard from "@/pages/admin/DashboardAdmin";
import ConfigManagement from "@/pages/admin/ConfigManagent";
import TaskSubmissionManagement from "@/pages/admin/TaskSubmissionManagement";
import AdminLogin from "@/pages/admin/Login";
import LinkManagement from "@/pages/admin/LinkManagement";
import OrderTracking from "@/pages/admin/OrderTracking";
import PlatformManagement from "@/pages/admin/PlatformManagement";
import AffiliateManagement from "@/pages/admin/AffiliateManagement";
import AffiliateProductManagement from "@/pages/admin/AffiliateProductManagement";

import SettingsPage from "@/pages/Setting";
import Activities from "@/pages/Activities";
import HomePage from "@/pages/Home";
import CashbackHistory from "@/pages/CashbackHistory";
import GuidePage from "@/pages/Guide";
import LuckyWheelPage from "@/pages/LuckyWheel";

import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { GuestRoute } from "./GuestRoute";
import { ClientRoute } from "./ClientRoute";
import UserDetailPage from "@/pages/admin/UserDetail";
import SystemSettingsPage from "@/pages/admin/SystemSettings";
import TestIntegrationPage from "@/pages/TestIntegrationPage";
import LuckyWheelAdmin from "@/pages/admin/LuckyWheelAdmin";
import ActivityEarningManagement from "@/pages/admin/ActivityEarningManagement";
import TaskHistory from "@/pages/TaskHistory";

export const AppRouter = () => (
  <BrowserRouter>
    <ScrollToTopOnNavigate />
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
        path="/signup"
        element={
          <GuestRoute>
            <SignupRedirect />
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
        <Route path="/tasks/:id" element={<OfferDetail />} />
        <Route path="/task-history" element={<TaskHistory />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletManagement />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/luckywheel" element={<LuckyWheelPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/cashback-history" element={<CashbackHistory />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/notifications/:id" element={<NotificationDetail />} />

        {/* Test page for development */}
        <Route path="/test-leaderboard" element={<TestIntegrationPage />} />
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
            path="financial-management"
            element={<FinancialManagement />}
          />
          <Route path="management-configs" element={<ConfigManagement />} />
          <Route path="submissions" element={<TaskSubmissionManagement />} />
          <Route path="link-management" element={<LinkManagement />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          <Route path="platform-management" element={<PlatformManagement />} />
          <Route
            path="affiliate-management"
            element={<AffiliateManagement />}
          />
          <Route
            path="affiliate-products"
            element={<AffiliateProductManagement />}
          />
          <Route path="system-settings" element={<SystemSettingsPage />} />
          <Route path="luckywheel" element={<LuckyWheelAdmin />} />
          <Route
            path="activity-earnings"
            element={<ActivityEarningManagement />}
          />
        </Route>
      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
