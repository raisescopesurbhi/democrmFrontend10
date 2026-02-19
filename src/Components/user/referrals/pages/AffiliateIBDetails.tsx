// UserAffiliateIbDetails.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, ChevronDown, ChevronUp, Info, RefreshCw,ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";

import { backendApi } from "../../../../utils/apiClients";
import { PageShell, NeonFrame, StatBar, money } from "../affiliateUi";
import { useNavigate } from "react-router-dom";


function FragmentRows({
  email,
  users,
  isExpanded,
  toggle,
}: {
  email: string;
  users: any[];
  isExpanded: boolean;
  toggle: () => void;  
}) {
  const first = users[0];
  const hasMore = users.length > 1;
  const navigate=useNavigate();

  return (
    <>
      <tr className="border-b border-white/10 bg-black/10 hover:bg-black/20 transition-colors">
        <td className="pl-6 pr-3 py-3 cursor-pointer" onClick={toggle}>
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-white/85 font-black">{first?.name || "-"}</p>
            {hasMore && (
              <span className="text-white/50">
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </span>
            )}
          </div>
        </td>

        <td className="p-3 text-center text-white/70 font-black">{email || "-"}</td>
        <td className="p-3 text-center text-white/70 font-black">{first?.country || "-"}</td>
        <td className="p-3 text-center text-white/70 font-black">{first?.accountNumber || "--"}</td>
        <td className="p-3 text-center text-white/70 font-black">{first?.level ?? "--"}</td>
        <td className="p-3 text-center text-white/70 font-black">{Number(first?.totalLot || 0).toFixed(4)}</td>
        <td className="p-3 text-center text-white/70 font-black">{Number(first?.totalCommission || 0).toFixed(4)}</td>

        <td className="p-3 text-center">
  <button
    type="button"
    onClick={() =>
      navigate(`/user/referral-close-trades/${first?.accountNumber}?level=${first?.level ?? 1}`)
    }
    className="inline-flex h-9 w-9 items-center justify-center rounded-full
               border border-white/10 bg-white/5 hover:bg-white/10 transition"
  >
    <ChevronRight className="h-5 w-5 text-white/80" />
  </button>
</td>
      </tr>

      {isExpanded &&
        users.slice(1).map((u: any) => (
          <tr key={u._id} className="border-b border-white/10 bg-black/5 hover:bg-black/15 transition-colors">
            <td className="pl-12 pr-3 py-2 text-white/85 font-black">{u.name || "-"}</td>
            <td className="p-2 text-center text-white/70 font-black">{u.email || "-"}</td>
            <td className="p-2 text-center text-white/70 font-black">{u.country || "-"}</td>
            <td className="p-2 text-center text-white/70 font-black">{u.accountNumber || "--"}</td>
            <td className="p-2 text-center text-white/70 font-black">{u.level ?? "--"}</td>
            <td className="p-2 text-center text-white/70 font-black">{Number(u.totalLot || 0).toFixed(4)}</td>
            <td className="p-2 text-center text-white/70 font-black">{Number(u.totalCommission || 0).toFixed(4)}</td>
          </tr>
        ))}
    </>
  );
}

export default function UserAffiliateIbDetails() {
  const loggedUser = useSelector((s: any) => s.user.loggedUser);

  const [commissionsData, setCommissionsData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEmails, setExpandedEmails] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchCommissions = async () => {
    if (!loggedUser?.referralAccount) return;
    setIsLoading(true);
    try {
      const res = await backendApi.get(`/client/user-zone-ibs/${loggedUser.referralAccount}`);
      setCommissionsData(res?.data?.data || []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser?.referralAccount]);

  // ✅ Added (top 4 horizontal cards) — real values from loggedUser only
  const topStats = useMemo(() => {
    const referralCount = Array.isArray(loggedUser?.referrals) ? loggedUser.referrals.length : 0;
    return {
      totalEarned: Number(loggedUser?.totalCommission ?? loggedUser?.ibBalance ?? loggedUser?.affiliateEarned ?? 0),
      totalReferrals: Number(loggedUser?.totalReferrals ?? referralCount ?? commissionsData.length),
      activeTrades: Number(loggedUser?.activeTrades ?? 0),
      commissionRate: loggedUser?.commissionRate ?? "—",
    };
  }, [loggedUser]);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return commissionsData;
    return commissionsData.filter(
      (item: any) =>
        (item.email || "").toLowerCase().includes(q) ||
        (item.name || "").toLowerCase().includes(q) ||
        (item.country || "").toLowerCase().includes(q) ||
        String(item.accountNumber || "").toLowerCase().includes(q)
    );
  }, [commissionsData, searchTerm]);

  const groupedData = useMemo(() => {
    return filteredData.reduce((acc: Record<string, any[]>, item: any) => {
      const key = item.email || "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filteredData]);

  const emailKeys = useMemo(() => Object.keys(groupedData), [groupedData]);

  const paginatedEmails = useMemo(
    () => emailKeys.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [emailKeys, currentPage]
  );  

  const totalPages = Math.max(1, Math.ceil(emailKeys.length / ITEMS_PER_PAGE));

  const stats = useMemo(() => {
    const totalUsers = commissionsData.length;
    const totalComm = commissionsData.reduce((s: number, u: any) => s + Number(u.totalCommission || 0), 0);
    const totalVol = commissionsData.reduce((s: number, u: any) => s + Number(u.totalLot || 0), 0);
    const avgCommission = totalUsers ? totalComm / totalUsers : 0;
    const avgVolume = totalUsers ? totalVol / totalUsers : 0;

    return { totalUsers, totalComm, totalVol, avgCommission, avgVolume };
  }, [commissionsData]);

  const toggleDropdown = (email: string) =>
    setExpandedEmails((prev) => ({ ...prev, [email]: !prev[email] }));

  return (
    <PageShell title="IB Details" subtitle="Your referred users performance">
     {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatBar label="Total Earned" value={money(topStats.totalEarned, 4)} tone="green" />
          <StatBar label="Total Referrals" value={topStats.totalReferrals} tone="blue" />
          <StatBar label="Active Trades" value={topStats.activeTrades} tone="emerald" />
          <StatBar label="Commission Rate" value={topStats.commissionRate} tone="pink" />
        </div> */}
      <NeonFrame className="p-6 sm:p-8">
        {/* ✅ Added: Top 4 cards (horizontal) */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatBar label="Total Earned" value={money(topStats.totalEarned, 4)} tone="green" />
          <StatBar label="Total Referrals" value={topStats.totalReferrals} tone="blue" />
          <StatBar label="Active Trades" value={topStats.activeTrades} tone="emerald" />
          <StatBar label="Commission Rate" value={topStats.commissionRate} tone="pink" />
        </div> */}

        {/* ✅ Inside bar: left IB Details, center search, right refresh */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 mb-5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                <BarChart3 className="h-5 w-5 text-white/90" />
              </div>
              <div className="text-white/90 font-black text-lg -mt-2">IB Details</div>
            </div>

            <div className="flex-1 md:max-w-[520px]">
              <input
                type="text"
                placeholder="Search name, email, country or account…"
                value={searchTerm}
                onChange={(e) => {  
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-4 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/35 font-black text-[13px]"
              />
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchCommissions}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition font-black text-[12px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Refreshing…" : "Refresh"}
            </motion.button>
          </div>
        </div>

        {/* Existing 4 cards (kept) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <StatBar label="Total Users" value={stats.totalUsers} tone="blue" />
          <StatBar label="Total Commissions" value={Number(stats.totalComm || 0).toFixed(4)} tone="green" />
          <StatBar label="Total Voulme" value={Number(stats.totalVol || 0).toFixed(4)} tone="emerald" />
          <StatBar
            label="Avg User"
            value={`${Number(stats.avgCommission || 0).toFixed(4)} / ${Number(stats.avgVolume || 0).toFixed(4)}`}
            tone="pink"
          />
        </div>

        {/* Table with updated columns */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-3 text-left text-white/70 font-black">Name</th>
                <th className="p-3 text-center text-white/70 font-black">Email</th>
                <th className="p-3 text-center text-white/70 font-black">Country</th>
                <th className="p-3 text-center text-white/70 font-black">AC No</th>
                <th className="p-3 text-center text-white/70 font-black">Level</th>
                <th className="p-3 text-center text-white/70 font-black">Total Volume</th>
                <th className="p-3 text-center text-white/70 font-black">Total Earned</th>
                <th className="p-3 text-center text-white/70 font-black">Actions</th>
                
              </tr>
            </thead>

            <tbody>
              {paginatedEmails.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14">
                    <div className="flex items-center justify-center gap-2 text-white/75 font-black">
                      <Info className="w-5 h-5 text-yellow-300" />
                      No data found
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEmails.map((email) => {
                  const users = (groupedData as any)[email] as any[];
                  const isExpanded = !!expandedEmails[email];
                  return (
                    <FragmentRows
                      key={email}
                      email={email}
                      users={users}
                      isExpanded={isExpanded}
                      toggle={() => toggleDropdown(email)}
                    />
                  );
                })
              )}


            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-4 text-sm font-black">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/80 disabled:opacity-40 hover:bg-white/10 transition"
            >
              Prev
            </button>
            <span className="text-white/70">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/80 disabled:opacity-40 hover:bg-white/10 transition"
            >
              Next
            </button>
          </div>
        )}
      </NeonFrame>
    </PageShell>
  );
}
