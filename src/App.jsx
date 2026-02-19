import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

import DashboardRouting from "./Components/Admin/DashboardRouting";
import AuthForm from "./Components/Auth/AuthForm";
import LoadingModal from "./LoadingModal";
import SuperAdmin_DashboardRouting from "./Components/SuperAdmin/DashboardRouting";
import PasswordScreen from "./Components/SuperAdmin/PasswordScreen";
import UserDashboardRouting from "./Components/user/UserDashboardRouting";
import UserLogin from "./Components/user/UserLogin";
import UserSignUp from "./Components/user/UserSignUp";
import UserVerify from "./Components/user/UserVerify";
import UserResetPassword from "./Components/user/UserResetPassword";

const RequireAuth = ({ children }) => {
  const location = useLocation();

  // Admin authentication
  const isAdmin = localStorage.getItem("admin_password_ref");

  // Super Admin authentication
  const superAdminData = sessionStorage.getItem("adminAuth");
  const isSuperAdmin =
    superAdminData &&
    (() => {
      try {
        const { isAuthenticated, expiry } = JSON.parse(superAdminData);
        return isAuthenticated && Date.now() < expiry;
      } catch {
        return false;
      }
    })();

  // User authentication
  const isUser = useSelector((store) => store.user.loggedUser);

  if (location.pathname.startsWith("/admin")) {
    return isAdmin ? children : <Navigate to="/admin/login" replace />;
  }

  if (location.pathname.startsWith("/s-admin")) {
    return isSuperAdmin ? children : <Navigate to="/s-admin/login" replace />;
  }

  if (location.pathname.startsWith("/user")) {
    return isUser ? (
      children
    ) : (
      <Navigate
        to="/user/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Suspense fallback={<LoadingModal />}>
        <Routes>
          <Route path="/" element={<Navigate to="/user/login" replace />} />

          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignUp />} />
          <Route path="/user/signup/:id" element={<UserSignUp />} />
          <Route path="/user/verify/:id/:token" element={<UserVerify />} />
          <Route path="/user/reset-password/:token" element={<UserResetPassword />} />

          <Route path="/admin/login" element={<AuthForm />} />

          <Route
            path="/s-admin/login"
            element={
              <PasswordScreen onAuthenticate={() => window.location.replace("/s-admin")} />
            }
          />

          <Route
            path="/user/*"
            element={
              <RequireAuth>
                <UserDashboardRouting />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/*"
            element={
              <RequireAuth>
                <DashboardRouting />
              </RequireAuth>
            }
          />

          <Route
            path="/s-admin/*"
            element={
              <RequireAuth>
                <SuperAdmin_DashboardRouting />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/user" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
