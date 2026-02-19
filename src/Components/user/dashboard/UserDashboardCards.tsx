/* ========================= EnhancedDashboard.tsx (RESPONSIVE) ========================= */
import React, { useEffect, useMemo, useState } from "react";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  Zap,
  DollarSign,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
// import { backendApi, metaApi } from "@/utils/apiClients";
// import { setTotalFinalPnL } from "@/redux/user/userSlice";

import { backendApi,metaApi } from "../../../utils/apiClients";
import { setTotalFinalPnL } from "../../../redux/user/userSlice";

import { useGetInfoByAccounts } from "../../../hooks/user/UseGetInfoByAccounts";

/* ===== Theme (from your brown/gold Christmas card) ===== */
const THEME = {
  bg0: "#21030f",
  bg1: "#540b12",
  bg2: "#28000b",
  surface: "#24030e",
  borderSoft: "rgba(255,255,255,0.08)",
  text: "#fff7e8",
  textMuted: "rgba(255,247,232,0.55)",
  gold: "#f4da9c",
  champagne: "#d6c3a8",
  caramel: "#b37042",
  red: "#903424",
  burgundy: "#6b1918",
};

/* --- Animated number --- */
 const AnimatedNumber = ({
  value = 0,
decimals = 0,
 suffix = "",
 }: {
  value?: number;
  decimals?: number;
   suffix?: string;
 }) => {
   
/* --- Animated number --- */
// const AnimatedNumber = ({
//  value = 0,
//  decimals = 0,
//  suffix = "",
// })=>{


  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value || 0);
    const duration = 900;
    const steps = Math.max(1, Math.floor(duration / 16));
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment >= 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {Number(display).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

/* --- Particle effect (warm golden bokeh) --- */
const ParticleField = () => {
  const particles = Array.from({ length: 34 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = 1 + Math.random() * 3;
        const alpha = 0.12 + Math.random() * 0.18;
        const huePick = Math.random();
        const color =
          huePick < 0.6
            ? `rgba(244, 218, 156, ${alpha})`
            : huePick < 0.85
            ? `rgba(179, 112, 66, ${alpha})`
            : `rgba(144, 52, 36, ${alpha})`;

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: "blur(0.2px)",
            }}
          />
        );
      })}
    </div>
  );
};

/* --- Enhanced Card --- */
const NeonCard = ({
  children,
  delay = 0,
  glow = "",
  borderConic = "",
}: {
  children: React.ReactNode;
  delay?: number;
  glow?: string;
  borderConic?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const ICE = {
    bg0: "#050914",
    bg1: "#070B1C",
    bg2: "#0B1330",
    border: "rgba(120, 170, 255, 0.18)",
    text: "rgba(235, 245, 255, 0.92)",
    cyan: "#27E6FF",
    blue: "#4D7CFF",
    violet: "#B56BFF",
    indigo: "#3D2BFF",
    mint: "#2EF2B2",
  };

  const defaultBorder =
    borderConic ||
    `conic-gradient(from 0deg, ${ICE.bg2}, ${ICE.cyan}, ${ICE.blue}, ${ICE.violet}, ${ICE.indigo}, ${ICE.cyan})`;

  const defaultGlow =
    glow ||
    `radial-gradient(900px circle at 20% 20%, rgba(39,230,255,0.18), transparent 55%),
     radial-gradient(700px circle at 80% 70%, rgba(181,107,255,0.16), transparent 55%),
     linear-gradient(180deg, rgba(77,124,255,0.08), rgba(5,9,20,0.12))`;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-[2px] transition-all duration-500"
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        filter: isHovered ? "saturate(1.12)" : "saturate(1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rotating border gradient */}
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background: defaultBorder,
          animation: "spin 9s linear infinite",
        }}
      />

      {/* Card background */}
      <div
        className="relative h-full rounded-2xl"
        style={{
          background: `linear-gradient(180deg, rgba(7,11,28,0.92), rgba(5,9,20,0.92))`,
          border: `1px solid ${ICE.border}`,
          boxShadow: isHovered
            ? "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(39,230,255,0.10) inset"
            : "0 16px 45px rgba(0,0,0,0.45), 0 0 0 1px rgba(77,124,255,0.08) inset",
        }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: defaultGlow,
            opacity: isHovered ? 0.78 : 0.55,
          }}
        />

        {/* Cool aurora blobs */}
        <div
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-30 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(39,230,255,0.95), transparent 70%)`,
            transform: isHovered ? "translate(24px, 18px) scale(1.22)" : "translate(0, 0) scale(1)",
            animation: "pulse 4.6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(181,107,255,0.90), transparent 70%)`,
            transform: isHovered ? "translate(-22px, -20px) scale(1.2)" : "translate(0, 0) scale(1)",
            animation: "pulse 5.3s ease-in-out infinite",
            animationDelay: "1s",
          }}
        />

        {/* Subtle scanline */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 2px, transparent 6px)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Prism shine */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(120deg, transparent 25%, rgba(39,230,255,0.14) 45%, rgba(181,107,255,0.12) 55%, transparent 75%)",
            animation: isHovered ? "shine 1.35s ease-in-out" : "none",
          }}
        />

        {/* Content */}
        <div
          className="
            relative z-10
            p-4 sm:p-5
          "
          style={{ color: ICE.text }}
        >
          {children}
        </div>

        {/* Bottom neon edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
          style={{
            background: `linear-gradient(90deg, ${ICE.cyan}, ${ICE.blue}, ${ICE.violet}, ${ICE.mint})`,
            boxShadow:
              "0 0 18px rgba(39,230,255,0.26), 0 0 34px rgba(181,107,255,0.18), 0 0 24px rgba(46,242,178,0.14)",
            animation: "glowPulseCool 2.1s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
};

const EnhancedDashboard = () => {
  const dispatch = useDispatch();

  const loggedUser = useSelector((store: any) => store.user.loggedUser);
  const totalFinalPnL = useSelector((store: any) => store.user.totalFinalPnL);
  const { accountsStats } = useSelector((store: any) => store.user);

  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  const accountIds = loggedUser?.accounts?.map((acc: any) => +acc.accountNumber) || [];
  useGetInfoByAccounts(accountIds, "accounts");

  const equity = Number(accountsStats?.totalEquity || 0);
  const isPositive = (Number(equity || 0) || Number(totalFinalPnL || 0)) >= 0;

  // const fetchAccountsInfo = async () => {
  //   try {
  //     if (!loggedUser?._id || !Array.isArray(loggedUser?.accounts) || loggedUser.accounts.length === 0) return;

  //     let Balance = 0;
  //     for (const account of loggedUser.accounts) {
  //       const res = await metaApi.get(
  //         `/GetUserInfo?Manager_Index=${import.meta.env.VITE_MANAGER_INDEX}&MT5Account=${account.accountNumber}`
  //       );
  //       Balance += Number(res.data.Equity || 0);
  //     }
  //     dispatch(setTotalFinalPnL(Balance.toFixed(2)));
  //   } catch (error) {
  //     console.error("Error fetching accounts info:", error);
  //   }
  // };

  const fetchAccountsInfo = async () => {
    try {
      if (!loggedUser?._id || !Array.isArray(loggedUser?.accounts) || loggedUser.accounts.length === 0) return;

      let Balance = 0;
      for (const account of loggedUser.accounts) {
        const res = await backendApi.get(
          `/meta/user-info/${account.accountNumber}`
        );
        Balance += Number(res.data.data.Equity || 0);
      }
      dispatch(setTotalFinalPnL(Balance.toFixed(2)));
    } catch (error) {
      console.error("Error fetching accounts info:", error);
    }
  };


  const fetchTotalDeposits = async () => {
    try {
      if (!loggedUser?._id) return;
      const res = await backendApi.get(`/client/deposit/${loggedUser._id}`);
      const balance = (res.data?.data || []).reduce(
        (total: number, current: any) => total + Number(current.deposit || 0),
        0
      );
      setTotalDeposits(balance);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalWithdrawals = async () => {
    try {
      if (!loggedUser?._id) return;
      const res = await backendApi.get(`/client/withdrawals/${loggedUser._id}`);
      const balance = (res.data?.data || []).reduce(
        (total: number, current: any) => total + Number(current.amount || 0),
        0
      );
      setTotalWithdrawals(balance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTotalDeposits();
    fetchTotalWithdrawals();
    fetchAccountsInfo();

    const fetchBalance = setInterval(() => {
      fetchAccountsInfo();
    }, 4000);

    return () => clearInterval(fetchBalance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser?._id]);

  const cards = useMemo(
    () => [
      {
        title: "Total MT5 Accounts",
        value: loggedUser?.accounts?.length || 0,
        decimals: 0,
        Icon: Coins,
        glow: `linear-gradient(135deg, rgba(244,218,156,0.26), rgba(179,112,66,0.20), rgba(144,52,36,0.12))`,
        iconBgTw: "from-[#f4da9c]/40 via-[#b37042]/25 to-[#903424]/15",
        iconGlowCss: `radial-gradient(circle, rgba(244,218,156,0.40), rgba(179,112,66,0.10), transparent 70%)`,
      },
      {
        title: "Available Balance",
        value: equity,
        decimals: 2,
        suffix: " USD",
        Icon: isPositive ? TrendingUp : TrendingDown,
        glow: isPositive
          ? `linear-gradient(135deg, rgba(0, 240, 170, 0.22), rgba(0, 116, 255, 0.18), rgba(90, 255, 90, 0.10))`
          : `linear-gradient(135deg, rgba(255, 0, 120, 0.22), rgba(255, 60, 60, 0.18), rgba(255, 0, 200, 0.10))`,
        iconBgTw: isPositive
          ? "from-[#7a0b0b]/45 via-[#b31b1b]/25 to-[#f1b5b5]/15"
          : "from-[#903424]/45 via-[#6b1918]/25 to-[#f4da9c]/10",
        iconGlowCss: isPositive
          ? `radial-gradient(circle, rgba(244,218,156,0.42), rgba(179,112,66,0.12), transparent 70%)`
          : `radial-gradient(circle, rgba(144,52,36,0.40), rgba(107,25,24,0.14), transparent 70%)`,
      },
      {
        title: "Total Deposits",
        value: totalDeposits,
        decimals: 2,
        suffix: " USD",
        Icon: ArrowUpCircle,
        glow: `linear-gradient(135deg, rgba(214,195,168,0.20), rgba(244,218,156,0.18), rgba(179,112,66,0.12))`,
        iconBgTw: "from-[#d6c3a8]/35 via-[#f4da9c]/25 to-[#b37042]/15",
        iconGlowCss: `radial-gradient(circle, rgba(214,195,168,0.38), rgba(244,218,156,0.14), transparent 70%)`,
      },
      {
        title: "Total Withdrawals",
        value: totalWithdrawals,
        decimals: 2,
        suffix: " USD",
        Icon: ArrowDownCircle,
        glow: `linear-gradient(135deg, rgba(144,52,36,0.22), rgba(107,25,24,0.18), rgba(179,112,66,0.10))`,
        iconBgTw: "from-[#903424]/40 via-[#6b1918]/25 to-[#b37042]/12",
        iconGlowCss: `radial-gradient(circle, rgba(144,52,36,0.38), rgba(107,25,24,0.14), transparent 70%)`,
      },
      {
        title: "Total Transfer",
        value: totalWithdrawals,
        decimals: 2,
        suffix: " USD",
        Icon: Zap,
        glow: `linear-gradient(135deg, rgba(179,112,66,0.22), rgba(244,218,156,0.16), rgba(84,11,18,0.10))`,
        iconBgTw: "from-[#b37042]/40 via-[#f4da9c]/20 to-[#540b12]/15",
        iconGlowCss: `radial-gradient(circle, rgba(179,112,66,0.36), rgba(244,218,156,0.12), transparent 70%)`,
      },
      {
        title: "Total IB",
        value: totalWithdrawals,
        decimals: 2,
        suffix: " USD",
        Icon: DollarSign,
        glow: `linear-gradient(135deg, rgba(244,218,156,0.22), rgba(84,11,18,0.16), rgba(144,52,36,0.12))`,
        iconBgTw: "from-[#f4da9c]/35 via-[#540b12]/22 to-[#903424]/14",
        iconGlowCss: `radial-gradient(circle, rgba(244,218,156,0.34), rgba(144,52,36,0.12), transparent 70%)`,
      },
    ],
    [equity, isPositive, loggedUser?.accounts?.length, totalDeposits, totalWithdrawals]
  );

  return (
    <div
      className="
        relative overflow-hidden
        bg-gradient-to-br from-gray-900/60 via-black/60 to-gray-900/60
        px-3 py-4
        sm:px-5 sm:py-6
        lg:px-8 lg:py-8
      "
    >
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 0.28; } 50% { opacity: 0.52; } }
        @keyframes shine { 0% { transform: translateX(-110%) rotate(45deg); } 100% { transform: translateX(220%) rotate(45deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-18px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-14px) translateX(6px); }
        }
      `}</style>

      <ParticleField />

      {/* Warm grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(244,218,156,0.35) 1px, transparent 1px),
              linear-gradient(90deg, rgba(244,218,156,0.35) 1px, transparent 1px)
            `,
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ✅ Responsive grid: 1 col (mobile) / 2 col (sm) / 3 col (lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-4">
          {cards.map((card: any, i: number) => (
            <NeonCard
              key={card.title}
              delay={i * 0.1}
              glow={card.glow}
              borderConic={`conic-gradient(from 0deg, ${THEME.gold}, ${THEME.caramel}, ${THEME.red}, ${THEME.burgundy}, ${THEME.gold})`}
            >
              {/* ✅ Responsive layout inside card */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Icon */}
                <div className="relative shrink-0">
                  <div
                    className={`
                      flex items-center justify-center rounded-xl bg-gradient-to-br ${card.iconBgTw}
                      border shadow-lg
                      h-12 w-12
                      sm:h-14 sm:w-14
                    `}
                    style={{ borderColor: THEME.borderSoft }}
                  >
                    <card.Icon className="text-white" size={22} />
                  </div>

                  {/* Icon glow */}
                  <div
                    className="absolute inset-0 rounded-xl blur-xl opacity-70"
                    style={{ background: card.iconGlowCss }}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p
                    className="uppercase tracking-wider font-semibold mb-1 text-[11px] sm:text-xs"
                    style={{ color: THEME.textMuted }}
                  >
                    {card.title}
                  </p>

                  <p
                    className="
                      font-bold leading-tight
                      text-[20px]
                      sm:text-2xl
                      break-words
                    "
                    style={{ color: THEME.text }}
                  >
                    <AnimatedNumber
                      value={card.value}
                      decimals={card.decimals}
                      suffix={card.suffix || ""}
                    />
                  </p>
                </div>
              </div>
            </NeonCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;

/* ===================================================================================== */
/* NOTE:
   - This keeps your theme + effects.
   - Responsiveness added via: px/py responsive, gap responsive, icon size responsive,
     and text sizes with break-words + min-w-0 so it won’t overflow on mobile.
*/
/* ===================================================================================== */
