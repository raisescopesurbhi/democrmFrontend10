import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import UserDashboard from "./UserDashboard";
import UserReferal from "./UserReferals";
import { UserReferralWithdrawal } from "./referral/UserReferalWithdrwal";
import UserReferalWithdrwalHistory from "./referral/UserReferalWithdrwalHistory";
import UserReferralsDetails from "./referral/UserReferralsDetails";
import UserPendingReferrals from "./referral/UserPendingReferrals";
import UserWithdraw from "./UserWithdraw";

import UserNewChallenge from "./UserNewChallenge";
import UserProfile from "./UserProfile";
import UserChnagePassword from "./UserChnagePassword";
import UserMasterPassword from "./UserMasterPassword";
import UserInvesterPassword from "./UserInvestorPassword";

import UserChallenges from "./UserChallenges";
import UserAccountDetails from "./UserAccountDetails";
import UserDeposit from "./Deposite/UserDeposit";
import UserTransfer from "./UserTransfer";



import UserTransaction from "./UserTransaction";

import UserAccountsTable from "./UserAccountTable";

import UserHeader from "./Header/UserHeader";
import UserSidebar from "./UserSidebar";
import UserTrade from "./UserTrade";

import { fetchUserNotifications } from "../utils/authService";
import { setNotification } from "../../redux/user/userSlice";

import UserAffiliateCommission from "./referrals/pages/AffiliateCommission";
import UserAffiliateWithdraw from "./referrals/pages/AffiliateWithdraw";
import UserAffiliateWithdrawalHistory from "./referrals/pages/AffiliateWithdrawalHistory";
import UserAffiliateIbDetails from "./referrals/pages/AffiliateIBDetails";
import UserAffiliateProgram from "./referrals/pages/AffiliateProgram";

import UserReferralCloseTrades from "./referral/UserReferralCloseTrades";



const cx = (...c) => c.filter(Boolean).join(" ");

/* ---------- Background layers ---------- */
const GridPattern = () => (
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <svg width="100%" height="100%">
      <defs>
        <pattern id="user-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M 44 0 L 0 0 0 44"
            fill="none"
            stroke="rgba(34, 197, 94, 0.14)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#user-grid)" />
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
      animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.12, 0.2] }}
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
    className="h-full min-h-0"
  >
    {children}
  </motion.div>
);

const UserDashboardRouting = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const loggedUser = useSelector((store) => store.user.loggedUser);

  useEffect(() => {
    if (!loggedUser?._id) return;

    const fetchNotifications = async () => {
      const response = await fetchUserNotifications(loggedUser?._id);
      if (response?.success) dispatch(setNotification(response.data || []));
    };

    fetchNotifications();
  }, [location.pathname, loggedUser?._id, dispatch]);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/40 to-black pointer-events-none" />
      <div className="absolute inset-0 z-0">
        <Orbs />
        <GridPattern />
      </div>

      {/* ✅ Sidebar must be rendered once (desktop fixed inside component + mobile drawer inside component) */}
      <UserSidebar />

      {/* Layout */}
      <div className="relative z-10 min-h-[100dvh]">
        {/* Outer padding responsive + safe-area */}
        <div className="w-full px-3 sm:px-6 py-3 sm:py-4 pt-[calc(env(safe-area-inset-top)+12px)] sm:pt-[calc(env(safe-area-inset-top)+16px)]">
          {/* ✅ Right panel: full width on mobile, shifted only on md+ */}
          <div className="flex flex-col min-h-0">
            <div className="flex-1 min-h-0 flex flex-col md:ml-72">
              {/* Sticky Header */}
              <div className="sticky top-[calc(env(safe-area-inset-top)+8px)] sm:top-[calc(env(safe-area-inset-top)+16px)] z-30">
                <div
                  className={cx(
                    "rounded-2xl p-[1px]",
                    "shadow-[0_0_40px_rgba(34,197,94,0.16)]"
                  )}
                >
                  <div className="rounded-xl bg-emerald-700/20 bg-black/55 backdrop-blur-xl">
                    <UserHeader />
                  </div>
                </div>
              </div>

              {/* ✅ Content Area: proper height + scroll only here */}
              <div className="mt-3 flex-1 min-h-0">
                <div className="h-full min-h-0 bg-black/40 backdrop-blur-xl overflow-hidden flex flex-col rounded-2xl ring-1 ring-white/10">
                  <div className="flex-1 min-h-0 overflow-y-auto user-custom-scrollbar">
                    <AnimatePresence mode="wait">
                      <Routes location={location} key={location.pathname}>
                        <Route index element={<RouteShell><UserDashboard /></RouteShell>} />
                        <Route path="dashboard" element={<RouteShell><UserDashboard /></RouteShell>} />

                        <Route path="referrals" element={<RouteShell><UserReferal /></RouteShell>} />

                        <Route path="affiliate" element={<RouteShell><UserAffiliateProgram /></RouteShell>} />
                        <Route path="affiliate/commission" element={<RouteShell><UserAffiliateCommission /></RouteShell>} />
                        <Route path="affiliate/withdrawl" element={<RouteShell><UserAffiliateWithdraw /></RouteShell>} />
                        <Route path="affiliate/UserAffiliateWithdrawalHistory" element={<RouteShell><UserAffiliateWithdrawalHistory /></RouteShell>} />
                        <Route path="affiliate/UserAffiliateIbDetails" element={<RouteShell><UserAffiliateIbDetails /></RouteShell>} />

                        <Route path="details" element={<RouteShell><UserAccountsTable /></RouteShell>} />

                        <Route path="trades" element={<RouteShell><UserTrade /></RouteShell>} />

                        <Route path="referrals/pending-deposits" element={<RouteShell><UserReferralWithdrawal /></RouteShell>} />
                        <Route path="referrals/withdraw" element={<RouteShell><UserReferralWithdrawal /></RouteShell>} />
                        <Route path="referrals/withdrawal-history" element={<RouteShell><UserReferalWithdrwalHistory /></RouteShell>} />
                        <Route path="referrals/referrals-details" element={<RouteShell><UserReferralsDetails /></RouteShell>} />
                        <Route path="referrals/pending-referrals" element={<RouteShell><UserPendingReferrals /></RouteShell>} />

                         <Route path="referral-close-trades/:id" element={<RouteShell><UserReferralCloseTrades /></RouteShell>} />
                        

                        <Route path="withdraw" element={<RouteShell><UserWithdraw /></RouteShell>} />
                        <Route path="deposit" element={<RouteShell><UserDeposit /></RouteShell>} />
                        <Route path="transaction" element={<RouteShell><UserTransaction /></RouteShell>} />
                        <Route path="transfer" element={<RouteShell><UserTransfer /></RouteShell>} />


                        <Route path="new-challenge" element={<RouteShell><UserNewChallenge /></RouteShell>} />
                        <Route path="challenges" element={<RouteShell><UserChallenges /></RouteShell>} />
                        <Route path="account-details" element={<RouteShell><UserAccountDetails /></RouteShell>} />

                        <Route path="profile" element={<RouteShell><UserProfile /></RouteShell>} />
                        <Route path="change-password" element={<RouteShell><UserChnagePassword /></RouteShell>} />
                        <Route path="master-password" element={<RouteShell><UserMasterPassword /></RouteShell>} />
                        <Route path="investor-password" element={<RouteShell><UserInvesterPassword /></RouteShell>} />
                        

                      </Routes>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardRouting;
