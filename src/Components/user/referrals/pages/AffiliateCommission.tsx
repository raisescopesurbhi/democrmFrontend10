import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CircleDollarSign, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import UseUserHook from "../../../../hooks/user/UseUserHook";
import { backendApi } from "../../../../utils/apiClients";  
import { NeonFrame } from "../affiliateUi";

type AnyObj = Record<string, any>;

const asArray = (v: any) =>
  Array.isArray(v) ? v : Array.isArray(v?.data) ? v.data : Array.isArray(v?.result) ? v.result : [];

const toNum = (v: any) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const money = (n: any) => {
  const val = toNum(n);
  return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function UserAffiliateCommission() {
  const loggedUser = useSelector((store: any) => store.user.loggedUser);
  const { getUpdateLoggedUser } = UseUserHook();

  const [dataLoading, setDataLoading] = useState(false);
  const [commissions, setCommissions] = useState<any[]>([]);  
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  const inUp = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 18 },
    },
  };

  useEffect(() => {
    (async () => {
      try {
        await getUpdateLoggedUser();
      } catch {
        // no extra UI
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const referralAccount = loggedUser?.referralAccount;
    const userId = loggedUser?._id;

    if (!userId || !referralAccount) return;

    (async () => {
      setDataLoading(true);
      try {
        const [commRes, wdRes] = await Promise.all([
          backendApi.get(`/client/user-zone-ibs/${referralAccount}`),
          backendApi.get(`/client/ib-withdrawals/${userId}`),
        ]);
        console.log({ commRes, wdRes });

        const commList = asArray(commRes?.data ?? commRes);
        const wdList = asArray(wdRes?.data ?? wdRes);

        setCommissions(commList);
        setWithdrawals([...wdList].reverse());
      } catch (err) {
        console.error(err);
        toast.error("Failed to load commission data.");
        setCommissions([]);
        setWithdrawals([]);
      } finally {
        setDataLoading(false);
      }
    })();
  }, [loggedUser?._id, loggedUser?.referralAccount]);

  const computed = useMemo(() => {
    const totalCommission = commissions.reduce((sum: number, row: AnyObj) => {
      const v = row?.commission ?? row?.totalCommission ?? row?.amount ?? 0;
      return sum + toNum(v);
    }, 0);

    const approvedWithdrawals = withdrawals
      .filter((w: AnyObj) => String(w?.status ?? "").toLowerCase() === "approved")
      .reduce((sum: number, w: AnyObj) => sum + toNum(w?.amount ?? w?.withdrawalAmount ?? 0), 0);

    const referralCount = Array.isArray(loggedUser?.referrals) ? loggedUser.referrals.length : 0;

    const uniq = new Set<string>();
    commissions.forEach((r: AnyObj) => {
      const key =
        r?.email ?? r?.clientEmail ?? r?.userEmail ?? r?.accountEmail ?? r?.account ?? r?.login ?? r?.mt5Account;
      if (key) uniq.add(String(key));
    });

    const activeTraders = uniq.size || toNum(loggedUser?.activeTrades ?? loggedUser?.activeTraders ?? 0);

    return {
      totalEarned: toNum(loggedUser?.totalCommission ?? loggedUser?.affiliateEarned ?? totalCommission),
       totalReferrals: toNum(loggedUser?.totalReferrals ?? referralCount) || commissions.length,
      activeTrades: toNum(loggedUser?.activeTrades ?? 0),

    

      totalCommission,
      approvedWithdrawals,
      withdrawalBalance: toNum(loggedUser?.ibBalance ?? 0),
      activeTraders,
    };
  }, [commissions, withdrawals, loggedUser]);

  const Bar = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl px-3 sm:px-4 py-3 min-w-0"
    >
      <div className="absolute inset-0 bg-[#04050b]/70" />
      <motion.div
        className="absolute inset-0 opacity-[0.10]"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)" }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative min-w-0">
        <div className="text-[10px] sm:text-[11px] font-black text-white/55 truncate">{label}</div>
        <div className="mt-1 text-[13px] sm:text-[16px] font-black text-white/90 truncate">{value}</div>
      </div>
    </motion.div>
  );

  const StatCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl px-3 sm:px-4 py-4 min-w-0"
    >
      <div className="absolute inset-0 bg-[#04050b]/70" />
      <motion.div
        className="absolute inset-0 opacity-[0.10]"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)" }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative min-w-0">
        <div className="text-[10px] sm:text-[11px] font-black text-white/55 truncate">{label}</div>
        <div className="mt-1 text-[13px] sm:text-[16px] font-black text-white/90 truncate">{value}</div>
      </div>
    </motion.div>
  );

  return (
    <motion.div variants={inUp} initial="hidden" animate="visible" className="w-full min-w-0">
      {/* ✅ mobile: remove left margin, reduce padding. desktop: keep your ml-10 */}
      <NeonFrame className="p-4 sm:p-7 sm:p-10 mx-0 sm:mx-0 ml-0 lg:ml-10 w-full min-w-0">
        {/* Center heading */}
        <div className="text-center px-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
              Commission
            </span>
          </h1>
          <div className="mt-2 text-[12px] sm:text-[13px] font-black text-white/55">Earn Commissions</div>
        </div>

        {/* ✅ mobile friendly bars */}
        <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Bar label="Total Earned" value={money(computed.totalEarned)} />
           <Bar label="Total Referrals" value={computed.totalReferrals} /> 
          <Bar label="Active Trades" value={computed.activeTrades} />
        </div>

        <div className="mt-5 sm:mt-6">
          <NeonFrame className="p-4 sm:p-5 sm:p-6 w-full min-w-0">
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-stretch">
              {/* ✅ mobile center, desktop unchanged */}
              <div className="lg:w-[260px] flex flex-col items-center lg:items-start">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-3xl blur-2xl opacity-40"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.35), rgba(59,130,246,0.22), rgba(236,72,153,0.22))",
                    }}
                    animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.98, 1.04, 0.98] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="relative">
                    <motion.div
                      className="absolute -inset-[2px] rounded-3xl opacity-60"
                      style={{
                        background:
                          "conic-gradient(from 90deg, rgba(34,197,94,0.45), rgba(59,130,246,0.45), rgba(236,72,153,0.42), rgba(16,185,129,0.40), rgba(34,197,94,0.45))",
                      }}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-[#04050b]/70" />
                      <motion.div
                        className="absolute inset-0 opacity-[0.10]"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
                        }}
                        animate={{ x: ["-120%", "120%"] }}
                        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
                      />

                      <motion.div
                        className="relative h-20 w-20 grid place-items-center"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                          <CircleDollarSign className="h-7 w-7 text-green-200" />
                        </div>

                        <motion.div
                          className="absolute -right-2 -top-2 h-8 w-8 rounded-2xl border border-white/10 bg-white/5 grid place-items-center"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Sparkles className="h-4 w-4 text-pink-200" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-lg sm:text-xl font-black text-white/90">Commission</div>
                {dataLoading ? <div className="mt-1 text-[11px] font-black text-white/45">Loading...</div> : null}
              </div>

              {/* ✅ mobile: 1 column, sm: 2 columns (desktop stays 2x2) */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatCard label="Total Commission" value={money(computed.totalCommission)} />
                  <StatCard label="Approved Withdrawls" value={money(computed.approvedWithdrawals)} />
                  <StatCard label="Withdrawl Balance" value={money(computed.withdrawalBalance)} />
                  <StatCard label="Active Traders" value={computed.activeTraders} />
                </div>
              </div>
            </div>
          </NeonFrame>
        </div>
      </NeonFrame>
    </motion.div>
  );
}
