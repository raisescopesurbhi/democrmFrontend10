import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import UseUserHook from "../../../hooks/user/UseUserHook";
import { backendApi } from "../../../utils/apiClients";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE"
   - Theme/gradient/animations match your provided Neon Reactor code
   - NO Reactor Rings
   - Logic/workflow unchanged
   ======================================================================= */

const cx = (...c) => c.filter(Boolean).join(" ");

/* ============================== THEME DECOR ============================== */

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
      <div className="absolute inset-0 bg-[#020307]" />

      <motion.div
        className="absolute -top-[28rem] -left-[28rem] h-[60rem] w-[60rem] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), transparent 58%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30rem] -right-[30rem] h-[64rem] w-[64rem] rounded-full blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.62), transparent 60%)",
        }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), transparent 62%)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-44 right-16 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle at 45% 45%, rgba(16,185,129,0.55), transparent 64%)",
        }}
        animate={{ scale: [1, 1.09, 1], x: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage:
            "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
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
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
        }}
        animate={{ y: ["-10vh", "120vh"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 18%, transparent 35%, rgba(0,0,0,0.88) 82%)",
        }}
      />
    </div>
  );
};

const NeonFrame = ({ className = "", children }) => (
  <div
    className={cx(
      "relative rounded-[30px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl overflow-hidden",
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
    <div className="absolute inset-[1px] rounded-[29px] bg-[#04050b]/80" />
    <motion.div
      className="absolute inset-0 opacity-[0.09]"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
      }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
    />
    <div className="relative">{children}</div>
  </div>
);

const FieldLabel = ({ label }) => (
  <label className="block text-[12px] text-white/75 font-black tracking-wide mb-2">
    {label}
  </label>
);

const InputWrap = ({ children }) => (
  <div
    className={cx(
      "relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden",
      "focus-within:border-green-300/25 focus-within:ring-2 focus-within:ring-green-400/10"
    )}
  >
    <motion.div
      className="absolute inset-0 opacity-0"
      style={{
        background:
          "linear-gradient(90deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
      }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    />
    <div className="relative">{children}</div>
  </div>
);

const InputField = ({ label, placeholder, value, onChange, name }) => (
  <div className="w-full">
    <FieldLabel label={label} />
    <InputWrap>
      <motion.input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        whileFocus={{ scale: 1.01 }}
        className={cx(
          "w-full bg-transparent px-4 py-3.5",
          "outline-none text-white/90 text-[13px] font-black placeholder:text-white/35"
        )}
      />
    </InputWrap>
  </div>
);

const btnPrimary =
  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110";

/* ============================== COMPONENT ================================ */

const UserWalletDetails = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);

  const [formData, setFormData] = useState({
    tetherAddress: loggedUser?.walletDetails?.tetherAddress || "",
    ethAddress: loggedUser?.walletDetails?.ethAddress || "",
    accountNumber: loggedUser?.walletDetails?.accountNumber || "",
    trxAddress: loggedUser?.walletDetails?.trxAddress || "",
  });

  const { getUpdateLoggedUser } = UseUserHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async () => {
    const toastId = toast.loading("Plese wait..");
    try {
      await backendApi.put(`/client/${loggedUser._id}/wallet-details`, {
        tetherAddress: formData.tetherAddress,
        accountNumber: formData.accountNumber,
        trxAddress: formData.trxAddress,
        ethAddress: formData.ethAddress,
      });
      getUpdateLoggedUser();
      toast.success("Details updated", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!", { id: toastId });
    }
  };

  useEffect(() => {
    getUpdateLoggedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <NeonReactorBackdrop />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 170, damping: 18 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <NeonFrame className="p-5 sm:p-7">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="USDT (Trc20)"
                placeholder="Enter USDT(Trc20) address"
                value={formData.tetherAddress}
                onChange={handleInputChange}
                name="tetherAddress"
              />
              <InputField
                label="USDT (Bep20)"
                placeholder="Enter USDT(Bep20) address"
                value={formData.ethAddress}
                onChange={handleInputChange}
                name="ethAddress"
              />
              <InputField
                label="Binance ID"
                placeholder="Enter Binance ID"
                value={formData.accountNumber}
                onChange={handleInputChange}
                name="accountNumber"
              />
              <InputField
                label="BTC Address"
                placeholder="Enter BTC address"
                value={formData.trxAddress}
                onChange={handleInputChange}
                name="trxAddress"
              />
            </div>

            <div className="mt-6 flex items-center justify-center">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitHandler}
                className={cx(
                  "rounded-2xl px-6 py-3 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                  btnPrimary
                )}
                type="button"
              >
                Update Details
              </motion.button>
            </div>
          </div>
        </NeonFrame>
      </motion.div>
    </div>
  );
};

export default UserWalletDetails;
