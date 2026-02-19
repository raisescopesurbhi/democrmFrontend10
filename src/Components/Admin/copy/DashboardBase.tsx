// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   ResponsiveContainer,  
//   BarChart,
//   Bar,                           
//   CartesianGrid,
//   XAxis,
//   YAxis,   
//   Tooltip,
//   Cell,
// } from "recharts";
// import {               
//   Users,
//   UserCheck,   
//   UserX,
//   MailCheck,
//   MailX,                                  
//   Wallet,
//   Banknote,
//   CreditCard,
//   ArrowDownRight,         
//   RefreshCw,
// } from "lucide-react";

// import { backendApi } from "../../../utils/apiClients";

// const THEME = {
//   bg0: "#21030f",
//   bg1: "#540b12",
//   bg2: "#28000b",
//   text: "#fff7e8",
//   textMuted: "rgba(255,247,232,0.60)",
//   borderSoft: "rgba(255,255,255,0.10)",
//   gold: "#f4da9c",
// };

// const cx = (...c) => c.filter(Boolean).join(" ");



// const AuroraBackdrop = () => (
//   <div className="absolute inset-0 pointer-events-none">
//     <div
//       className="absolute inset-0"
//       style={{
//         background: `radial-gradient(120% 90% at 50% 12%, rgba(84,11,18,0.35), transparent 60%),
//                      linear-gradient(140deg, ${THEME.bg0} 0%, ${THEME.bg2} 55%, ${THEME.bg0} 100%)`,
//       }}
//     />
//     <motion.div
//       className="absolute -top-64 -left-64 h-[52rem] w-[52rem] rounded-full blur-3xl opacity-30"
//       style={{
//         background: "radial-gradient(circle at 30% 30%, rgba(244,218,156,0.70), transparent 60%)",
//       }}
//       animate={{ x: [0, 20, 0], y: [0, -16, 0], opacity: [0.12, 0.34, 0.12] }}
//       transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
//     />
//     <motion.div
//       className="absolute -bottom-72 -right-72 h-[58rem] w-[58rem] rounded-full blur-3xl opacity-25"
//       style={{
//         background: "radial-gradient(circle at 70% 60%, rgba(179,112,66,0.62), transparent 62%)",
//       }}
//       animate={{ x: [0, -18, 0], y: [0, 14, 0], opacity: [0.10, 0.28, 0.10] }}
//       transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
//     />
//     <motion.div
//       className="absolute top-1/2 left-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-25"
//       style={{
//         background: "radial-gradient(circle at 50% 50%, rgba(107,25,24,0.55), transparent 64%)",
//       }}
//       animate={{ scale: [1, 1.06, 1], opacity: [0.10, 0.28, 0.10] }}
//       transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
//     />
//     <div
//       className="absolute inset-0"
//       style={{
//         background: "radial-gradient(120% 85% at 50% 18%, transparent 30%, rgba(0,0,0,0.94) 82%)",
//       }}
//     />
//   </div>
// );

// const formatNumber = (n) => (n || n === 0 ? Number(n).toLocaleString() : "-");

// const formatMoney = (n) =>
//   new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(Number(n || 0));

// const normalizeMonthly = (row) => {
//   if (row == null) return 0;
//   if (typeof row === "number") return row;
//   return Number(row.total ?? row.amount ?? row.value ?? row.approved ?? 0);
// };

// const AnimatedCounter = ({ value = 0, duration = 700 }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start;
//     let raf = 0;
//     const total = Number(value || 0);

//     const tick = (t) => {
//       if (!start) start = t;
//       const p = Math.min(1, (t - start) / duration);
//       setCount(Math.floor(total * p));
//       if (p < 1) raf = requestAnimationFrame(tick);
//     };

//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//   }, [value, duration]);

//   return <span className="font-extrabold tabular-nums">{count.toLocaleString()}</span>;
// };

// export default function DashboardBase() {
//   const [userReport, setUserReport] = useState(null);
//   const [depositReport, setDepositReport] = useState(null);
//   const [withdrawalReport, setWithdrawalReport] = useState(null);
//   const [ibWithdrawalReport, setIbWithdrawalReport] = useState(null);
//   const [depWdrMonthly, setDepWdrMonthly] = useState(null);
//   const [depWdrTotals, setDepWdrTotals] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const token = useMemo(() => {
//     if (typeof localStorage !== 'undefined') {
//       return localStorage.getItem("admin_password_ref");
//     }
//     return null;
//   }, []);
//   const API_URL = import.meta.env.VITE_API_BASE_URL;
//   const API_KEY = import.meta.env.VITE_API_KEY;

//   const axiosConfig = useMemo(
//     () => ({
//       headers: {
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         "x-api-key": API_KEY,
//       },
//     }),
//     [token, API_KEY]
//   );

//   const fetchAll = useCallback(async () => {
//     try {
//       setLoading(true);  
//       setErr("");

//       const depWdrReq = axios
//         .get(`${API_URL}/api/analytics/deposits-vs-withdrawals?months=12`, axiosConfig)
//         .then((r) => r?.data?.data)
//         .catch(() => null);

//       const [userRes, depRes, wdrRes, ibRes, depWdrRes] = await Promise.allSettled([
//         backendApi.get(`/admin/user-report`, axiosConfig),
//         backendApi.get(`/admin/deposit-report`, axiosConfig),
//         backendApi.get(`/admin/withdrawal-report`, axiosConfig),
//         backendApi.get(`/admin/ib-withdrawal-report`, axiosConfig),
//         depWdrReq,
//       ]);

//       if (userRes.status === "fulfilled") setUserReport(userRes.value?.data?.data || {});
//       if (depRes.status === "fulfilled") setDepositReport(depRes.value?.data?.data || {});
//       if (wdrRes.status === "fulfilled") setWithdrawalReport(wdrRes.value?.data?.data || {});
//       if (ibRes.status === "fulfilled") setIbWithdrawalReport(ibRes.value?.data?.data || {});
//       if (depWdrRes.status === "fulfilled" && depWdrRes.value) {
//         setDepWdrMonthly(Array.isArray(depWdrRes.value.months) ? depWdrRes.value.months : null);
//         setDepWdrTotals(depWdrRes.value.totals || null);
//       }
//     } catch (e) {
//       console.error(e);
//       setErr("Failed to fetch dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   }, [API_URL, axiosConfig]);

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);
//   const totalUsers = userReport?.totalUsers ?? 0;
//   const kycVerified = userReport?.kycVerified ?? 0;
//   const kycUnverified = userReport?.kycUnverified ?? 0;
//   const emailVerified = userReport?.emailVerified ?? 0;
//   const emailUnverified = userReport?.emailUnverified ?? 0;
//   const totalIbUsers = userReport?.totalIbUsers ?? 0;
//   const totalReferralUsers = userReport?.totalReferralUsers ?? 0;

//   const depMonthlyRaw = depositReport?.monthly || depositReport?.months || null;
//   const wdrMonthlyRaw = withdrawalReport?.monthly || withdrawalReport?.months || null;

//   const monthlyDeposits = Array.isArray(depMonthlyRaw) ? depMonthlyRaw.map(normalizeMonthly) : null;
//   const monthlyWithdrawals = Array.isArray(wdrMonthlyRaw) ? wdrMonthlyRaw.map(normalizeMonthly) : null;

//   const totalDeposits =
//     (monthlyDeposits?.reduce((s, v) => s + (Number(v) || 0), 0) || 0) ||
//     Number(depositReport?.totalAmount ?? depositReport?.approved ?? 0);

//   const totalWithdrawals =
//     (monthlyWithdrawals?.reduce((s, v) => s + (Number(v) || 0), 0) || 0) ||
//     Number(withdrawalReport?.totalAmount ?? withdrawalReport?.approved ?? 0);

//   const userBarData = [
//     { title: "Total Users", value: totalUsers, fill: "#ec4899" },
//     { title: "KYC Verified", value: kycVerified, fill: "#10b981" },
//     { title: "KYC Unverified", value: kycUnverified, fill: "#a855f7" },
//     { title: "Email Verified", value: emailVerified, fill: "#ef4444" },
//     { title: "Email Unverified", value: emailUnverified, fill: "#3b82f6" },
//     { title: "IB Users", value: totalIbUsers, fill: "#f97316" },
//     { title: "Referrals", value: totalReferralUsers, fill: "#14b8a6" },
//   ];

//   return (
//     <motion.div
//       className="relative min-h-screen overflow-hidden bg-green"
//       style={{ color: THEME.text }}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.35 }}
//     >
//        <AuroraBackdrop /> 

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-black tracking-tight">
//             <span
//               className="bg-clip-text text-transparent"
//               style={{
//                 backgroundImage: "linear-gradient(90deg, #a855f7, #8b5cf6, #7c3aed)",
//               }}
//             >
//               Admin Dashboard
//             </span>
//           </h1>
//           <button
//             onClick={fetchAll}
//             disabled={loading}
//             className={cx(
//               "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border mt-4 transition",
//               loading && "opacity-60 cursor-not-allowed"
//             )}
//             style={{
//               borderColor: THEME.borderSoft,
//               background: "rgba(255,255,255,0.05)",
//               color: THEME.text,
//             }}
//           >
//             <RefreshCw className={cx("w-4 h-4", loading && "animate-spin")} />
//             {loading ? "Refreshing…" : "Refresh"}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
//           <div className="lg:col-span-3 space-y-4">
//             <div
//               className="rounded-2xl p-5 border backdrop-blur-xl"
//               style={{
//                 background: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(219,39,119,0.08))",
//                 borderColor: "rgba(236,72,153,0.3)",
//                 boxShadow: "0 0 30px rgba(236,72,153,0.15)",
//               }}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <Users className="w-6 h-6" style={{ color: "#ec4899" }} />
//               </div>
//               <div className="text-sm" style={{ color: THEME.textMuted }}>Total Users</div>
//               <div className="text-3xl font-black mt-1">
//                 <AnimatedCounter value={totalUsers} />
//               </div>
//             </div>

//             <div
//               className="rounded-2xl p-5 border backdrop-blur-xl"
//               style={{
//                 background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.08))",
//                 borderColor: "rgba(59,130,246,0.3)",
//                 boxShadow: "0 0 30px rgba(59,130,246,0.15)",
//               }}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <UserCheck className="w-6 h-6" style={{ color: "#3b82f6" }} />
//               </div>
//               <div className="text-sm" style={{ color: THEME.textMuted }}>KYC Verified</div>
//               <div className="text-3xl font-black mt-1">
//                 <AnimatedCounter value={kycVerified} />
//               </div>
//             </div>

//             <div
//               className="rounded-2xl p-5 border backdrop-blur-xl"
//               style={{
//                 background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.08))",
//                 borderColor: "rgba(239,68,68,0.3)",
//                 boxShadow: "0 0 30px rgba(239,68,68,0.15)",
//               }}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <CreditCard className="w-6 h-6" style={{ color: "#ef4444" }} />
//               </div>
//               <div className="text-sm" style={{ color: THEME.textMuted }}>Total Deposits</div>
//               <div className="text-3xl font-black mt-1">{formatMoney(totalDeposits)}</div>
//             </div>

//             <div
//               className="rounded-2xl p-5 border backdrop-blur-xl"
//               style={{
//                 background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(147,51,234,0.08))",
//                 borderColor: "rgba(168,85,247,0.3)",
//                 boxShadow: "0 0 30px rgba(168,85,247,0.15)",
//               }}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <ArrowDownRight className="w-6 h-6" style={{ color: "#a855f7" }} />
//               </div>
//               <div className="text-sm" style={{ color: THEME.textMuted }}>Total Withdrawals</div>
//               <div className="text-3xl font-black mt-1">{formatMoney(totalWithdrawals)}</div>
//             </div>
//           </div>

//           <div className="lg:col-span-9">
//             <h2
//               className="text-2xl font-bold mb-4 bg-clip-text text-transparent"
//               style={{
//                 backgroundImage: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)",
//               }}
//             >
//               User Information
//             </h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div
//                 className="rounded-xl p-4 border backdrop-blur-xl"
//                 style={{
//                   background: "rgba(236,72,153,0.10)",
//                   borderColor: "rgba(236,72,153,0.25)",
//                 }}
//               >
//                 <div className="flex items-center justify-between mb-1">
//                   <Users className="w-5 h-5" style={{ color: "#ec4899" }} />
//                 </div>
//                 <div className="text-xs" style={{ color: THEME.textMuted }}>Total Users</div>
//                 <div className="text-xl font-black mt-1">{formatNumber(totalUsers)}</div>
//               </div>

//               <div
//                 className="rounded-xl p-4 border backdrop-blur-xl"
//                 style={{
//                   background: "rgba(59,130,246,0.10)",
//                   borderColor: "rgba(59,130,246,0.25)",
//                 }}
//               >
//                 <div className="flex items-center justify-between mb-1">
//                   <UserCheck className="w-5 h-5" style={{ color: "#3b82f6" }} />
//                 </div>
//                 <div className="text-xs" style={{ color: THEME.textMuted }}>KYC Verified</div>
//                 <div className="text-xl font-black mt-1">{formatNumber(kycVerified)}</div>
//               </div>

//               <div
//                 className="rounded-xl p-4 border backdrop-blur-xl"
//                 style={{
//                   background: "rgba(16,185,129,0.10)",
//                   borderColor: "rgba(16,185,129,0.25)",
//                 }}
//               >
//                 <div className="flex items-center justify-between mb-1">
//                   <UserX className="w-5 h-5" style={{ color: "#10b981" }} />
//                 </div>
//                 <div className="text-xs" style={{ color: THEME.textMuted }}>KYC Unverified</div>
//                 <div className="text-xl font-black mt-1">{formatNumber(kycUnverified)}</div>
//               </div>

//               <div
//                 className="rounded-xl p-4 border backdrop-blur-xl"
//                 style={{
//                   background: "rgba(168,85,247,0.10)",
//                   borderColor: "rgba(168,85,247,0.25)",
//                 }}
//               >
//                 <div className="flex items-center justify-between mb-1">
//                   <MailCheck className="w-5 h-5" style={{ color: "#a855f7" }} />
//                 </div>
//                 <div className="text-xs" style={{ color: THEME.textMuted }}>Email Verified</div>
//                 <div className="text-xl font-black mt-1">{formatNumber(emailVerified)}</div>
//               </div>

//               <div
//                 className="rounded-xl p-4 border backdrop-blur-xl"
//                 style={{
//                   background: "rgba(249,115,22,0.10)",
//                   borderColor: "rgba(249,115,22,0.25)",
//                 }}
//               >
//                 <div className="flex items-center justify-between mb-1">
//                   <MailX className="w-5 h-5" style={{ color: "#f97316" }} />
//                 </div>
//                 <div className="text-xs" style={{ color: THEME.textMuted }}>Email Unverified</div>
//                 <div className="text-xl font-black mt-1">{formatNumber(emailUnverified)}</div>
//               </div>

//               <div
//                 className="rounded-xl p-4 border backdrop-blur-xl"
//                 style={{
//                   background: "rgba(239,68,68,0.10)",
//                   borderColor: "rgba(239,68,68,0.25)",
//                 }}
//               >
//                 <div className="flex items-center justify-between mb-1">
//                   <Wallet className="w-5 h-5" style={{ color: "#ef4444" }} />
//                 </div>
//                 <div className="text-xs" style={{ color: THEME.textMuted }}>IB Users</div>
//                 <div className="text-xl font-black mt-1">{formatNumber(totalIbUsers)}</div>
//               </div>

//               <div
//                 className="rounded-xl p-4 border backdrop-blur-xl"
//                 style={{
//                   background: "rgba(20,184,166,0.10)",
//                   borderColor: "rgba(20,184,166,0.25)",
//                 }}
//               >
//                 <div className="flex items-center justify-between mb-1">
//                   <Banknote className="w-5 h-5" style={{ color: "#14b8a6" }} />
//                 </div>
//                 <div className="text-xs" style={{ color: THEME.textMuted }}>Referrals</div>
//                 <div className="text-xl font-black mt-1">{formatNumber(totalReferralUsers)}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           className="rounded-2xl p-6 border backdrop-blur-xl"
//           style={{
//             background: "rgba(255,255,255,0.05)",  
//             borderColor: THEME.borderSoft,
//           }}
//         >
//           <h2
//             className="text-2xl font-bold mb-6 bg-clip-text text-transparent"
//             style={{
//               backgroundImage: "linear-gradient(90deg, #ec4899, #10b981, #a855f7, #ef4444, #3b82f6, #f97316)",
//             }}
//           >
//             User Graph
//           </h2>
//           <div className="h-[400px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={userBarData}>
//                 <CartesianGrid stroke="rgba(255,247,232,0.1)" vertical={false} />
//                 <XAxis
//                   dataKey="title"
//                   stroke="rgba(255,247,232,0.6)"
//                   tickLine={false}
//                   axisLine={false}
//                   angle={-15}
//                   textAnchor="end"
//                   height={80}
//                 />
//                 <YAxis
//                   stroke="rgba(255,247,232,0.6)"
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                  <Tooltip
//                                    contentStyle={{
//                                      background: THEME.gold,
//                                      border: "1px solid rgba(244,218,156,0.30)",
//                                      borderRadius: 12,
//                                      color: THEME.text,
//                                    }}
//                                  />
//                 {/* <Bar dataKey="value" radius={[12, 12, 0, 0]}>
//                   {userBarData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.fill} />
//                   ))}
//                 </Bar> */}
//                 <Bar dataKey="value" fill={THEME.bg0} radius={[10, 10, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }