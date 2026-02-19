import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Users,
  Box,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { backendApi, metaApi } from "../../../utils/apiClients";
import { CFformatDate } from "../../../utils/CustomFunctions";  

/* ------------------------ animations ------------------------ */
const containerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/* ------------------------ helpers ------------------------ */
const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

const money = (n: any, d = 2) =>
  `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })}`;

/** ✅ ManageUsers exact theme */
const THEME = {
  bg0: "#0a0118",
  bg1: "#1a0b2e",
  bg2: "#16213e",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.65)",
  borderSoft: "rgba(255,255,255,0.15)",
  gold: "#ffd700",
  purple: "#a855f7",
  pink: "#ec4899",
  blue: "#3b82f6",
  green: "#10b981",
  orange: "#f97316",
  red: "#ef4444",
  teal: "#14b8a6",
};

const AuroraBackdrop = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
    <div
      className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "1s" }}
    />
    <div
      className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "2s" }}
    />
  </div>
);

const StatCard = ({
  icon,
  amount,
  label,
}: {
  icon: JSX.Element;
  amount: string;
  label: string;
}) => (
  <motion.div variants={cardVariants}>
    <div
      className="rounded-3xl p-[1px] border backdrop-blur-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
        borderColor: THEME.borderSoft, 
        boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
      }}
    >
      <div className="p-5 relative">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div
            className="absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.45), transparent 65%)",
            }}
          />
        </div>

        <div className="relative flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-2xl grid place-items-center border"
            style={{
              background: "rgba(0,0,0,0.35)",
              borderColor: THEME.borderSoft,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div
              className="text-xs font-semibold mb-1"
              style={{ color: THEME.textMuted }}
            >
              {label}
            </div>
            <div className="text-2xl font-black text-white truncate">
              {amount}
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ------------------------ MAIN COMPONENT ------------------------ */
const UserDetailDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null); 
  console.log("userdata is",userData) 
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [equityLoading, setEquityLoading] = useState(false);

  const totalInvestAmount = useMemo(
    () => deposits.reduce((t, v) => t + Number(v?.deposit || 0), 0),
    [deposits]
  );

  const totalWithdrawalAmount = useMemo(
    () => withdrawals.reduce((t, v) => t + Number(v?.amount || 0), 0),
    [withdrawals]
  );

  const totalTransactions = deposits.length + withdrawals.length;

  const isEmailVerified = useMemo(() => {
    const u = userData || {};
    return Boolean(
      u?.emailVerified ??
        u?.isEmailVerified ??
        u?.email_verified ??
        u?.verifiedEmail ??
        false
    );
  }, [userData]);

  const isKycVerified = useMemo(() => {
    const u = userData || {};   
    const raw = u?.kycVerified ?? u?.isKycVerified ?? u?.kyc_verified ?? false;
    if (typeof raw === "boolean") return raw;
    const status = String(u?.kycStatus || u?.kyc?.status || "").toLowerCase();  
    return status === "approved" || status === "verified";
  }, [userData]);

  // ✅ APIs/workflow from the earlier shared code
  const fetchUserData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [res, depRes, wRes] = await Promise.all([
        backendApi.get(`/admin/get-user?id=${id}`),
        backendApi.get(`/admin/deposits`),
        backendApi.get(`/admin/withdrawals`),
      ]);

      const u = res?.data?.data;  
      setUserData(u || null);

      const userId = u?._id;
      const userDeposits = (depRes?.data?.data || []).filter(
        (d: any) => d?.userId?._id === userId
      );
      const userWithdrawals = (wRes?.data?.data || []).filter(
        (w: any) => w?.userId?._id === userId
      );

      setDeposits(userDeposits);
      setWithdrawals(userWithdrawals);
    } catch (e) {
      toast.error("Failed to load user");
      console.error(e);
      setUserData(null);
      setDeposits([]);
      setWithdrawals([]);
      setTotalBalance(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MT5 equity sum (same as earlier code)
  // const fetchAccountsEquity = async (accounts: any[]) => {
  //   if (!accounts?.length) {
  //     setTotalBalance(0);
  //     return;
  //   }
  //   setEquityLoading(true);
  //   try {
  //     const results = await Promise.allSettled(
  //       accounts.map((acc) =>
  //         metaApi.get(
  //           `/GetUserInfo?Manager_Index=${
  //             import.meta.env.VITE_MANAGER_INDEX
  //           }&MT5Account=${acc?.accountNumber}`
  //         )
  //       )
  //     );

  //     const sum = results.reduce((t, r) => {
  //       if (r.status === "fulfilled") {
  //         const eq = Number(r.value?.data?.Equity || 0);
  //         return t + (isFinite(eq) ? eq : 0);
  //       }
  //       return t;
  //     }, 0);

  //     setTotalBalance(Number(sum.toFixed(2)));
  //   } catch (e) {
  //     console.error("Equity fetch failed", e);
  //     toast.error("Could not update MT5 balances");
  //   } finally {
  //     setEquityLoading(false);
  //   }
  // };


  const fetchAccountsEquity = async (accounts: any[]) => {
    if (!accounts?.length) {
      setTotalBalance(0);
      return;
    }
    setEquityLoading(true);
    try {
      const results = await Promise.allSettled(
        accounts.map((acc) =>
          backendApi.get(
            `auth/user-info/${acc.accountNumber}`
          )
        )
      );

      const sum = results.reduce((t, r) => {
        if (r.status === "fulfilled") {
          const eq = Number(r.value?.data?.data?.Equity || 0);
          return t + (isFinite(eq) ? eq : 0);
        }
        return t;
      }, 0);

      setTotalBalance(Number(sum.toFixed(2)));
    } catch (e) {
      console.error("Equity fetch failed", e);
      toast.error("Could not update MT5 balances");
    } finally {
      setEquityLoading(false);
    }
  };



  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (userData?.accounts?.length) fetchAccountsEquity(userData.accounts);
    else setTotalBalance(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const goToAdminDetails = () => {
    // ✅ As requested: navigate to /admin/details
    // Passing id as query so the URL path remains exactly "/admin/details"
    navigate(`/admin/details/${id}`);
  };


  const emailstatuschange = async(isEmailVerified : any)=>{


    // api call karke email ststu change krna hai iss id ka.




     try {
      const updateLoggedUser = await backendApi.put(`/admin/update-user`, {
        id: userData._id,
        emailVerified: !isEmailVerified ? true : false,
      });

         fetchUserData();
    } catch (error) {
      toast.error("Updateing Failed");
    }
  }
  const kycstatuschange=async(kycVerified:any)=>{
    
     try {
      const updateLoggedUser = await backendApi.put(`/admin/update-user`, {
        id: userData._id,
        kycVerified: !kycVerified ? true : false,
      });

         fetchUserData();
    } catch (error){
      toast.error("Updateing Failed");
  }
}

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ color: THEME.text, background: THEME.bg0 }}
    >
      <AuroraBackdrop />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-8">
        {/* HEADER BAR */}
        <div className="mb-8">
          <div
            className="rounded-3xl p-5 border backdrop-blur-xl"
            style={{
              background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
              borderColor: THEME.borderSoft,
              boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-center justify-between">  
              <div className="min-w-0">
                <h1 className="text-3xl font-black text-white">User Details</h1>
                <div
                  className="text-xs mt-1 truncate"
                  style={{ color: THEME.textMuted }}
                >
                  {userData?.email ? userData.email : "—"}
                  {userData?.createdAt ? (
                    <span className="ml-2">
                      • Joined {CFformatDate(userData.createdAt)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className={cx(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold transition",
                    "bg-white/10 text-white hover:bg-white/20"
                  )}
                  style={{ borderColor: THEME.borderSoft }}
                  onClick={goToAdminDetails}
                  type="button"
                >
                  <Eye size={18} />
                  View Details
                </button>

                <button
                  className={cx(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold transition",
                    "bg-white/10 text-white hover:bg-white/20"
                  )}
                  style={{ borderColor: THEME.borderSoft }}
                  onClick={goToAdminDetails}
                  type="button"
                  title="Go to /admin/details"
                >
                  <Box size={18} />
                  MT5 Accounts
                </button>          

                <button    
                  disabled={loading}
                  onClick={fetchUserData}
                  type="button"
                  className={cx(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold transition",
                    loading
                      ? "bg-white/5 text-white/40 cursor-not-allowed"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                  style={{ borderColor: THEME.borderSoft }}  
                >
                  <RefreshCw
                    className={cx("w-4 h-4", loading && "animate-spin")}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID - 4x2 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          <StatCard
            icon={<Box size={24} className="text-emerald-300" />}
            amount={`${userData?.accounts?.length || 0}`}
            label="Total MT5 Accounts"
          />
          <StatCard
            icon={<CreditCard size={24} className="text-sky-300" />}
            amount={equityLoading ? "Updating..." : money(totalBalance)}
            label="Total Available Balance"
          />
          <StatCard
            icon={<Wallet size={24} className="text-amber-300" />}
            amount={money(totalInvestAmount)}
            label="Total Deposits"
          />
          <StatCard
            icon={<ArrowLeftRight size={24} className="text-fuchsia-300" />}
            amount={money(totalWithdrawalAmount)}
            label="Total Withdrawals"
          />
          <StatCard
            icon={<ArrowLeftRight size={24} className="text-violet-300" />}
            amount={`${totalTransactions}`}
            label="Transactions"
          />
          <StatCard
            icon={<Users size={24} className="text-rose-300" />}
            amount={money(0)}
            label="Referral Commissions"
          />
          <StatCard
            icon={<Wallet size={24} className="text-teal-300" />}
            amount={`${deposits.length}`}
            label="Recent Deposits"
          />
          <StatCard
            icon={<ArrowLeftRight size={24} className="text-orange-300" />}
            amount={`${withdrawals.length}`}
            label="Recent Withdrawals"
          />
        </motion.div>

        {/* USER DATA TABLE */}
        <div
          className="rounded-3xl border backdrop-blur-xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
            borderColor: THEME.borderSoft,
            boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
          }}
        >
          <div
            className="px-6 py-4 border-b bg-black/30"
            style={{ borderColor: THEME.borderSoft }}
          >
            <h2 className="text-xl font-black text-white">User Information</h2>
            <p className="text-xs mt-1" style={{ color: THEME.textMuted }}>
              Complete profile details
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 rounded-2xl bg-white/5" />
                <div className="h-10 rounded-2xl bg-white/5" />
                <div className="h-10 rounded-2xl bg-white/5" />
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-neon ">
                <table className="w-full">
                  <thead>
                    <tr
                      className="bg-black/30 border-b"
                       style={{ borderColor: THEME.borderSoft }}
                    >
                      {[
                        "First Name",
                        "Last Name",
                        "Email",
                        "Mobile Number",
                        "Address",
                        "City",
                        "State",
                        "Zip Code",
                        "Country",
                        "Email Status",
                        "KYC Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-4 text-xs font-bold text-white/80 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>   
                    <tr
                      className="border-b hover:bg-white/5 transition"
                      style={{ borderColor: THEME.borderSoft }}    
                    >
                      <td className="py-4 px-4 text-sm text-white font-medium">
                        {userData?.firstName || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white font-medium">
                        {userData?.lastName || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white font-medium">
                        {userData?.email || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white font-medium">
                        {userData?.mobile || userData?.phone || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white font-medium max-w-[200px] truncate">
                        {userData?.address || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white font-medium">
                        {userData?.city || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white font-medium">
                        {userData?.state || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white font-medium">
                        {userData?.zipCode || userData?.zip || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-white font-medium">
                        {userData?.country || "—"}
                      </td>

                      <td className="py-4 px-4" onClick={()=>emailstatuschange(isEmailVerified)}>
                        {isEmailVerified ? (
                          <div  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-emerald-500/15 text-emerald-200 border border-emerald-300/30 font-semibold w-fit">
                            <CheckCircle size={14} />
                            Verified
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-red-500/15 text-red-200 border border-red-300/30 font-semibold w-fit">
                            <XCircle size={14} />
                            Unverified
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4" onClick={()=>kycstatuschange(isKycVerified)}>
                        {isKycVerified ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-emerald-500/15 text-emerald-200 border border-emerald-300/30 font-semibold w-fit">
                            <CheckCircle size={14} />
                            Verified
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-red-500/15 text-red-200 border border-red-300/30 font-semibold w-fit">
                            <XCircle size={14} />
                            Unverified
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* keep debug visibility for id without changing layout */}
            <div
              className="mt-4 text-[11px]"
              style={{ color: "rgba(254,255,0.45)" }}
            >
              User ID:{" "}
              <span style={{ color: "rgba(255,255,255,0.70)" }}>
                {userData?._id || id || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailDashboard;
