// import React,{useState,useEffect,useMemo} from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Lock } from "lucide-react";
// import { useSelector,useDispatch } from "react-redux";
//  import { backendApi, metaApi } from "../../../utils/apiClients";



// const AccountList = () => {
//   const [activeAccount, setActiveAccount] = useState<any>(null);
//   const [showInvestorChange, setShowInvestorChange] = useState(false);
//   const [showMasterChange, setShowMasterChange] = useState(false);

//   const accounts = useSelector((state: any) => state.user.accountsData) || [];
//   useEffect(()=>{
        
//   })


//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-darkblue-800 to-darkblue-800 rounded-2xl p-6 shadow-2xl">
//       <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
//         Account List
//       </h2>
  
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-gray-700">
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Account</th>
//               {/* <th className="text-left py-3 px-2 text-orange-400 font-semibold">Name</th> */}
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Type</th>
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Platform</th>
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Leverage</th>
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Balance</th>
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Equity</th>
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Profit</th>
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Status</th>
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Timestamp</th>
//               <th className="text-left py-3 px-2 text-orange-400 font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {accounts.length === 0 ? (
//               <tr>
//                 <td colSpan={11} className="py-8 text-center text-gray-400">
//                   No accounts
//                 </td>
//               </tr>
//             ) : (
//               accounts.map((acc, idx) => (
//                 <motion.tr
//                   key={idx}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: idx * 0.1 }}
//                   className="border-b border-gray-800 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-pink-500/10 transition-all"
//                 >
//                   <td className="py-3 px-2 text-gray-300">{acc.account}</td>
//                   <td className="py-3 px-2 text-gray-300">{acc.name}</td>
//                   <td className="py-3 px-2 text-gray-300">{acc.type}</td>
//                   <td className="py-3 px-2 text-gray-300">{acc.platform}</td>
//                   <td className="py-3 px-2 text-purple-400 font-semibold">{acc.leverage}</td>
//                   <td className="py-3 px-2 text-blue-400">{acc.balance}</td>
//                   <td className="py-3 px-2 text-cyan-400">{acc.equity}</td>
//                   <td className={`py-3 px-2 font-semibold ${acc.profit >= 0 ? "text-green-400" : "text-red-400"}`}>{acc.profit}</td>
//                   <td className="py-3 px-2 text-gray-300">{acc.status}</td>
//                   <td className="py-3 px-2 text-gray-400">{acc.timestamp}</td>
//                   <td className="py-3 px-2">
//                     <motion.button
//                       whileHover={{ scale: 1.1, rotate: 10 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setActiveAccount(acc)}
//                       className="text-orange-400 hover:text-orange-300 transition-colors"
//                     >
//                       <Lock size={18} />
//                     </motion.button>
//                   </td>
//                 </motion.tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <AnimatePresence>
//         {activeAccount && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.7 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
//               onClick={() => setActiveAccount(null)}
//             />
//             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 flex items-center justify-center z-50">
//               <div className="bg-darkblue-900 border border-orange-500 rounded-xl p-6 shadow-2xl w-full max-w-md">
//                 <h3 className="text-lg font-semibold text-orange-400 mb-4">Account Passwords</h3>

//                 <div className="space-y-4 text-gray-200">
//                   <div>
//                     <label className="block text-sm">Account:</label>
//                     <input value={activeAccount.account} readOnly className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 mt-1" />
//                   </div>

//                   <div className="space-y-2">
//                     < div className="flex justify-between items-center">
//                       <label className="block text-sm">Master Password:</label>
                      
//                       <input value={activeAccount.account} readOnly className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 mt-1" />
                      
//                       <button onClick={() => setShowMasterChange((prev) => !prev)} className="text-xs text-orange-400 hover:text-orange-300">
//                         {showMasterChange ? "Cancel" : "Change"}
//                       </button>
//                     </div>

//                     {showMasterChange && (
//                       <div className="space-y-2 mt-2">
//                         <input type="password" placeholder="New Master Password" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600" />
//                         <input type="password" placeholder="Confirm New Master Password" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600" />
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <label className="block text-sm">Investor Password:</label>
//                       <input value={activeAccount.account} readOnly className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 mt-1" />
//                       <button onClick={() => setShowInvestorChange((prev) => !prev)} className="text-xs text-orange-400 hover:text-orange-300">
//                         {showInvestorChange ? "Cancel" : "Change"}
//                       </button>
//                     </div>

//                     {showInvestorChange && (
//                       <div className="space-y-2 mt-2">
//                         <input type="password" placeholder="New Investor Password" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600" />
//                         <input type="password" placeholder="Confirm New Investor Password" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600" />
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => {
//                     setActiveAccount(null);
//                     setShowInvestorChange(false);
//                     setShowMasterChange(false);
//                   }}
//                   className="mt-6 w-full py-2 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };
// export default AccountList;