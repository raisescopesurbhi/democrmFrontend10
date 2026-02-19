// UserAffiliateWithdrawalHistory.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Info, RefreshCw, ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { backendApi } from "../../../../utils/apiClients";
import { PageShell, NeonFrame, formatDate, money, since, statusChip } from "../affiliateUi";

// MiniRow is not in affiliateUi; keep it local here:
const LocalMini = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 min-w-0">
    <div className="text-[11px] text-white/55 font-black tracking-wide truncate">{label}</div>
    <div className="mt-1 text-base sm:text-lg font-black text-white/90 truncate">{value}</div>
  </div>
);

const MobileCard = ({ v }: { v: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 220, damping: 18 }}
    className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden"
  >
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-white/55 font-black tracking-wide">Method</div>
          <div className="mt-1 text-[13px] font-black text-white/85 truncate">
            {String(v?.method || "--")}
          </div>
        </div>

        <span
          className={`shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-black border ${statusChip(
            v?.status
          )}`}
        >
          {String(v?.status || "--").toLowerCase()}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 min-w-0">
          <div className="text-[10px] text-white/55 font-black tracking-wide">Total Amount</div>
          <div className="mt-1 text-[13px] font-black text-white/90 truncate">
            {money(v?.totalBalance || 0, 4)}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 min-w-0">
          <div className="text-[10px] text-white/55 font-black tracking-wide">Withdrawal</div>
          <div className="mt-1 text-[13px] font-black text-white/90 truncate">
            {money(v?.amount || 0, 4)}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="text-[10px] text-white/55 font-black tracking-wide">Updated</div>
        <div className="mt-1 text-[12px] font-black text-white/85">{formatDate(v?.updatedAt)}</div>
        <div className="mt-1 text-[11px] text-white/45 font-black">{since(v?.updatedAt)}</div>
      </div>
    </div>
  </motion.div>
);

export default function UserAffiliateWithdrawalHistory() {
  const navigate = useNavigate();
  const loggedUser = useSelector((s: any) => s.user.loggedUser);

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = async () => {
    if (!loggedUser?._id) return;
    setLoading(true);
    try {
      const res = await backendApi.get(`/client/ib-withdrawals/${loggedUser._id}`);
      setWithdrawals((res.data?.data || []).reverse());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser?._id]);

  const stats = useMemo(() => {
    const total = withdrawals.length;
    const pending = withdrawals.filter((x: any) => String(x.status).toLowerCase() === "pending");
    const approved = withdrawals.filter((x: any) => String(x.status).toLowerCase() === "approved");
    const rejected = withdrawals.filter((x: any) => String(x.status).toLowerCase() === "rejected");

    const sum = (arr: any[], key: "amount" | "totalBalance") =>
      arr.reduce((s, v) => s + Number(v?.[key] || 0), 0);

    const totalRequested = sum(withdrawals, "amount");
    const pendingAmount = sum(pending, "amount");
    const approvedAmount = sum(approved, "amount");
    const lastUpdated = withdrawals[0]?.updatedAt ? new Date(withdrawals[0].updatedAt) : null;

    return {
      total,
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      totalRequested,
      pendingAmount,
      approvedAmount,
      lastUpdated,
    };
  }, [withdrawals]);

  return (
    <PageShell title="Withdrawal History" subtitle="Track your requests & status">
      <NeonFrame className="p-4 sm:p-6 lg:p-8 w-full min-w-0">
        {/* Header (mobile stack, desktop row) */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
              <RefreshCw className="h-5 w-5 text-white/90" />
            </div>
            <div className="min-w-0">
              <div className="text-white/90 font-black text-base sm:text-lg truncate">
                Withdrawal History
              </div>
              <div className="text-white/55 text-[11px] sm:text-xs font-black tracking-wide break-words">
                Approved: {money(stats.approvedAmount, 4)} • Pending: {money(stats.pendingAmount, 4)}
              </div>
            </div>
          </div>

          {/* Buttons (full width on mobile) */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchWithdrawals}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition font-black text-[12px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing…" : "Refresh"}
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/user/affiliate/withdraw")}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition font-black text-[12px] text-center"
            >
              Withdraw
            </motion.button>
          </div>
        </div>

        {/* Stats (1 col on xs, 2 on sm, 4 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <LocalMini label="Total Requests" value={stats.total} />
          <LocalMini label="Pending" value={stats.pendingCount} />
          <LocalMini label="Approved" value={stats.approvedCount} />
          <LocalMini
            label="Last Updated"
            value={stats.lastUpdated ? formatDate(stats.lastUpdated.toISOString()) : "--"}
          />
        </div>

        {/* MOBILE LIST (cards) */}
        <div className="lg:hidden space-y-3">
          {loading ? (
            <div className="py-10 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300" />
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex gap-2 mx-auto justify-center items-center text-white/75 font-black">
                <Info className="w-5 h-5 text-yellow-300" />
                <p>No withdrawal history available.</p>
              </div>
            </div>
          ) : (
            withdrawals.map((v: any, idx: number) => <MobileCard key={v._id || idx} v={v} />)
          )}
        </div>

        {/* DESKTOP TABLE (unchanged) */}
        <div className="hidden lg:block rounded-3xl border border-white/10 bg-white/[0.04] overflow-x-auto">
          <table className="w-full min-w-[760px] whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-3 text-left text-white/70 font-black">Total Amount</th>
                <th className="p-3 text-center text-white/70 font-black">Withdrawal Amount</th>
                <th className="p-3 text-center text-white/70 font-black">Method</th>
                <th className="p-3 text-center text-white/70 font-black">Updated At</th>
                <th className="p-3 text-center text-white/70 font-black">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300" />
                    </div>
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex gap-2 mx-auto justify-center items-center text-white/75 font-black">
                      <Info className="w-5 h-5 text-yellow-300" />
                      <p>No withdrawal history available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                withdrawals.map((v: any, idx: number) => (
                  <tr
                    key={v._id || idx}
                    className="border-b border-white/10 bg-black/10 hover:bg-black/20 transition-colors"
                  >
                    <td className="p-3 pl-6 text-white/85 font-black">{money(v?.totalBalance || 0, 4)}</td>
                    <td className="p-3 text-center text-white/85 font-black">{money(v?.amount || 0, 4)}</td>
                    <td className="p-3 text-center text-white/70 font-black">{String(v?.method || "--")}</td>
                    <td className="p-3 text-center">
                      <div className="text-white/85 font-black">{formatDate(v?.updatedAt)}</div>
                      <div className="text-[11px] text-white/45 font-black">{since(v?.updatedAt)}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[12px] font-black ${statusChip(v?.status)}`}
                      >
                        {String(v?.status || "--").toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {withdrawals.length > 0 && !loading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 text-[12px] text-white/45 font-black">
            <div>
              Showing {withdrawals.length} record{withdrawals.length > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Status updates as requests are processed
            </div>
          </div>
        )}
      </NeonFrame>
    </PageShell>
  );
}
