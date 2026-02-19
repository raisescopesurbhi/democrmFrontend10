// UserAffiliateWithdraw.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeDollarSign, Loader2, Send, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { backendApi } from "../../../../utils/apiClients";
import UseUserHook from "../../../../hooks/user/UseUserHook";
import { PageShell, NeonFrame, cx, money } from "../affiliateUi";

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";
const btnDisabled = "bg-white/10 text-white/40 cursor-not-allowed";

const asArray = (v: any) =>
  Array.isArray(v) ? v : Array.isArray(v?.data) ? v.data : Array.isArray(v?.result) ? v.result : [];

export default function UserAffiliateWithdraw() {
  const navigate = useNavigate();
  const loggedUser = useSelector((s: any) => s.user.loggedUser);
  const { getUpdateLoggedUser } = UseUserHook();

  const [selectedGateway, setSelectedGateway] = useState<"Bank Transfer" | "Wallet Transfer">("Bank Transfer");
  const [selectWallet, setSelectWallet] = useState<"usdtTrc20" | "usdtBep20" | "binanceId" | "btcAddress">("usdtTrc20");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [Commissions,setCommissions]=useState(0);

  const balance = useMemo(() => Number(loggedUser?.ibBalance || 0), [loggedUser?.ibBalance]);


useEffect(() => {
  console.log("enter");
  
  const referralAccount = loggedUser?.referralAccount;
  const userId = loggedUser?._id;

  if (!userId || !referralAccount) return;

  (async () => {
    try {
      const commRes = await backendApi.get(`/client/user-zone-ibs/${referralAccount}`);
      const commList = asArray(commRes?.data ?? commRes);

  console.log("commRes ---------->>>" , commList);
  console.log("commRes length ---------->>>" , commList.length);



      setCommissions(commList.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load commission data.");
      setCommissions(0);
    }
  })();
}, [loggedUser?._id, loggedUser?.referralAccount]);










  // ✅ added: 4 horizontal cards data (no mock; pulled from loggedUser only)
  const stats = useMemo(() => {
    const referralCount = Array.isArray(loggedUser?.referrals) ? loggedUser.referrals.length : 0;
    return {
      totalEarned: Number(loggedUser?.totalCommission ?? loggedUser?.ibBalance ?? loggedUser?.affiliateEarned ?? 0),
      totalReferrals: Number(Commissions),
      activeTrades: Number(loggedUser?.activeTrades ?? 0),
      commissionRate: loggedUser?.commissionRate ? `${loggedUser.commissionRate}%` : "N/A",
    };
  }, [loggedUser]);

  const formattedDateTime = useMemo(() => {
    const dt = new Date();
    return (
      dt.toLocaleDateString("en-GB") +
      ", " +
      dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    );
  }, []);

  const customContent = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Withdrawal Request</title></head>
<body>
  <div>
    <h2>Commission Withdrawal Requested</h2>
    <p>Dear ${loggedUser?.firstName || ""} ${loggedUser?.lastName || ""},</p>
    <p>We received your commission withdrawal request.</p>
    <p><b>Username:</b> ${loggedUser?.email}</p>
    <p><b>Total Amount:</b> ${balance.toFixed(4)}</p>
    <p><b>Withdrawal Amount:</b> ${amount}</p>
    <p><b>Updated:</b> ${formattedDateTime}</p>
  </div>
</body></html>`;
  }, [amount, balance, formattedDateTime, loggedUser?.email, loggedUser?.firstName, loggedUser?.lastName]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isWithdrawing) return;

    setError("");

    if (!loggedUser?._id || !loggedUser?.referralAccount) {
      toast.error("Affiliate account not found. Generate it from Overview.");
      navigate("/user/affiliate/overview");
      return;
    }

    const balNum = Number(balance);
    const amtNum = Number(amount);

    if (balNum <= 0) return setError(`You don't have sufficient balance for withdrawal.`);
    if (Number.isNaN(amtNum) || amtNum <= 0) return setError(`Enter a valid withdrawal amount.`);
    if (amtNum > balNum) return setError(`Amount must be less than or equal to ${money(balance, 4)}`);

    setIsWithdrawing(true);
    const toastId = toast.loading("Processing withdrawal...");

    try {
      await backendApi.post(`/client/add-referral-withdrawal`, {
        referralId: loggedUser.referralAccount,
        method: selectedGateway === "Bank Transfer" ? selectedGateway : selectWallet,
        amount: amtNum,
        status: "pending",
        userId: loggedUser._id,
        managerIndex: import.meta.env.VITE_MANAGER_INDEX,
        totalBalance: balance.toFixed(4),
        level: 1,
      });

      try {
        await backendApi.post(`/client/custom-mail`, {
          email: loggedUser.email,
          content: customContent,
          subject: "IB Withdrawal Requested",
        });
      } catch {
        // ignore mail failure
      }

      await getUpdateLoggedUser();
      toast.success("Withdrawal requested!", { id: toastId });
      setAmount("");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast.error("Something went wrong!!", { id: toastId });
    } finally {
      setIsWithdrawing(false);
    }
  };

  // ✅ added: small stat card (same vibe; no other logic change)
  const StatBar = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl px-4 py-3"
    >
      <div className="absolute inset-0 bg-[#04050b]/70" />
      <motion.div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
        }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative">
        <div className="text-[11px] font-black text-white/55">{label}</div>
        <div className="mt-1 text-[15px] sm:text-[16px] font-black text-white/90">{value}</div>
      </div>
    </motion.div>
  );

  return (
    <PageShell title="Withdraw" subtitle={`Withdrawable: ${money(balance, 4)}`}>
      <NeonFrame className="p-6 sm:p-8">
        {/* ✅ heading moved slightly up (only spacing change) */}
        <div className="flex items-center justify-between gap-3 mb-4 -mt-1">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
              <Wallet className="h-5 w-5 text-white/90" />
            </div>
            <div>
              <div className="text-white/90 font-black text-lg">Withdraw Commission</div>
              <div className="text-white/55 text-xs font-black tracking-wide">
                Available: {money(balance, 4)}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/user/affiliate/withdrawal-history")}
            className="px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 font-black text-[12px]"
          >
            View History
          </motion.button>
        </div>

        {/* ✅ added: 4 horizontal cards below heading and ABOVE the bar */}
        <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBar label="Total Earned" value={money(stats.totalEarned, 4)} />
          <StatBar label="Total Referrals" value={Commissions} />
          <StatBar label="Active Trades" value={stats.activeTrades} />
          <StatBar label="Commission Rate" value={stats.commissionRate} />
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-white/80 mb-2">Method</label>
              <select
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value as any)}
                className="block w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
              >
                <option className="bg-slate-950" value="Bank Transfer">
                  Bank Transfer
                </option>
                <option className="bg-slate-950" value="Wallet Transfer">
                  Wallet Transfer
                </option>
              </select>
            </div>

            {selectedGateway === "Wallet Transfer" && (
              <div>
                <label className="block text-sm font-black text-white/80 mb-2">Choose Wallet</label>
                <select
                  value={selectWallet}
                  onChange={(e) => setSelectWallet(e.target.value as any)}
                  className="block w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                >
                  <option className="bg-slate-950" value="usdtTrc20">
                    USDT (Trc20)
                  </option>
                  <option className="bg-slate-950" value="usdtBep20">
                    USDT (Bep20)
                  </option>
                  <option className="bg-slate-950" value="binanceId">
                    Binance ID
                  </option>
                  <option className="bg-slate-950" value="btcAddress">
                    BTC Address
                  </option>
                </select>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-white/85 font-black mb-3">Account details</div>

            {selectedGateway === "Bank Transfer" ? (
              <div className="grid sm:grid-cols-2 gap-3 text-white/70 text-sm font-black">
                <p>
                  Bank Name: <span className="text-white/90">{loggedUser?.bankDetails?.bankName || "--"}</span>
                </p>
                <p>
                  Holder Name: <span className="text-white/90">{loggedUser?.bankDetails?.holderName || "--"}</span>
                </p>
                <p>
                  Account Number:{" "}
                  <span className="text-white/90">{loggedUser?.bankDetails?.accountNumber || "--"}</span>
                </p>
                <p>
                  IFSC Code: <span className="text-white/90">{loggedUser?.bankDetails?.ifscCode || "--"}</span>
                </p>
                <p>
                  Swift Code: <span className="text-white/90">{loggedUser?.bankDetails?.swiftCode || "--"}</span>
                </p>
                <p>
                  UPI ID: <span className="text-white/90">{loggedUser?.bankDetails?.upiId || "--"}</span>
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 text-white/70 text-sm font-black">
                {selectWallet === "usdtTrc20" && (
                  <p>
                    USDT TRC20:{" "}
                    <span className="text-white/90">{loggedUser?.walletDetails?.tetherAddress || "--"}</span>
                  </p>
                )}
                {selectWallet === "usdtBep20" && (
                  <p>
                    USDT BEP20:{" "}
                    <span className="text-white/90">{loggedUser?.walletDetails?.ethAddress || "--"}</span>
                  </p>
                )}
                {selectWallet === "binanceId" && (
                  <p>
                    Binance ID:{" "}
                    <span className="text-white/90">{loggedUser?.walletDetails?.accountNumber || "--"}</span>
                  </p>
                )}
                {selectWallet === "btcAddress" && (  
                  <p>
                    BTC Address:{" "}
                    <span className="text-white/90">{loggedUser?.walletDetails?.trxAddress || "--"}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-black text-white/80 mb-2">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BadgeDollarSign className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isWithdrawing}
            whileHover={isWithdrawing ? {} : { y: -2 }}
            whileTap={isWithdrawing ? {} : { scale: 0.98 }}
            className={cx(
              "w-full rounded-2xl px-6 py-3.5 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
              isWithdrawing ? btnDisabled : btnPrimary
            )}
          >
            {isWithdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isWithdrawing ? "Processing..." : "Submit Withdrawal"}
          </motion.button>

          {error && <div className="text-center text-sm text-rose-200 font-black">{error}</div>}
        </form>
      </NeonFrame>
    </PageShell>
  );
}
