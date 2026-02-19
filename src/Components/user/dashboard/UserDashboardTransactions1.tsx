// import React, { useMemo, useState } from "react";
// import { motion } from "framer-motion";

// const RecentTransactions = () => {
//   const [filter, setFilter] = useState("all");
//   const transactions :any[]= [];
//   const filtered = filter === "all" ? transactions : transactions.filter((t) => (t.type || "").toLowerCase() === filter);

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-darkblue-800 to-darkblue-800 rounded-2xl p-6 shadow-2xl">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
//           Recent Transactions
//         </h2>

//         <div className="flex gap-2">
//           {["all", "deposit", "withdraw", "transfer"].map((f) => (
//             <motion.button
//               key={f}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setFilter(f)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
//                 filter === f ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//               }`}
//             >
//               {f}
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-gray-700">
//               <th className="text-left py-3 px-4 text-orange-400 font-semibold">Account No</th>
//               <th className="text-left py-3 px-4 text-orange-400 font-semibold">Type</th>
//               <th className="text-left py-3 px-4 text-orange-400 font-semibold">Amount</th>
//               <th className="text-left py-3 px-4 text-orange-400 font-semibold">Method</th>
//               <th className="text-left py-3 px-4 text-orange-400 font-semibold">Requested</th>
//               <th className="text-left py-3 px-4 text-orange-400 font-semibold">Updated</th>
//               <th className="text-left py-3 px-4 text-orange-400 font-semibold">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="py-8 text-center text-gray-400">
//                   No transactions
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((tx, idx) => (
//                 <motion.tr   
//                   key={idx}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: idx * 0.1 }}
//                   className="border-b border-gray-800 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-pink-500/10 transition-all"
//                 >
//                   <td className="py-3 px-4 text-gray-300">{tx.accountNo}</td>
//                   <td className="py-3 px-4 text-gray-300">{tx.type}</td>
//                   <td className="py-3 px-4 text-gray-300">{tx.amount}</td>
//                   <td className="py-3 px-4 text-gray-300">{tx.method}</td>
//                   <td className="py-3 px-4 text-gray-400">{tx.requested}</td>
//                   <td className="py-3 px-4 text-gray-400">{tx.updated}</td>
//                   <td className="py-3 px-4 text-gray-300">{tx.status}</td>
//                 </motion.tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };
// export default RecentTransactions;
