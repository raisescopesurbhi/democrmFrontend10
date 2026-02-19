import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./Header";
import Sidebar from "./Sidebar";

import Platform from "./SideBar_Content/Platform/Platform";
import GroupManagement from "./SideBar_Content/Groups/GroupManagement";
import AccountTypes from "./SideBar_Content/ConfigureAccountType/AccountTypes";
import SadminSiteConfiguration from "./SideBar_Content/SadminSiteConfiguration";
import SadminAdminInfo from "./SideBar_Content/SadminInfo";
import UISettings from "./SideBar_Content/UISettings"

const cx = (...c) => c.filter(Boolean).join(" ");

const GridPattern = () => (
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <svg width="100%" height="100%">
      <defs>
        <pattern id="super-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M 44 0 L 0 0 0 44"
            fill="none"
            stroke="rgba(34, 197, 94, 0.14)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#super-grid)" />
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
        background: "radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)",
      }}
      animate={{ scale: [1.1, 1, 1.1], opacity: [0.22, 0.12, 0.22] }}
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

const SuperAdmin_DashboardRouting = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-500/30 to-purple-500/30 pointer-events-none" />
      <div className="absolute inset-0 z-0">
        <Orbs />
        <GridPattern />
      </div>

      {/* Layout Container */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-full px-4 sm:px-6 py-4">
          <div className="flex gap-5">
            {/* ✅ Desktop Sidebar */}
            <Sidebar />

            {/* ✅ Right side */}
            <div className="flex-1 min-w-0">
              {/* ✅ Sticky Header */}
              <div className="sticky top-4 z-30">
                <div
                  className={cx(
                    "rounded-3xl p-[1px]",
                    "bg-gradient-to-r from-emerald-500/30 via-green-500/20 to-emerald-500/30",
                    "shadow-[0_0_40px_rgba(34,197,94,0.16)]"
                  )}
                >
                  <div className="rounded-3xl border border-emerald-500/20 bg-black/55 backdrop-blur-2xl">
                    <Header />
                  </div>
                </div>
              </div>  

              {/* ✅ Page Content */}
              <div className="mt-5 rounded-[28px] p-[1px] bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/10">
                <div className="rounded-[28px] border border-emerald-500/15 bg-black/40 backdrop-blur-xl min-h-[calc(100vh-160px)] p-4 sm:p-6">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route
                        index
                        element={
                          <RouteShell>
                           <Platform />
                          </RouteShell>
                        }
                      />


                      <Route
                        path="Group"
                        element={
                          <RouteShell>
                            <GroupManagement />
                          </RouteShell>
                        }
                      />

                      <Route
                        path="Platform"
                        element={
                          <RouteShell>
                            <Platform />
                          </RouteShell>
                        }
                      />

                      <Route
                        path="configure-account-types"
                        element={
                          <RouteShell>
                            <AccountTypes />
                          </RouteShell>
                        }
                      />

                      <Route
                        path="site-configuration"
                        element={
                          <RouteShell>
                            <SadminSiteConfiguration />
                          </RouteShell>
                        }
                      />

                      <Route
                        path="admin-information"
                        element={
                          <RouteShell>
                            <SadminAdminInfo />
                          </RouteShell>
                        }
                      />

                      <Route
                        path="ui-settings"
                        element={
                          <RouteShell>
                            <UISettings />
                          </RouteShell>
                        }
                      />


                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pb-2">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-200/60">
                  <span className="tracking-wide">Super Admin Console</span>
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

export default SuperAdmin_DashboardRouting;
