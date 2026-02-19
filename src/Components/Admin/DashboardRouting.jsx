import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./Header";
import Sidebar from "./Sidebar";

import DashboardBase from "./Dashboard/DashboardBase";
import UserDetailDashboard from "./SideBar_Content/UserDetailsDashboard";
import ManageUsers from "./Dashboard/ManageUsers";

import DepositsStatus from "./admin/DepositsStatus";
import WithdrawalStatus from "./admin/WithdrawalStatus";
import IbWithdrawalStatus from "./admin/IbWithdrawalStatus";
import ManualGetways from "./admin/ManualGetways";
import LoginLogs from "./admin/LoginLogs";
import AdminIbZone from "./admin/AdminIbZone";
import KycUsers from "./admin/KycUsers";
import AdminAccountsTable from "./AdminAccountsTable";


const cx = (...c) => c.filter(Boolean).join(" ");

const GridPattern = () => (
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <svg width="100%" height="100%">
      <defs>
        <pattern id="admin-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M 44 0 L 0 0 0 44"
            fill="none"
            stroke="rgba(34, 197, 94, 0.14)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#admin-grid)" />
    </svg>
  </div>
);

const Orbs = () => (
  <div className="pointer-events-none">
    <motion.div
      className="absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-25"
      style={{
        background: "radial-gradient(circle, rgba(34,197,94,0.45) 0%, transparent 70%)",
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.16, 0.28, 0.16] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full blur-3xl opacity-20"
      style={{
        background: "radial-gradient(circle, rgba(59,130,246,0.30) 0%, transparent 70%)",
      }}
      animate={{ scale: [1.1, 1, 1.1], opacity: [0.20, 0.12, 0.20] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const RouteShell = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 24 }}
    className="h-full"
  >
    {children}
  </motion.div>
);
                                       
const DashboardRouting = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/40 to-black pointer-events-none" />
      <div className="absolute inset-0 z-0">
        <Orbs />
        <GridPattern />
      </div>

      {/* Layout container */}
      <div className="relative z-10 min-h-screen">
        <div className="  sm:px-6 py-4">
          <div className="flex md:gap-5">
            {/* ✅ Left Sidebar (desktop) + mobile drawer inside component */}
            <Sidebar />

            {/* ✅ Right */}
            <div className="md:flex-1 min-w-0">
              {/* ✅ Sticky Header */}
              <div className="sticky top-4 ">
                <div
                  className={cx(
                    "rounded-3xl p-[1px]",
                    "bg-gradient-to-r from-emerald-500/30 via-green-500/15 to-cyan-500/20",
                    "shadow-[0_0_40px_rgba(34,197,94,0.16)]"
                  )}
                >
                  <div className="rounded-3xl border border-emerald-500/20 bg-black/55 backdrop-blur-2xl">
                    <Header />
                  </div>
                </div>
              </div>

              {/* ✅ Content shell */}
              <div className="mt-5 rounded-[28px] p-[1px] bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/10">
                <div className="rounded-[28px] border border-emerald-500/15 bg-black/40 backdrop-blur-xl min-h-[calc(100vh-160px)] p-4 sm:p-6 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route
                        index
                        element={
                          <RouteShell>
                            <DashboardBase />
                          </RouteShell>
                        }
                      />
                      <Route
                        path="dashboard"
                        element={
                          <RouteShell>
                            <DashboardBase />
                          </RouteShell>
                        }
                      /> 

                       <Route path="details/:id" element={<RouteShell><AdminAccountsTable /></RouteShell>} />
                        
                      {/* Admin modules */}
                      <Route path="manage-users/:subList" element={<ManageUsers />} />
                      <Route path="user-detail/:id" element={<UserDetailDashboard />} />

                      <Route path="deposit/:status" element={<DepositsStatus />} />
                      <Route path="withdrawal/:status" element={<WithdrawalStatus />} />



                      <Route path="ib-withdrawal/:status" element={<IbWithdrawalStatus />} />
                    
                      <Route path="getway/manual" element={<ManualGetways />} />


                      <Route path="login-logs" element={<LoginLogs />} />
                      
                      <Route path="ib-zone" element={<AdminIbZone />} />

                      <Route path="kyc-users" element={<KycUsers />} />


                      {/* catch */}
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pb-2">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-200/60">
                  <span className="tracking-wide">Admin Console</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
                    Online
                  </span>
                </div>
              </div>
            </div>
            {/* end right */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRouting;
