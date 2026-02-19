import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import DynamicLoder from "../Loader/DynamicLoder";
import { backendApi } from "../../utils/apiClients";

/* ===================== Helpers ===================== */
const cx = (...c) => c.filter(Boolean).join(" ");

function formatDate(iso:any) {
  if (!iso) return "N/A";
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return `${date}, ${time}`;
}

function money(n:any) {
  const num = Number(n ?? 0);
  return isFinite(num) ? num.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0";
}

function getStatusStyle(status:any) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return "bg-emerald-500/12 text-emerald-200 border-emerald-300/20";
  if (s === "pending") return "bg-amber-500/12 text-amber-200 border-amber-300/20";
  if (s === "rejected") return "bg-rose-500/12 text-rose-200 border-rose-300/20";
  return "bg-white/5 text-white/70 border-white/10";
}

/* ✅ pagination window helper */
function getPageWindow(current:any, total:any) {
  const windowSize = 7;
  const pages = [];

  if (total <= windowSize) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  const left = Math.max(1, current - 2);
  const right = Math.min(total, current + 2);

  pages.push(1);
  if (left > 2) pages.push("…");

  for (let i = left; i <= right; i++) {
    if (i !== 1 && i !== total) pages.push(i);
  }

  if (right < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

/* ===================== THEME (unchanged) ===================== */
const NeonReactorBackdrop = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        i,
        x: (i * 37) % 100,
        y: (i * 61) % 100,
        s: 1 + ((i * 11) % 3),
        d: 3 + ((i * 7) % 7),
        o: 0.16 + (((i * 9) % 45) / 100),
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#020307]" />

      <motion.div
        className="absolute -top-[28rem] -left-[28rem] h-[60rem] w-[60rem] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), transparent 58%)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30rem] -right-[30rem] h-[64rem] w-[64rem] rounded-full blur-3xl opacity-35"
        style={{ background: "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.62), transparent 60%)" }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), transparent 62%)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

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

      <motion.div
        className="absolute inset-x-0 -top-48 h-48 opacity-[0.12]"
        style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)" }}
        animate={{ y: ["-10vh", "120vh"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 85% at 50% 18%, transparent 35%, rgba(0,0,0,0.88) 82%)" }}
      />
    </div>
  );
};

const NeonFrame = ({ className = "", children }) => (
  <div
    className={cx(
      "relative rounded-[26px] sm:rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden",
      "shadow-[0_28px_140px_rgba(0,0,0,0.55)]",
      className
    )}
  >
    <motion.div
      className="absolute -inset-[2px] opacity-60"
      style={{
        background:
          "conic-gradient(from 90deg, rgba(34,197,94,0.45), rgba(59,130,246,0.45), rgba(236,72,153,0.42), rgba(16,185,129,0.40), rgba(34,197,94,0.45))",
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    />
    <div className="absolute inset-[1px] rounded-[25px] sm:rounded-[29px] bg-[#04050b]/80" />
    <motion.div
      className="absolute inset-0 opacity-[0.09]"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)" }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
    />
    <div className="relative min-w-0">{children}</div>
  </div>
);

/* ===================== Motion ===================== */
const page = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 170, damping: 18 } },
};

export default function UserTransaction() {
  const [activeTab, setActiveTab] = useState("all"); // all | deposit | withdrawal | transfer
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [transferData, setTransferData] = useState([]);


  // kept (unused but left as-is)
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  const [pageIndex, setPageIndex] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("all"); // "all" | number

  const loggedUser = useSelector((s) => s?.user?.loggedUser);

  async function fetchTransactionData(tradeType, signal) {
    setLoading(true);
    setError(null);

    try {
      if (!loggedUser?._id) {
        setTransactionData([]);
        setError("Please sign in to view your transactions.");
        return;
      }

      if (tradeType === "withdrawal") {
        const res = await backendApi.get(`/client/withdrawals/${loggedUser._id}`, { signal });
        const payload = res?.data?.data;

        const norm = Array.isArray(payload)
          ? payload.map((item) => ({
              account: item.mt5Account || item.accountNumber || item.account || "N/A",
              type:  item.accountType ||item.type|| "N/A",
              amount: Number(item.amount ?? 0),
              method: (item.method || "N/A").toString(),
              requested: item.createdAt || item.created_at || item.created || null,
              updated: item.updatedAt || item.updated_at || item.updated || null,
              balance: Number(item.lastBalance ?? item.balance ?? 0),
              status: item.status || "unknown",
            }))
          : [];

        setTransactionData(norm.reverse());
        if (!norm.length) setError("No withdrawal data available.");
        return;
      }

      if (tradeType === "deposit") {
        const res = await backendApi.get(`/client/deposit/${loggedUser._id}`, { signal });
        const payload = res?.data?.data;

        const norm = Array.isArray(payload)
          ? payload.map((item) => ({
              account: item.mt5Account || item.accountNumber || item.account || "N/A",
              type: item.accountType || "N/A",
              amount: Number(item.deposit ?? item.amount ?? 0),
              method: (item.method || "N/A").toString(),
              requested: item.createdAt || item.created_at || item.created || null,
              updated: item.updatedAt || item.updated_at || item.updated || null,
              balance: "—",
              status: item.status || "unknown",
            }))
          : [];

        setTransactionData(norm.reverse());
        if (!norm.length) setError("No deposit data available.");
        return;
      }

      if (tradeType === "transfer") {
  const res = await backendApi.get("/client/transfer-records", { signal });
  const payload = res?.data?.data;

  const norm = Array.isArray(payload)
    ? payload.map((item) => ({
        account: item.fromAccount ?? "—",
        type:item.type,
        amount: Number(item.amount ?? 0),
        method: item.comment || "transfer",
        requested: item.createdAt || null, 
        updated: item.updatedAt || null,
        status: item.status || "completed",
        toAccount: item.toAccount, // 👈 optional (future use)
      }))
    : [];

  setTransactionData(norm.reverse());
  setTransferData(norm.reverse());

  if (!norm.length) setError("No transfer data available.");
  return;
}


      const [dep, wd] = await Promise.all([
        backendApi.get(`/client/deposit/${loggedUser._id}`, { signal }),
        backendApi.get(`/client/withdrawals/${loggedUser._id}`, { signal }),
      ]);


      const depPayload = dep?.data?.data;
      const wdPayload = wd?.data?.data;

      const depNorm = Array.isArray(depPayload)
        ? depPayload.map((item) => ({
            account: item.mt5Account || item.accountNumber || item.account || "N/A",
            type: item.accountType || item.type || "N/A",
            amount: Number(item.deposit ?? item.amount ?? 0),
            method: (item.method || "N/A").toString(),
            requested: item.createdAt || item.created_at || item.created || null,
            updated: item.updatedAt || item.updated_at || item.updated || null,
            status: item.status || "unknown",
          }))
        : [];

      const wdNorm = Array.isArray(wdPayload)
        ? wdPayload.map((item) => ({
            account: item.mt5Account || item.accountNumber || item.account || "N/A",  
            type: item.accountType || item.type || "N/A",
            amount: Number(item.amount ?? 0),
            method: (item.method || "N/A").toString(),
            requested: item.createdAt || item.created_at || item.created || null,
            updated: item.updatedAt || item.updated_at || item.updated || null,
            balance: Number(item.lastBalance ?? item.balance ?? 0),
            status: item.status || "unknown",
          }))  
        : [];

      const merged = [...depNorm, ...wdNorm];
      setTransactionData(merged.reverse());
      if (!merged.length) setError("No data available.");
    } catch (err) {
      if (err?.name === "CanceledError" || err?.message === "canceled") return;
      console.error(`Error fetching ${tradeType} data:`, err);
      setTransactionData([]);
      setError(`Failed to fetch ${tradeType} data. Please try again.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchTransactionData(activeTab, controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, loggedUser?._id]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return transactionData;
    const base=term? transactionData.filter((row) =>
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(term))
    )
    :transactionData;
    return [...base].reverse();
  }, [q, transactionData]);

  const tabs = [
    { id: "deposit", label: "Deposit" },
    { id: "withdrawal", label: "Withdraw" },
    { id: "transfer", label: "Transfer" },
  ];

  const PAGE_OPTIONS = useMemo(() => ["all", 10, 25, 50, 100], []);

  const totalPages = useMemo(() => {
    if (rowsPerPage === "all") return 1;
    const size = Number(rowsPerPage);
    return Math.max(1, Math.ceil(filtered.length / (isFinite(size) && size > 0 ? size : filtered.length || 1)));
  }, [filtered.length, rowsPerPage]);

  const paginated = useMemo(() => {
    if (rowsPerPage === "all") return filtered;
    const size = Number(rowsPerPage);
    const safeSize = isFinite(size) && size > 0 ? size : filtered.length || 1;
    const start = (pageIndex - 1) * safeSize;
    return filtered.slice(start, start + safeSize);
  }, [filtered, pageIndex, rowsPerPage]);

  useEffect(() => {
    setPageIndex(1);
  }, [activeTab, q, loggedUser?._id, rowsPerPage]);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <NeonReactorBackdrop />

      <motion.div
        variants={page}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      >
        {/* TOP BAR */}
        <NeonFrame className="p-4 sm:p-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-3 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                  Transactions
                </span>
              </h1>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={20} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 outline-none focus:border-green-300/25 focus:ring-4 focus:ring-green-400/10 transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {tabs.map((t) => {
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      className={cx(
                        "rounded-full px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs font-black border transition-all",
                        "min-w-[90px] sm:min-w-0",
                        active
                          ? "border-green-300/25 bg-green-500/12 text-green-100 shadow-[0_0_30px_rgba(34,197,94,0.16)]"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      )}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </NeonFrame>

        {/* TABLE */}
        <div className="mt-5 sm:mt-6">
          <NeonFrame className="p-3 sm:p-4 w-full">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <DynamicLoder />

                <div className="mt-4 text-sm font-black text-white/60">Loading...</div>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-sm font-black text-rose-200">{error}</div>
            ) : (
              <div className="w-full">
                {/* ✅ scroll container, but NOTHING is fixed/sticky */}
                <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                  <table className="min-w-[980px] w-full">
                    <thead>
                      <tr className="text-left text-[11px] sm:text-xs font-black text-white/55 tracking-wider">
                        <th className="px-4 py-3">Account</th>
                        {
                       paginated.find((ele)=> ele.type) &&
                          <th className="px-4 py-3">Type</th>
                          
                          
                          }



                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Requested</th>
                        <th className="px-4 py-3">Updated</th>   
                         <th className="px-4 py-3">Balance</th> 
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {paginated.map((row, idx) => (
                        <motion.tr
                          key={`${row.account}-${idx}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: Math.min(idx * 0.02, 0.2),
                            type: "spring",
                            stiffness: 200,
                            damping: 18,
                          }}
                          className="bg-white/[0.02]"
                        >
                          <td className="px-4 py-4 font-black text-white/90">{row.account || "—"}</td>
                          {row.type && <td className="px-4 py-4 font-black text-white/80">{row.type||"-"}</td>}
                          <td className="px-4 py-4 font-black text-white/85">${money(row.amount)}</td>
                          <td className="px-4 py-4 font-black text-white/75">{(row.method || "—").toString()}</td>
                          <td className="px-4 py-4 text-white/70 font-mono text-xs whitespace-nowrap">
                            {formatDate(row.requested)}
                          </td>
                          <td className="px-4 py-4 text-white/70 font-mono text-xs whitespace-nowrap">
                            {formatDate(row.updated)}
                          </td>
                          <td className="px-4 py-4 font-black text-white/80">
                            {row.balance === "—" ? "—" : `$${money(row.balance)}`}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={cx(
                                "inline-flex items-center px-3 py-1.5 rounded-full font-black text-[11px] border whitespace-nowrap",
                                getStatusStyle(row.status)
                              )}
                            >
                              {(row.status || "UNKNOWN").toString().toUpperCase()}
                            </span>
                          </td>
                        </motion.tr>
                      ))}

                      {paginated.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-10 text-center text-sm font-black text-white/55">
                            No data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="mt-3 px-2 sm:px-4 py-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-xs font-black text-white/55">
                      {filtered.length === 0 ? (
                        "Showing 0 of 0"
                      ) : rowsPerPage === "all" ? (
                        <>
                          Showing <span className="text-white/80">all</span> of{" "}
                          <span className="text-white/80">{filtered.length}</span>
                        </>
                      ) : (
                        (() => {
                          const size = Number(rowsPerPage);
                          const start = (pageIndex - 1) * size + 1;
                          const end = Math.min(pageIndex * size, filtered.length);
                          return (
                            <>
                              Showing <span className="text-white/80">{start}–{end}</span> of{" "}
                              <span className="text-white/80">{filtered.length}</span>
                            </>
                          );
                        })()
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white/45">Rows</span>
                      <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(e.target.value === "all" ? "all" : Number(e.target.value))}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/80 outline-none focus:border-green-300/25 focus:ring-4 focus:ring-green-400/10 transition-all"
                      >
                        {PAGE_OPTIONS.map((opt) => (
                          <option key={String(opt)} value={opt} className="bg-[#0b0d14]">
                            
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end">
                    <button
                      type="button"
                      onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                      disabled={pageIndex === 1 || totalPages === 1}
                      className={cx(
                        "rounded-full px-4 py-2 text-xs font-black border transition-all",
                        pageIndex === 1 || totalPages === 1
                          ? "border-white/10 bg-white/5 text-white/35 cursor-not-allowed"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      )}
                    >
                      Prev
                    </button>

                    {totalPages > 1 &&
                      getPageWindow(pageIndex, totalPages).map((p, i) => {
                        if (p === "…") {
                          return (
                            <span key={`dots-${i}`} className="px-2 text-xs font-black text-white/35">
                              …
                            </span>
                          );
                        }
                        const active = pageIndex === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPageIndex(p)}
                            className={cx(
                              "rounded-full px-4 py-2 text-xs font-black border transition-all",
                              active
                                ? "border-green-300/25 bg-green-500/12 text-green-100 shadow-[0_0_30px_rgba(34,197,94,0.16)]"
                                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                            )}
                          >
                            {p}
                          </button>
                        );
                      })}

                    <button
                      type="button"
                      onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
                      disabled={pageIndex === totalPages || totalPages === 1}
                      className={cx(
                        "rounded-full px-4 py-2 text-xs font-black border transition-all",
                        pageIndex === totalPages || totalPages === 1
                          ? "border-white/10 bg-white/5 text-white/35 cursor-not-allowed"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      )}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </NeonFrame>
        </div>
      </motion.div>
    </div>
  );
}
