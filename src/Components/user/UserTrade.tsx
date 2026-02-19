// UserTrade.tsx
import { useEffect, useState, useCallback, useMemo } from "react";
import  { ReactNode } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import ModernHeading from "../lib/ModernHeading";
import DynamicLoder from "../Loader/DynamicLoder";
import { backendApi } from "../../utils/apiClients";

/* =========================================================================
   💚💗💙 THEME APPLIED: "NEON REACTOR / CIRCUIT RAVE"
   - Renders BOTH Open Trades + Close Trades in a single page
   - NO API / workflow changes (same endpoints & logic)
   - NO theme / gradients / animations changes
   - NO ReactorRing
   ======================================================================= */

 const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

/* ------------------------------ UTILS ------------------------------------ */
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

const profitText = (p: any) => (Number(p ?? 0) >= 0 ? "text-green-300" : "text-red-300");
const profitPill = (p: any) =>
  Number(p ?? 0) >= 0 ? "bg-green-500/12 border-green-300/25" : "bg-red-500/12 border-red-300/25";

/* ---------------------- NEON REACTOR THEME BLOCKS ------------------------ */
const NeonReactorBackdrop = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        i,
        x: (i * 37) % 100,
        y: (i * 61) % 100,
        s: 1 + ((i * 11) % 3),
        d: 3 + ((i * 7) % 7),
        o: 0.18 + (((i * 9) % 45) / 100),
      })),    
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-[#020307]" />

      {/* neon blobs */}
      <motion.div
        className="absolute -top-[28rem] -left-[28rem] h-[60rem] w-[60rem] rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), transparent 58%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30rem] -right-[30rem] h-[64rem] w-[64rem] rounded-full blur-3xl opacity-35"
        style={{
          background: "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.62), transparent 60%)",
        }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), transparent 62%)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-44 right-16 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle at 45% 45%, rgba(16,185,129,0.55), transparent 64%)",
        }}
        animate={{ scale: [1, 1.09, 1], x: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* circuit lines */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(120deg, rgba(236,72,153,0.22) 0px, rgba(236,72,153,0.22) 1px, transparent 1px, transparent 22px)",
        }}
        animate={{ x: [0, 120, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.span
            key={p.i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s,
              height: p.s,
              opacity: p.o,
              filter: "drop-shadow(0 0 14px rgba(34,197,94,0.35))",
            }}
            animate={{ opacity: [p.o, p.o + 0.35, p.o], y: [0, -10, 0] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* scan beam */}
      <motion.div
        className="absolute inset-x-0 -top-48 h-48 opacity-[0.12]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
        }}
        animate={{ y: ["-10vh", "120vh"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 85% at 50% 18%, transparent 35%, rgba(0,0,0,0.88) 82%)",
        }}
      />
    </div>
  );
};

const NeonFrame = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div
    className={cx(
      "relative rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden",
      "shadow-[0_28px_140px_rgba(0,0,0,0.55)]",
      className
    )}
  >
    {/* animated neon border */}
    <motion.div
      className="absolute -inset-[2px] opacity-60"
      style={{
        background:
          "conic-gradient(from 90deg, rgba(34,197,94,0.45), rgba(59,130,246,0.45), rgba(236,72,153,0.42), rgba(16,185,129,0.40), rgba(34,197,94,0.45))",
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    />
    <div className="absolute inset-[1px] rounded-[29px] bg-[#04050b]/80" />
    {/* shimmer */}
    <motion.div
      className="absolute inset-0 opacity-[0.09]"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
      }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
    />
    <div className="relative">{children}</div>
  </div>
);

/* ------------------------- SHARED UI (THEME UPDATED) ------------------- */
const SectionShell = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 170, damping: 18 }}
  >
    <NeonFrame className="overflow-hidden">{children}</NeonFrame>
  </motion.div>
);
                                      
const SectionHeading = ({ text }: { text: string }) => (
  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent">
    <div className="text-center">
      <ModernHeading text={text} />
    </div>

    {/* subtle neon accent line */}
    <div className="mt-4 h-1.5 rounded-full border border-white/10 bg-white/5 overflow-hidden">
      <motion.div
        className="h-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(59,130,246,0.95), rgba(236,72,153,0.95), rgba(16,185,129,0.9))",
        }}
        initial={{ width: "22%" }}
        animate={{ width: ["22%", "78%", "22%"] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </div>
);

const TableShell = ({ children }: { children: ReactNode }) => (
  <div className="p-6">
    <div className="overflow-x-auto user-custom-scrollbar rounded-2xl border border-white/10 bg-white/[0.03]">
      {children}
    </div>
  </div>
);

const Th = ({ children }: { children: ReactNode }) => (
  <th className="text-center py-4 px-4 font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
    {children}
  </th>
);

const Td = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <td className={cx("py-4 px-4 text-center text-white/80", className)}>{children}</td>
);

/* ------------------------------ TABS UI ---------------------------------- */
type TradeTab = "open" | "close";

const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cx(
      "relative px-4 sm:px-5 py-2 rounded-full font-black tracking-wider text-xs sm:text-sm border transition",
      "backdrop-blur-xl",
      active
        ? "bg-white/10 border-white/18 text-white"
        : "bg-white/[0.03] border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
    )}
  >
    {/* glow bubble */}
    {active && (
      <motion.span
        layoutId="tradeTabBubble"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(34,197,94,0.22), rgba(59,130,246,0.22), rgba(236,72,153,0.22), rgba(16,185,129,0.2))",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      />
    )}
    <span className="relative">{children}</span>
  </button>
);

const TabsBar = ({ tab, setTab }: { tab: TradeTab; setTab: (t: TradeTab) => void }) => (
  <div className="px-6 pt-6">
    <NeonFrame className="p-4 ">
      <div className="flex flex-wrap gap-2 justify-center">
        <TabButton active={tab === "open"} onClick={() => setTab("open")}>
          ⚡ OPEN TRADES
        </TabButton>
        <TabButton active={tab === "close"} onClick={() => setTab("close")}>
          ⚡ CLOSED TRADES
        </TabButton>
      </div>
    </NeonFrame>
  </div>
);

/* ------------------------------ COMPONENT -------------------------------- */
export default function UserTrade() {
  const loggedUser = useSelector((s: any) => s?.user?.loggedUser);

  const accounts = useMemo(
    () =>
      (loggedUser?.accounts || [])
        .map((a: any) => a?.accountNumber ?? a?.MT5Account ?? a)
        .filter(Boolean),
    [loggedUser]
  );

  const accountsKey = useMemo(() => JSON.stringify(accounts), [accounts]);

  const [tab, setTab] = useState<TradeTab>("open");

  // OPEN
  const [openTradeData, setOpenTradeData] = useState<any[]>([]);
  const [openLoading, setOpenLoading] = useState(false);
  const [openError, setOpenError] = useState("");

  // CLOSE
  const [closeTradeData, setCloseTradeData] = useState<any[]>([]);
  const [closeLoading, setCloseLoading] = useState(false);
  const [closeError, setCloseError] = useState("");

  const currentDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const fetchOpenTrades = useCallback(async () => {
    if (!loggedUser?._id) {
      setOpenTradeData([]);
      setOpenError("Please sign in to view your trade history.");
      return;
    }
    if (!accounts.length) {
      setOpenTradeData([]);
      setOpenError("No linked MT5 accounts found.");
      return;
    }

    setOpenLoading(true);
    setOpenError("");

    try {
      const agg: any[] = [];

      for (const acc of accounts) {
        const res = await backendApi.get(
          `/meta/open-trades/${acc}`
        );
        console.log("response",res);
        if (Array.isArray(res?.data.data)) agg.push(...res.data.data);
      }

      agg.sort((a, b) => {
        const at = new Date(a?.Open_Time || 0).getTime();
        const bt = new Date(b?.Open_Time || 0).getTime();
        return bt - at;
      });

      if (agg.length) {
        setOpenTradeData(agg);
        setOpenError("");
      } else {
        setOpenTradeData([]);
        setOpenError("No data found. Please try again.");
      }
    } catch (e) {
      console.error("Error fetching open trade data:", e);
      setOpenTradeData([]);
      setOpenError("Failed to fetch trade data. Please try again.");
    } finally {
      setOpenLoading(false);
    }
  }, [accounts, loggedUser?._id]);

  const fetchClosedTrades = useCallback(async () => {
    if (!loggedUser?._id) {
      setCloseTradeData([]);
      setCloseError("Please sign in to view your trade history.");
      return;
    }
    if (!accounts.length) {
      setCloseTradeData([]);
      setCloseError("No linked MT5 accounts found.");
      return;
    }

    setCloseLoading(true);
    setCloseError("");

    try {
      const agg: any[] = [];

      for (const acc of accounts) {
        // const res = await backendApi.get(
        //   `/GetCloseTradeAlUsers?Manager_Index=${import.meta.env.VITE_MANAGER_INDEX}&MT5Accont=${acc}&StartTime=2021-07-20 00:00:00&EndTime=${currentDate} 23:59:59`
        // );
        const res = await backendApi.get(`/meta/close-trades-all/${acc}`);


        if (Array.isArray(res?.data.data)) agg.push(...res.data.data);
      }

      agg.sort((a, b) => {
        const at = new Date(a?.Close_Time || 0).getTime();
        const bt = new Date(b?.Close_Time || 0).getTime();
        return bt - at;
      });

      if (agg.length) {
        setCloseTradeData(agg);
        setCloseError("");
      } else {
        setCloseTradeData([]);
        setCloseError("No data found. Please try again.");
      }
    } catch (e) {
      console.error("Error fetching closed trade data:", e);
      setCloseTradeData([]);
      setCloseError("Failed to fetch trade data. Please try again.");
    } finally {
      setCloseLoading(false);
    }
  }, [accounts, currentDate, loggedUser?._id]);

  // Keep workflow consistent: fetch on mount/accounts change, just like your components.
  useEffect(() => {
    fetchOpenTrades();
  }, [fetchOpenTrades, accountsKey, loggedUser?._id]);

  useEffect(() => {
    fetchClosedTrades();
  }, [fetchClosedTrades, accountsKey, loggedUser?._id]);

  const isLoading = tab === "open" ? openLoading : closeLoading;
  const error = tab === "open" ? openError : closeError;

  return (
    <div className="relative min-h-screen overflow-hidden text-white ml-10">
      <NeonReactorBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10">
        <SectionShell>
          {/* <SectionHeading text="⚡ TRADE HISTORY ⚡" /> */}
           <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 170, damping: 18 }}
    className="px-6 pt-6 ml-10 "
  >
    <div className="text-center">
      <h1 className="text-3xl sm:text-4xl font-black leading-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
          Trade History
        </span>
      </h1>
    </div>
  </motion.div>
          <TabsBar tab={tab} setTab={setTab} />

          {/* LOADING */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="text-center py-14"
              >
                <DynamicLoder />
                <p className="mt-6 font-black tracking-[0.28em] text-white/75">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                    {tab === "open" ? "FETCHING OPEN TRADES..." : "FETCHING CLOSED TRADES..."}
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ERROR */}
          <AnimatePresence>
            {!isLoading && error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="text-center py-10"
              >
                <div className="bg-red-500/10 border border-red-300/25 rounded-2xl p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-red-200 font-black tracking-wide">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONTENT */}
          <AnimatePresence mode="wait">
            {!isLoading && !error && tab === "open" && (
              <motion.div
                key="open"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 170, damping: 20 }}
              >
                {Array.isArray(openTradeData) && openTradeData.length > 0 ? (
                  <TableShell>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-pink-500/10 border-b border-white/10">
                          <Th>ACCOUNT</Th>
                          <Th>SYMBOL</Th>
                          <Th>OPEN TIME</Th>
                          <Th>OPEN PRICE</Th>
                          <Th>TYPE</Th>
                          <Th>VOLUME</Th>
                          <Th>P/L</Th>
                        </tr>
                      </thead>

                      <tbody>
                        {openTradeData.map((t, i) => {
                          const profit = Number(t?.Profit ?? 0);
                          const isBuy = Number(t?.BUY_SELL) === 0;

                          return (
                            <motion.tr
                              key={`${t?.MT5Account || "acc"}-${i}`}
                              initial={{ opacity: 0, x: -18 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ type: "spring", stiffness: 180, damping: 22 }}
                              className="border-b border-white/5"
                              whileHover={{   
                                backgroundColor: "rgba(255,255,255,0.03)",
                                scale: 1.01,
                                transition: { duration: 0.18 },
                              }}
                            >
                              <Td className="font-mono text-green-200/90">#{t?.MT5Account}</Td>

                              <Td className="font-black text-white/90">
                                <span className="mr-1">{getSymbolIcon(t?.Symbol)}</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300">
                                  {t?.Symbol}
                                </span>
                              </Td>

                              <Td className="text-xs font-mono text-white/55">{formatTime(t?.Open_Time)}</Td>

                              <Td className="font-mono text-white/75">${money(t?.Open_Price)}</Td>

                              <Td>
                                <span
                                  className={cx(
                                    "px-3 py-1 rounded-full text-xs font-black border",
                                    isBuy
                                      ? "bg-green-500/12 text-green-200 border-green-300/25"
                                      : "bg-pink-500/12 text-pink-200 border-pink-300/25"
                                  )}
                                >
                                  {isBuy ? "BUY" : "SELL"}
                                </span>
                              </Td>

                              <Td className="font-mono text-yellow-200 font-black">
                                {(Number(t?.Volume ?? 0) / 10000).toFixed(2)}
                              </Td>

                              <Td>
                                <div className={cx("inline-block px-4 py-2 rounded-xl font-black border", profitPill(profit))}>
                                  <span className={profitText(profit)}>
                                    {profit >= 0 ? "+" : "-"}${Math.abs(profit).toFixed(2)}
                                  </span>
                                </div>
                              </Td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </TableShell>
                ) : (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-3">
                      📊
                    </div>
                    <p className="text-white/90 font-black">No open trades yet</p>
                    <p className="text-white/60 text-sm">Open positions will appear here.</p>
                  </div>
                )}
              </motion.div>
            )}

            {!isLoading && !error && tab === "close" && (
              <motion.div
                key="close"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 170, damping: 20 }}
              >
                {Array.isArray(closeTradeData) && closeTradeData.length > 0 ? (
                  <TableShell>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-pink-500/10 border-b border-white/10">
                          <Th>ACCOUNT</Th>
                          <Th>SYMBOL</Th>
                          <Th>CLOSE TIME</Th>
                          <Th>CLOSE PRICE</Th>
                          <Th>TYPE</Th>
                          <Th>VOLUME</Th>
                          <Th>P/L</Th>
                        </tr>
                      </thead>

                      <tbody>
                        {closeTradeData.map((t, i) => {
                          const profit = Number(t?.Profit ?? 0);
                          const isBuy = Number(t?.OrderType) === 1;

                          return (
                            <motion.tr
                              key={`${t?.MT5Account || "acc"}-${i}`}
                              initial={{ opacity: 0, x: -18 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ type: "spring", stiffness: 180, damping: 22 }}
                              className="border-b border-white/5"
                              whileHover={{
                                backgroundColor: "rgba(255,255,255,0.03)",
                                scale: 1.01,
                                transition: { duration: 0.18 },
                              }}
                            >
                              <Td className="font-mono text-green-200/90">#{t?.MT5Account}</Td>

                              <Td className="font-black text-white/90">
                                <span className="mr-1">{getSymbolIcon(t?.Symbol)}</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300">
                                  {t?.Symbol}
                                </span>
                              </Td>

                              <Td className="text-xs font-mono text-white/55">{formatTime(t?.Close_Time)}</Td>

                              <Td className="font-mono text-white/75">${money(t?.Close_Price)}</Td>

                              <Td>
                                <span
                                  className={cx(
                                    "px-3 py-1 rounded-full text-xs font-black border",
                                    isBuy
                                      ? "bg-green-500/12 text-green-200 border-green-300/25"
                                      : "bg-pink-500/12 text-pink-200 border-pink-300/25"
                                  )}
                                >
                                  {isBuy ? "BUY" : "SELL"}
                                </span>
                              </Td>

                              <Td className="font-mono text-yellow-200 font-black">{Number(t?.Lot ?? 0).toFixed(2)}</Td>

                              <Td>
                                <div className={cx("inline-block px-4 py-2 rounded-xl font-black border", profitPill(profit))}>
                                  <span className={profitText(profit)}>
                                    {profit >= 0 ? "+" : "-"}${Math.abs(profit).toFixed(2)}
                                  </span>
                                </div>
                              </Td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </TableShell>
                ) : (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-3">
                      📈
                    </div>
                    <p className="text-white/90 font-black">No closed trades yet</p>
                    <p className="text-white/60 text-sm">Closed positions will appear here.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </SectionShell>
      </div>
    </div>
  );
}
