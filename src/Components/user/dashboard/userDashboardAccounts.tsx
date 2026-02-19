/* ========================= AccountList.tsx (RESPONSIVE) ========================= */
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetInfoByAccounts } from "../../../hooks/user/UseGetInfoByAccounts";

const AccountList = () => {
  const loggedUser = useSelector((state: any) => state.user.loggedUser);
  const siteConfig = useSelector((state: any) => state.user.siteConfig);
  const accountsData = useSelector((state: any) => state.user.accountsData) || [];

  const [activeAccount, setActiveAccount] = useState<any>(null);
  const [showInvestorChange, setShowInvestorChange] = useState(false);
  const [showMasterChange, setShowMasterChange] = useState(false);

  const pickAccountId = (m: any) => m?.MT5Account ?? m?.MT5Accont ?? m?.Login;

  const dbAccounts = useMemo(() => loggedUser?.accounts || [], [loggedUser?.accounts]);

  const accountIds = useMemo(
    () =>
      (dbAccounts || [])
        .map((a: any) => Number(a?.accountNumber))
        .filter((n: number) => Number.isFinite(n)),
    [dbAccounts]
  );

  useGetInfoByAccounts(accountIds, "accounts");

  const mergedAccounts = useMemo(() => {
    const fullName = `${loggedUser?.firstName || ""} ${loggedUser?.lastName || ""}`.trim();

    const metaMap = new Map<string, any>();
    for (const m of accountsData || []) {
      const id = pickAccountId(m);
      if (id != null) metaMap.set(String(id), m);
    }

    const merged = (dbAccounts || [])
      .slice()
      .reverse()
      .map((acc: any) => {
        const meta = metaMap.get(String(acc?.accountNumber));
        return {
          ...acc,
          balance: meta?.Balance ?? 0,
          equity: meta?.Equity ?? 0,
          profit: meta?.Profit ?? 0,
          name: acc?.name || fullName || "-",
          status: acc?.status || "active",
          timestamp: acc?.createdAt,
          serverName: siteConfig?.serverName,
          platform: acc?.platform || "MT5",
        };
      });

    return merged.slice(0, 5);
  }, [accountsData, dbAccounts, loggedUser?.firstName, loggedUser?.lastName, siteConfig?.serverName]);

  useEffect(() => {
    if (activeAccount) {
      const exists = mergedAccounts.some(
        (a: any) => String(a?.accountNumber) === String(activeAccount?.accountNumber)
      );
      if (!exists) setActiveAccount(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser?._id, mergedAccounts.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-darkblue-800 to-darkblue-800 rounded-2xl  sm:p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[18px] sm:text-2xl font-bold bg-gradient-to-r from-pink-400 via-green-400 to-purple-600 bg-clip-text text-transparent">
          Account List
        </h2>

        {/* ✅ optional hint on mobile */}
        <div className="text-[11px] sm:text-xs text-white/50 hidden sm:block">Latest 5 accounts</div>
      </div>

      {/* ✅ horizontal scroll on mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[1100px] px-4 sm:px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {[
                  "Account",
                  "Name",
                  "Type",
                  "Platform",
                  "Leverage",
                  "Balance",
                  "Equity",
                  "Profit",
                  "Status",
                  "Timestamp",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-2 text-blue-400 font-semibold text-[12px] sm:text-[13px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {mergedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-400">
                    No accounts
                  </td>
                </tr>
              ) : (
                mergedAccounts.map((acc: any, idx: number) => (
                  <motion.tr
                    key={acc._id || acc.accountNumber || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-800 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-pink-500/10 transition-all"
                  >
                    <td className="py-3 px-2 text-gray-300">{acc.accountNumber}</td>
                    <td className="py-3 px-2 text-gray-300">{acc.name || "-"}</td>
                    <td className="py-3 px-2 text-gray-300">{acc.accountType || "-"}</td>
                    <td className="py-3 px-2 text-gray-300">{acc.platform || "-"}</td>
                    <td className="py-3 px-2 text-purple-400 font-semibold">1:{acc.leverage || "-"}</td>

                    <td className="py-3 px-2 text-blue-400">${Number(acc.balance ?? 0).toFixed(2)}</td>
                    <td className="py-3 px-2 text-cyan-400">${Number(acc.equity ?? 0).toFixed(2)}</td>

                    <td
                      className={`py-3 px-2 font-semibold ${
                        Number(acc.profit ?? 0) >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {Number(acc.profit ?? 0).toFixed(2)}
                    </td>

                    <td className="py-3 px-2 text-gray-300">{acc.status || "-"}</td>
                    <td className="py-3 px-2 text-gray-400 whitespace-nowrap">
                      {acc.timestamp ? new Date(acc.timestamp).toLocaleString() : "-"}
                    </td>

                    <td className="py-3 px-2">
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setActiveAccount(acc);
                          setShowInvestorChange(false);
                          setShowMasterChange(false);
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:text-orange-300 transition"
                      >
                        <Lock size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal (responsive) */}
      <AnimatePresence>
        {activeAccount && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setActiveAccount(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 px-3 sm:px-4"
            >
              <div className="bg-darkblue-900 border border-orange-500 rounded-xl p-4 sm:p-6 shadow-2xl w-full max-w-md">
                {/* Account Number */}
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-orange-400 mb-2">Account Number</h3>
                  <input
                    value={activeAccount.accountNumber || ""}
                    readOnly
                    placeholder="Account number"
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 text-[13px] sm:text-sm"
                  />
                </div>

                {/* Master Password */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-base sm:text-lg font-semibold text-orange-400">Master Password</h4>
                    <button
                      onClick={() => setShowMasterChange((p) => !p)}
                      className="text-[11px] sm:text-xs text-orange-400 hover:text-orange-300 underline"
                    >
                      {showMasterChange ? "Cancel" : "Change"}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={activeAccount.masterPassword || ""}
                    readOnly
                    placeholder="Master Password"
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 text-[13px] sm:text-sm"
                  />

                  {showMasterChange && (
                    <div className="space-y-2 mt-2">
                      <input
                        type="password"
                        placeholder="New Master Password"
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 text-[13px] sm:text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Master Password"
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 text-[13px] sm:text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Investor Password */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-base sm:text-lg font-semibold text-orange-400">Investor Password</h4>
                    <button
                      onClick={() => setShowInvestorChange((p) => !p)}
                      className="text-[11px] sm:text-xs text-orange-400 hover:text-orange-300 underline"
                    >
                      {showInvestorChange ? "Cancel" : "Change"}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={activeAccount.investorPassword || ""}
                    readOnly
                    placeholder="Investor Password"
                    className= "w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 text-[13px] sm:text-sm"
                  />

                  {showInvestorChange && (
                    <div className="space-y-2 mt-2">
                      <input
                        type="password"
                        placeholder="New Investor Password"
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 text-[13px] sm:text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Investor Password"
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-gray-200 text-[13px] sm:text-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setActiveAccount(null);
                      setShowInvestorChange(false);
                      setShowMasterChange(false);
                    }}
                    className="py-2 px-10 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold text-[13px] sm:text-sm w-full sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountList;
