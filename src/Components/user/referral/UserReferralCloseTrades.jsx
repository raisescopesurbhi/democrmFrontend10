import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  RefreshCw,
  Search,
  X,  
} from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { RiFileExcel2Line } from "react-icons/ri";
import { PiFileCsvDuotone } from "react-icons/pi";
import { GrDocumentPdf } from "react-icons/gr";
import ModernHeading from "../../lib/ModernHeading";
import { backendApi } from "../../../utils/apiClients";
import DynamicLoder from "../../Loader/DynamicLoder";

const money4 = (n) => Number(n || 0).toFixed(4);

const UserReferralCloseTrades = () => {
  const [commissionsData, setCommissionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // UI state (layout only; APIs/workflow unchanged)
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); // all | completed | pending
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { id } = useParams();
  const tableRef = useRef(null);
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level");

  // Base totals (same dataset as before)
  const totals = useMemo(() => {
    return commissionsData.reduce(
      (acc, curr) => ({
        profit: acc.profit + Number(curr?.profit || 0),
        lotSize: acc.lotSize + Number(curr?.lotSize || 0),
        rebate: acc.rebate + Number(curr?.commission?.commissionAmount || 0),
      }),
      { profit: 0, lotSize: 0, rebate: 0 }
    );
  }, [commissionsData]);

  const counts = useMemo(() => {
    const completed = commissionsData.filter(
      (t) => t?.commission?.isCalculated === true
    ).length;
    const pending = commissionsData.length - completed;
    return { completed, pending, total: commissionsData.length };
  }, [commissionsData]);

  // Client-side view filtering (layout only)
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let arr = [...commissionsData];

    if (status !== "all") {
      const wantCompleted = status === "completed";
      arr = arr.filter((t) =>
        wantCompleted
          ? t?.commission?.isCalculated === true
          : t?.commission?.isCalculated !== true
      );
    }

    if (query) {
      arr = arr.filter((t) => {
        const ac = String(t?.mt5Account || "").toLowerCase();
        const sym = String(t?.symbol || "").toLowerCase();
        const ot = String(t?.openTime || "").toLowerCase();
        const ct = String(t?.closeTime || "").toLowerCase();
        return (
          ac.includes(query) ||
          sym.includes(query) ||
          ot.includes(query) ||
          ct.includes(query)
        );
      });
    }

    return arr;
  }, [commissionsData, q, status]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    // keep page valid
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const prepareExportData = () => {
    const data = commissionsData.map((row) => ({
      "Account No": row?.mt5Account ?? "",
      "Open Time": row?.openTime ?? "",
      "Close Time": row?.closeTime ?? "",
      "Open Price": row?.openPrice ?? "",
      "Close Price": row?.closePrice ?? "",
      Symbol: row?.symbol ?? "",
      Profit: money4(row?.profit),
      Volume: money4(row?.lotSize),
      Rebate: money4(row?.commission?.commissionAmount),
      Status: row?.commission?.isCalculated ? "Completed" : "Pending",
    }));

    // Totals row
    data.push({
      "Account No": "TOTAL",
      "Open Time": "",
      "Close Time": "",
      "Open Price": "",
      "Close Price": "",
      Symbol: "",
      Profit: totals.profit.toFixed(4),
      Volume: totals.lotSize.toFixed(4),
      Rebate: totals.rebate.toFixed(4),
      Status: "",
    });

    return data;
  };

  const exportToExcel = () => {
    const data = prepareExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Commission Trades");

    // Auto-size columns
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.map((row) => String(row[key] ?? "").length)
      ),
    }));
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, "commission_trades.xlsx");
  };

  const exportToCSV = () => {
    const data = prepareExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "commission_trades.csv";
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF("l", "pt");

    doc.setFontSize(16);
    doc.text("Commission Trades Report", 40, 40);

    const data = prepareExportData();
    const headers = Object.keys(data[0]);
    const rows = data.map((obj) => Object.values(obj));

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 60,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontSize: 9,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("commission_trades.pdf");
  };

  const fetchCommissions = async () => {
    setIsLoading(true);
    try {
      const res = await backendApi.get(`/client/user-ib-close-trade/${id}`);
      const commissionsRes = res.data.data.reverse();

      const filteredCommissions = commissionsRes
        .map((trade) => ({
          ...trade,
          commission:
            trade.commissions.find(
              (commission) => commission.level === Number(level)
            ) || null,
        }))
        .filter((trade) => trade.commission !== null);

      setCommissionsData(filteredCommissions);
      setPage(1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canExport = !isLoading && commissionsData.length > 0;

  return (
    <div className="relative m-[-10px] p-4 sm:p-6 rounded-2xl overflow-hidden bg-[#020307]">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#04050b] via-[#020307] to-black" />
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -right-48 h-[560px] w-[560px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.10),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* Header */}
      <div className="relative mb-5 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-emerald-300 transition-all"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="flex flex-col">
              <div className="text-2xl sm:text-3xl font-bold">
                <ModernHeading text={"Commission Trades"} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Referral ID: <span className="text-gray-200">{id}</span>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Level:{" "}
                  <span className="text-emerald-300 font-semibold">
                    {level ?? "-"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchCommissions}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="text-sm">
                {isLoading ? "Refreshing..." : "Refresh"}
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <Download className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-300">Export</span>
              <div className="h-5 w-px bg-white/10" />
              <button
                onClick={exportToExcel}
                disabled={!canExport}
                className="flex items-center gap-2 text-gray-200 hover:text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export Excel"
              >
                <RiFileExcel2Line className="h-5 w-5" />
                <span className="hidden md:inline text-sm">Excel</span>
              </button>
              <button
                onClick={exportToCSV}
                disabled={!canExport}
                className="flex items-center gap-2 text-gray-200 hover:text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export CSV"
              >
                <PiFileCsvDuotone className="h-5 w-5" />
                <span className="hidden md:inline text-sm">CSV</span>
              </button>
              <button
                onClick={exportToPDF}
                disabled={!canExport}
                className="flex items-center gap-2 text-gray-200 hover:text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export PDF"
              >
                <GrDocumentPdf className="h-5 w-5" />
                <span className="hidden md:inline text-sm">PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <KpiCard label="Total Trades" value={counts.total} accent="text-cyan-300" />
          <KpiCard label="Completed" value={counts.completed} accent="text-emerald-300" />
          <KpiCard label="Pending" value={counts.pending} accent="text-rose-300" />
          <KpiCard label="Total Profit" value={money4(totals.profit)} accent="text-gray-100" />
          <KpiCard label="Total Volume" value={money4(totals.lotSize)} accent="text-gray-100" />
          <KpiCard label="Total Rebate" value={money4(totals.rebate)} accent="text-gray-100" />
        </div>
      </div>

      {/* Body */}
      <div className="relative grid grid-cols-12 gap-4">
        {/* Left rail (Filters + Mobile export) */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <div className="text-sm font-semibold text-gray-200 mb-3">
              Search & Filters
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Account, symbol, open/close time..."
                className="w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 outline-none focus:border-emerald-400/40"
              />
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-2">Status</div>
              <div className="flex flex-wrap gap-2">
                <PillButton
                  active={status === "all"}
                  onClick={() => {
                    setStatus("all");
                    setPage(1);
                  }}
                >
                  All
                </PillButton>
                <PillButton
                  active={status === "completed"}
                  onClick={() => {
                    setStatus("completed");
                    setPage(1);
                  }}
                >
                  Completed
                </PillButton>
                <PillButton
                  active={status === "pending"}
                  onClick={() => {
                    setStatus("pending");
                    setPage(1);
                  }}
                >
                  Pending
                </PillButton>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-2">Rows per page</div>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-emerald-400/40"
              >
                {[10, 15, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-gray-400">Showing</div>
              <div className="text-sm text-gray-200 mt-1">
                <span className="text-emerald-300 font-semibold">
                  {filtered.length}
                </span>{" "}
                trades (filtered)
              </div>
            </div>
          </div>

          {/* Mobile export */}
          <div className="sm:hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <div className="text-sm font-semibold text-gray-200 mb-3">
              Export
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={exportToExcel}
                disabled={!canExport}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-gray-200 hover:bg-white/10 hover:text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RiFileExcel2Line className="h-6 w-6" />
                <span className="text-xs">Excel</span>
              </button>
              <button
                onClick={exportToCSV}
                disabled={!canExport}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-gray-200 hover:bg-white/10 hover:text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PiFileCsvDuotone className="h-6 w-6" />
                <span className="text-xs">CSV</span>
              </button>
              <button
                onClick={exportToPDF}
                disabled={!canExport}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-gray-200 hover:bg-white/10 hover:text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GrDocumentPdf className="h-6 w-6" />
                <span className="text-xs">PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="col-span-12 lg:col-span-9">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-gray-200">
                  <Download className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-gray-200">
                    Trades Table
                  </div>
                  <div className="text-xs text-gray-400">
                    Filtered view • Page {page} of {totalPages}
                  </div>
                </div>
              </div>

              {/* Pagination controls (top) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-gray-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Prev</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-gray-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline text-sm">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={tableRef} className="relative">
              {isLoading ? (
                <div className="flex items-center justify-center py-14">
                  <DynamicLoder />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] border-collapse">
                      <thead className="sticky top-0 z-10 bg-black/40 backdrop-blur">
                        <tr className="text-xs sm:text-sm text-gray-200">
                          <Th>AC NO</Th>
                          <Th>Open Time</Th>
                          <Th>Close Time</Th>
                          <Th>Open</Th>
                          <Th>Close</Th>
                          <Th>Symbol</Th>
                          <Th>Profit</Th>
                          <Th>Volume</Th>
                          <Th>Rebate</Th>
                          <Th>Status</Th>
                        </tr>
                      </thead>

                      <tbody>
                        {filtered.length === 0 ? (
                          <tr className="border-b border-white/10">
                            <td colSpan={10} className="py-10">
                              <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
                                <div className="flex items-center gap-2 text-rose-300">
                                  <Info className="h-5 w-5" />
                                  <span className="font-semibold">
                                    No data found
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  Try changing filters or search query.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          pageRows.map((value) => (
                            <tr
                              key={value?._id}
                              className="border-b border-white/10 hover:bg-white/[0.06] text-gray-200"
                            >
                              <Td className="font-semibold">
                                {value?.mt5Account}
                              </Td>
                              <Td className="text-gray-300">
                                {value?.openTime}
                              </Td>
                              <Td className="text-gray-300">
                                {value?.closeTime}
                              </Td>
                              <Td>{money4(value?.openPrice)}</Td>
                              <Td>{money4(value?.closePrice)}</Td>
                              <Td className="font-semibold">{value?.symbol}</Td>
                              <Td className="tabular-nums">
                                {money4(value?.profit)}
                              </Td>
                              <Td className="tabular-nums">
                                {money4(value?.lotSize)}
                              </Td>
                              <Td className="tabular-nums">
                                {money4(value?.commission?.commissionAmount)}
                              </Td>
                              <Td>
                                {value?.commission?.isCalculated === true ? (
                                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                                    <CheckCheck className="h-4 w-4" />
                                    <span className="text-xs font-semibold">
                                      Completed
                                    </span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-rose-300">
                                    <X className="h-4 w-4" />
                                    <span className="text-xs font-semibold">
                                      Pending
                                    </span>
                                  </span>
                                )}
                              </Td>
                            </tr>
                          ))
                        )}
                      </tbody>

                      {commissionsData.length > 0 && (
                        <tfoot>
                          <tr className="bg-black/35 text-gray-100 border-t border-white/10">
                            <td colSpan={6} className="p-3 text-right text-sm">
                              Total (all):
                            </td>
                            <td className="p-3 text-center text-sm tabular-nums">
                              {totals?.profit?.toFixed(4)}
                            </td>
                            <td className="p-3 text-center text-sm tabular-nums">
                              {totals?.lotSize?.toFixed(4)}
                            </td>
                            <td className="p-3 text-center text-sm tabular-nums">
                              {totals?.rebate?.toFixed(4)}
                            </td>
                            <td className="p-3" />
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>

                  {/* Bottom pagination */}
                  {filtered.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-white/10">
                      <div className="text-xs text-gray-400">
                        Showing{" "}
                        <span className="text-gray-200 font-semibold">
                          {(page - 1) * pageSize + 1}
                        </span>
                        {" - "}
                        <span className="text-gray-200 font-semibold">
                          {Math.min(page * pageSize, filtered.length)}
                        </span>{" "}
                        of{" "}
                        <span className="text-gray-200 font-semibold">
                          {filtered.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage(1)}
                          disabled={page <= 1}
                          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          First
                        </button>
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page <= 1}
                          className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Prev
                        </button>
                        <button
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={page >= totalPages}
                          className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPage(totalPages)}
                          disabled={page >= totalPages}
                          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Last
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Small help strip */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-gray-200 font-semibold">
                Tips
              </div>
              <div className="text-xs text-gray-400">
                Use search to quickly find account/symbol/time • Filter by status • Export includes totals row
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- UI helpers (same file, no new deps) ---------- */

const Th = ({ children }) => (
  <th className="p-3 sm:p-4 text-center font-semibold tracking-wide whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 text-center text-sm sm:text-base whitespace-nowrap ${className}`}>
    {children}
  </td>
);

const KpiCard = ({ label, value, accent = "text-gray-100" }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
    <div className="text-xs text-gray-400">{label}</div>
    <div className={`mt-1 text-lg font-bold ${accent}`}>{value}</div>
  </div>
);

const PillButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-sm transition-all border ${
      active
        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
        : "border-white/10 bg-black/30 text-gray-200 hover:bg-white/10 hover:text-emerald-300"
    }`}
    type="button"
  >
    {children}
  </button>
);

export default UserReferralCloseTrades;
