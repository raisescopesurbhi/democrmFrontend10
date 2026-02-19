/* ========================= TradeHistory.tsx (RESPONSIVE) ========================= */
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { metaApi,backendApi } from "../../../utils/apiClients";

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

const money = (n: any) => {
  const num = Number(n ?? 0);
  return Number.isFinite(num) ? num.toLocaleString() : "0";
};

const formatTime = (timeString?: string) => {
  if (!timeString) return "N/A";
  const d = new Date(timeString);
  const date = d.toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return `${date}, ${time}`;
};

const getSymbolIcon = (symbol?: string) => {
  if (!symbol) return "📈";
  const s = String(symbol).toUpperCase();
  if (s.includes("XAU") || s.includes("GOLD")) return "🥇";
  if (s.includes("OIL") || s.includes("CRUDE")) return "🛢️";
  if (s.includes("USD") || s.includes("EUR") || s.includes("GBP") || s.includes("JPY")) return "💱";
  return "📈";
};

const profitText = (p: any) => (Number(p ?? 0) >= 0 ? "text-green-400" : "text-red-400");

const TradeHistory = () => {
  const [activeTab, setActiveTab] = useState<"open" | "close">("open");

  const loggedUser = useSelector((s: any) => s?.user?.loggedUser);

  const accounts = useMemo(
    () =>
      (loggedUser?.accounts || [])
        .map((a: any) => a?.accountNumber ?? a?.MT5Account ?? a)
        .filter(Boolean),
    [loggedUser]
  );

  const accountsKey = useMemo(() => JSON.stringify(accounts), [accounts]);

  const [openTrades, setOpenTrades] = useState<any[]>([]);
  const [closeTrades, setCloseTrades] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const validateUserAndAccounts = useCallback(() => {
    if (!loggedUser?._id) {
      setError("Please sign in to view your trade history.");
      return false;
    }
    if (!accounts.length) {
      setError("No linked MT5 accounts found.");
      return false;
    }
    return true;
  }, [accounts.length, loggedUser?._id]);

  const fetchOpenTrades = useCallback(async () => {
    if (!validateUserAndAccounts()) {
      setOpenTrades([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const agg: any[] = [];
      for (const acc of accounts) {
        const res = await backendApi.get(
          `/meta/open-trades/${acc}`
        );
        if (Array.isArray(res?.data.data)) agg.push(...res.data.data);
      }

      agg.sort((a, b) => new Date(b?.Open_Time || 0).getTime() - new Date(a?.Open_Time || 0).getTime());

      setOpenTrades(agg);
      if (!agg.length) setError("No open trades found.");
    } catch (e) {
      console.error("Error fetching open trade data:", e);
      setOpenTrades([]);
      setError("Failed to fetch open trade data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [accounts, validateUserAndAccounts]);

  const fetchCloseTrades = useCallback(async () => {
    if (!validateUserAndAccounts()) {
      setCloseTrades([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const agg: any[] = [];
      for (const acc of accounts) {
        const res = await backendApi.get(`/auth/close-trades-all/${acc}`, {
  params: {
    startTime: "2021-07-20 00:00:00",
    endTime: `${currentDate} 23:59:59`,
  },
});
          
        if (Array.isArray(res?.data.data)) agg.push(...res.data.data);
      }

      agg.sort((a, b) => new Date(b?.Close_Time || 0).getTime() - new Date(a?.Close_Time || 0).getTime());

      setCloseTrades(agg);
      if (!agg.length) setError("No closed trades found.");
    } catch (e) {
      console.error("Error fetching closed trade data:", e);
      setCloseTrades([]);
      setError("Failed to fetch closed trade data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [accounts, currentDate, validateUserAndAccounts]);

  useEffect(() => {
    if (activeTab === "open") fetchOpenTrades();
    else fetchCloseTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, accountsKey, loggedUser?._id]);

  const rows = activeTab === "open" ? openTrades : closeTrades;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-gradient-to-br from-darkblue-800 via-darkblue-800 rounded-2xl p-4 sm:p-6 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-[18px] sm:text-2xl font-bold bg-gradient-to-r from-pink-400 via-green-500 to-purple-600 bg-clip-text text-transparent">
          Trade History
        </h2>

        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("open")}
            className={cx(
              "px-3 py-2 sm:px-4 rounded-lg font-medium transition-all text-[12px] sm:text-[13px]",
              activeTab === "open"
                ? "bg-gradient-to-r from-white/10 to-pink-400/80 text-white"
                : "bg-gradient-to-r from-white/10 to-pink-400/60 text-white"
            )}
          >
            Open Trade
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("close")}
            className={cx(
              "px-3 py-2 sm:px-4 rounded-lg font-medium transition-all text-[12px] sm:text-[13px]",
              activeTab === "close"
                ? "bg-gradient-to-r from-white/10 to-pink-400/80 text-white"
                : "bg-gradient-to-r from-white/10 to-pink-400/60 text-white"
            )}
          >
            Close Trade
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="py-8 text-center text-gray-300"
          >
            Fetching {activeTab === "open" ? "open" : "closed"} trades...
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!loading && !!error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ mobile-friendly table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[980px] px-4 sm:px-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[12px] sm:text-[13px]">Account</th>
                <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[12px] sm:text-[13px]">Symbol</th>
                <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[12px] sm:text-[13px]">
                  {activeTab === "open" ? "Open Time" : "Close Time"}
                </th>
                <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[12px] sm:text-[13px]">
                  {activeTab === "open" ? "Open Price" : "Close Price"}
                </th>
                <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[12px] sm:text-[13px]">Type</th>
                <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[12px] sm:text-[13px]">Vol</th>
                <th className="text-left py-3 px-3 text-blue-400 font-semibold text-[12px] sm:text-[13px]">P/L</th>
              </tr>
            </thead>

            <tbody>
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No trades
                  </td>
                </tr>
              ) : (
                rows.map((t: any, idx: number) => {
                  const symbol = t?.Symbol ?? t?.symbol ?? "N/A";
                  const account = t?.MT5Account ?? t?.account ?? "-";

                  const isOpen = activeTab === "open";
                  const time = isOpen ? t?.Open_Time : t?.Close_Time;
                  const price = isOpen ? t?.Open_Price : t?.Close_Price;

                  const isBuy = isOpen ? Number(t?.BUY_SELL) === 0 : Number(t?.OrderType) === 1;
                  const typeLabel = isBuy ? "BUY" : "SELL";

                  const volume = isOpen
                    ? (Number(t?.Volume ?? 0) / 10000).toFixed(2)
                    : Number(t?.Lot ?? 0).toFixed(2);

                  const pl = Number(t?.Profit ?? t?.pl ?? 0);

                  return (
                    <motion.tr
                      key={`${account}-${symbol}-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-gray-800 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-pink-500/10 transition-all"
                    >
                      <td className="py-3 px-3 text-gray-300 font-semibold">#{account}</td>

                      <td className="py-3 px-3 text-gray-300 font-semibold">
                        <span className="mr-2">{getSymbolIcon(symbol)}</span>
                        {symbol}
                      </td>

                      <td className="py-3 px-3 text-gray-400">{formatTime(time)}</td>

                      <td className="py-3 px-3 text-gray-300 font-mono">${money(price)}</td>

                      <td className="py-3 px-3">
                        <span
                          className={cx(
                            "px-3 py-1 rounded-lg text-xs font-bold",
                            isBuy ? "bg-green-500/20 text-green-200" : "bg-rose-500/20 text-rose-200"
                          )}
                        >
                          {typeLabel}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-300 font-mono">{volume}</td>

                      <td className={cx("py-3 px-3 font-semibold", profitText(pl))}>
                        {pl >= 0 ? "+" : "-"}${Math.abs(pl).toFixed(2)}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default TradeHistory;
