// /* ========================= RecentTransactions.tsx (FULL RESPONSIVE) ========================= */
// import React, { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSelector } from "react-redux";
// import { backendApi } from "../../../../src/utils/apiClients";

// type TxRow = {
//   accountNo: string;
//   type: "deposit" | "withdraw";
//   amount: number;
//   method: string;
//   requested: string | null;
//   updated: string | null;
//   status: string;
// };

// const formatDate = (iso?: string | null) => {
//   if (!iso) return "N/A";
//   const d = new Date(iso);
//   const date = d.toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" });
//   const time = d.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   });
//   return `${date}, ${time}`;
// };

// const toMs = (iso?: string | null) => {
//   const ms = iso ? new Date(iso).getTime() : 0;
//   return Number.isFinite(ms) ? ms : 0;
// };

// const statusPill = (status?: string) => {
//   const s = String(status || "unknown").toLowerCase();
//   if (s.includes("approved") || s.includes("success")) return "bg-green-500/15 text-green-300 border-green-500/25";
//   if (s.includes("reject") || s.includes("failed")) return "bg-rose-500/15 text-rose-300 border-rose-500/25";
//   if (s.includes("pending")) return "bg-amber-500/15 text-amber-300 border-amber-500/25";
//   return "bg-white/10 text-white/70 border-white/15";
// };

// const typePill = (type: "deposit" | "withdraw") => {
//   return type === "deposit"
//     ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
//     : "bg-sky-500/15 text-sky-300 border-sky-500/25";
// };

// const RecentTransactions = () => {
//   const [filter, setFilter] = useState<"all" | "deposit" | "withdraw">("all");
//   const [transactions, setTransactions] = useState<TxRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loggedUser = useSelector((s: any) => s?.user?.loggedUser);

//   const MAX_ROWS = 5;

//   const filtered = useMemo(() => {
//     const rows = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);
//     return rows.slice(0, MAX_ROWS);
//   }, [filter, transactions]);

//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchBoth = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         if (!loggedUser?._id) {
//           setTransactions([]);
//           setError("Please sign in to view your transactions.");
//           return;
//         }

//         const [depRes, wdRes] = await Promise.allSettled([
//           backendApi.get(`/deposit/${loggedUser._id}`, { signal: controller.signal as any }),
//           backendApi.get(`/withdrawals/${loggedUser._id}`, { signal: controller.signal as any }),
//         ]);

//         const depPayload = depRes.status === "fulfilled" ? depRes.value?.data?.data : [];
//         const wdPayload = wdRes.status === "fulfilled" ? wdRes.value?.data?.data : [];

//         const deposits: TxRow[] = Array.isArray(depPayload)
//           ? depPayload.map((item: any) => ({
//               accountNo: String(item?.mt5Account || item?.accountNumber || item?.account || "N/A"),
//               type: "deposit",
//               amount: Number(item?.deposit ?? item?.amount ?? 0) || 0,
//               method: String(item?.method || "N/A"),
//               requested: item?.createdAt || item?.created_at || item?.created || null,
//               updated: item?.updatedAt || item?.updated_at || item?.updated || null,
//               status: String(item?.status || "unknown"),
//             }))
//           : [];

//         const withdrawals: TxRow[] = Array.isArray(wdPayload)
//           ? wdPayload.map((item: any) => ({
//               accountNo: String(item?.mt5Account || item?.accountNumber || item?.account || "N/A"),
//               type: "withdraw",
//               amount: Number(item?.amount ?? 0) || 0,
//               method: String(item?.method || "N/A"),
//               requested: item?.createdAt || item?.created_at || item?.created || null,
//               updated: item?.updatedAt || item?.updated_at || item?.updated || null,
//               status: String(item?.status || "unknown"),
//             }))
//           : [];

//         const merged = [...deposits, ...withdrawals].sort(
//           (a, b) => toMs(b.requested || b.updated) - toMs(a.requested || a.updated)
//         );

//         setTransactions(merged);
//         if (merged.length === 0) setError("No transactions");
//       } catch (err: any) {
//         if (err?.name === "CanceledError" || err?.message === "canceled") return;
//         console.error(err);
//         setTransactions([]);
//         setError("Failed to fetch transactions. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBoth();
//     return () => controller.abort();
//   }, [loggedUser?._id]);

//   const FilterBtn = ({ f }: { f: "all" | "deposit" | "withdraw" }) => (
//     <motion.button
//       whileHover={{ scale: 1.04 }}
//       whileTap={{ scale: 0.97 }}
//       onClick={() => setFilter(f)}
//       className={`
//         rounded-lg font-medium transition-all capitalize
//         px-3 py-2 text-[12px]
//         sm:px-4 sm:text-[13px]
//         ${filter === f ? "bg-gradient-to-r from-white/10 to-pink-400/80 text-white" : "bg-gradient-to-r from-white/10 to-pink-400/55 text-white"}
//       `}
//     >
//       {f}
//     </motion.button>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 18 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.1 }}
//       className="bg-gradient-to-br from-darkblue-800 to-darkblue-800 rounded-2xl p-4 sm:p-6 shadow-2xl"
//     >
//       {/* ✅ Fully responsive header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
//         <h2 className="text-[18px] sm:text-2xl font-bold bg-gradient-to-r from-pink-400 via-green-500 to-purple-600 bg-clip-text text-transparent">
//           Recent Transactions
//         </h2>

//         <div className="flex flex-wrap gap-2">
//           <FilterBtn f="all" />
//           <FilterBtn f="deposit" />
//           <FilterBtn f="withdraw" />
//         </div>
//       </div>

//       {/* ✅ MOBILE VIEW (Cards) */}
//       <div className="block lg:hidden">
//         {loading ? (
//           <div className="py-8 text-center text-gray-400">Loading...</div>
//         ) : error ? (
//           <div className="py-8 text-center text-gray-400">{error}</div>
//         ) : filtered.length === 0 ? (
//           <div className="py-8 text-center text-gray-400">No transactions</div>
//         ) : (
//           <div className="space-y-3">
//             <AnimatePresence initial={false}>
//               {filtered.map((tx, idx) => (
//                 <motion.div
//                   key={`${tx.type}-${tx.accountNo}-${idx}`}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ delay: idx * 0.06 }}
//                   className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-md p-4"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <div className="text-white/80 text-[12px]">Account</div>
//                       <div className="text-white font-semibold truncate">{tx.accountNo}</div>
//                     </div>

//                     <div className="flex flex-col items-end gap-2 shrink-0">
//                       <span
//                         className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${typePill(
//                           tx.type
//                         )}`}
//                       >
//                         {tx.type.toUpperCase()}
//                       </span>
//                       <span
//                         className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusPill(
//                           tx.status
//                         )}`}
//                       >
//                         {String(tx.status || "unknown").toUpperCase()}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mt-3 grid grid-cols-2 gap-3">
//                     <div>
//                       <div className="text-white/50 text-[11px]">Amount</div>
//                       <div className="text-white font-semibold">${Number(tx.amount ?? 0).toFixed(2)}</div>
//                     </div>
//                     <div>
//                       <div className="text-white/50 text-[11px]">Method</div>
//                       <div className="text-white/80 truncate">{tx.method}</div>
//                     </div>
//                     <div className="col-span-2">
//                       <div className="text-white/50 text-[11px]">Requested</div>
//                       <div className="text-white/80">{formatDate(tx.requested)}</div>
//                     </div>
//                     <div className="col-span-2">
//                       <div className="text-white/50 text-[11px]">Updated</div>
//                       <div className="text-white/80">{formatDate(tx.updated)}</div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>

//       {/* ✅ DESKTOP/TABLET VIEW (Table) */}
//       <div className="hidden lg:block">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[13px]">Account No</th>
//                 <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[13px]">Type</th>
//                 <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[13px]">Amount</th>
//                 <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[13px]">Method</th>
//                 <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[13px]">Requested</th>
//                 <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[13px]">Updated</th>
//                 <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[13px]">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="py-10 text-center text-gray-400">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan={7} className="py-10 text-center text-gray-400">
//                     {error}
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="py-10 text-center text-gray-400">
//                     No transactions
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((tx, idx) => (
//                   <motion.tr
//                     key={`${tx.type}-${tx.accountNo}-${idx}`}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: idx * 0.06 }}
//                     className="border-b border-gray-800 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-pink-500/10 transition-all"
//                   >
//                     <td className="py-3 px-3 text-gray-200 font-medium">{tx.accountNo}</td>

//                     <td className="py-3 px-3">
//                       <span className={`inline-flex rounded-full border px-2.5 py-1 text-[12px] font-semibold ${typePill(tx.type)}`}>
//                         {tx.type.toUpperCase()}
//                       </span>
//                     </td>

//                     <td className="py-3 px-3 text-gray-200 font-semibold">
//                       ${Number(tx.amount ?? 0).toFixed(2)}
//                     </td>

//                     <td className="py-3 px-3 text-gray-200">{tx.method}</td>

//                     <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{formatDate(tx.requested)}</td>
//                     <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{formatDate(tx.updated)}</td>

//                     <td className="py-3 px-3">
//                       <span
//                         className={`inline-flex rounded-full border px-2.5 py-1 text-[12px] font-semibold ${statusPill(tx.status)}`}
//                       >
//                         {String(tx.status || "unknown").toUpperCase()}
//                       </span>
//                     </td>
//                   </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default RecentTransactions;
