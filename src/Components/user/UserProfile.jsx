import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Flag,
  Edit3,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";  
import UseUserHook from "../../hooks/user/UseUserHook";
import { backendApi } from "../../utils/apiClients";

/* =========================== MOCK DATA & HOOKS ============================ */

const UserProfile = () => {
  const loggedUser = useSelector((store) => store?.user?.loggedUser) || {};

  const [formData, setFormData] = useState({
    firstName: loggedUser.firstName || "",
    lastName: loggedUser.lastName || "",
    email: loggedUser.email || "",
    mobileNumber: loggedUser.phone || "",
    address: loggedUser.address || "",
    state: loggedUser.state || "",
    zipCode: loggedUser.zipCode || "",
    city: loggedUser.city || "",
    country: loggedUser.country || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { getUpdateLoggedUser } = UseUserHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!loggedUser?._id) {
      toast.error("Please sign in to update your profile.");
      return;
    }

    const toastID = toast.loading("Syncing to chain…");
    setIsLoading(true);

    try {
      await backendApi.put("/update-user", {
        id: loggedUser._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        zipCode: formData.zipCode,
      });

      toast.success("Profile updated ✨", { id: toastID });
      getUpdateLoggedUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Update failed. Try again.", { id: toastID });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* ===================== NEON REACTOR / CIRCUIT RAVE BACKDROP ===================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* base */}
        <div className="absolute inset-0 bg-[#020307]" />

        {/* neon blobs */}
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

        {/* circuit lines */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage:
              "radial-gradient(120% 85% at 50% 10%, black 55%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(120% 85% at 50% 10%, black 55%, transparent 85%)",
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
          {Array.from({ length: 28 }).map((_, i) => {
            const x = (i * 37) % 100;
            const y = (i * 61) % 100;
            const s = 1 + ((i * 11) % 3);
            const d = 3 + ((i * 7) % 7);
            const o = 0.18 + (((i * 9) % 45) / 100);
            return (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: s,
                  height: s,
                  opacity: o,
                  filter: "drop-shadow(0 0 14px rgba(34,197,94,0.35))",
                }}
                animate={{ opacity: [o, o + 0.35, o], y: [0, -10, 0] }}
                transition={{ duration: d, repeat: Infinity, ease: "easeInOut" }}
              />
            );
          })}
        </div>

        {/* scan beam */}
        <motion.div
          className="absolute inset-x-0 -top-48 h-48 opacity-[0.12]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
          }}
          animate={{ y: ["-10vh", "120vh"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />

        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 85% at 50% 18%, transparent 35%, rgba(0,0,0,0.88) 82%)",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Center Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-5"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()} // ya react-router navigate(-1)
            className="absolute left-0 flex items-center justify-center w-11 h-11 rounded-xl
               border border-white/10 bg-white/5 text-white/80
               hover:text-white hover:bg-white/10 backdrop-blur mx-73"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div className="flex items-center justify-center mb-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Profile 
            </h1>
          </div>
        </motion.div>

        <div className="flex justify-end gap-3 mt-6">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black font-semibold shadow-[0_10px_40px_rgba(34,197,94,0.25)]"
          >
            <Edit3 size={18} />
            Edit Profile
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 -mt-5"
        >
          {/* TOP-LEFT icon, then name, then email */}
          <div className="flex items-start justify-between">
            <motion.div
              whileHover={{ scale: 1.03, rotate: 2 }}
              className="relative -mt-9"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-300 via-blue-400 to-pink-400 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-[#04050b] flex items-center justify-center border border-white/10">
                  <User size={34} className="text-green-200" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#04050b]">
                <CheckCircle size={18} className="text-black" />
              </div>
            </motion.div>
          </div>

          {/* name + email */}
          <div className="mt-5">
            <h2 className="text-2xl font-bold text-white leading-tight">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-green-200/90 text-sm mt-1 mb-4">
              {formData.email}
            </p>
          </div>
        </motion.div>

        {/* Right Column - Form (WIDTH INCREASED) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3" // ✅ THIS increases the form width
        >
          <div className="space-y-6">
            {/* Personal Information Card */}
            <div className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_28px_140px_rgba(0,0,0,0.55)]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-green-200" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  icon={<User size={18} />}
                  disabled={!isEditing}
                  required
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  icon={<User size={18} />}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_28px_140px_rgba(0,0,0,0.55)]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail size={20} className="text-blue-200" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={<Mail size={18} />}
                  disabled={true}
                  readOnly
                />
                <FormInput
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  icon={<Phone size={18} />}
                  disabled={true}
                  readOnly
                />
              </div>
            </div>

            {/* Address Information Card */}
            <div className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_28px_140px_rgba(0,0,0,0.55)]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-pink-200" />
                Address Information
              </h3>

              <div className="space-y-4">
                <FormInput
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  icon={<MapPin size={18} />}
                  disabled={!isEditing}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    icon={<MapPin size={18} />}
                    disabled={!isEditing}
                  />
                  <FormInput
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    icon={<MapPin size={18} />}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Zip Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    icon={<MapPin size={18} />}
                    disabled={!isEditing}
                  />
                  <FormInput
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    icon={<Flag size={18} />}
                    disabled={true}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Submit / Cancel Buttons (your code had these commented; kept unchanged) */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* =========================== SUB-COMPONENTS ============================ */

const FormInput = ({
  label,
  name,
  value,
  onChange,
  icon,
  disabled,
  readOnly,
  required,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white/70 flex items-center gap-1">
      {label}
      {required && <span className="text-green-200">*</span>}
    </label>

    <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(34,197,94,0.18), rgba(59,130,246,0.14), rgba(236,72,153,0.14))",
        }}
        whileHover={readOnly || disabled ? {} : { opacity: 1 }}
        transition={{ duration: 0.25 }}
      />

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45">
          {icon}
        </div>

        <motion.input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          whileFocus={readOnly || disabled ? {} : { scale: 1.01 }}
          className={`w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-white/35 focus:outline-none transition-all ${
            readOnly || disabled
              ? "cursor-not-allowed text-white/45"
              : "focus:ring-2 focus:ring-green-400/20"
          }`}
        />
      </div>
    </div>
  </div>
);

export default UserProfile;
