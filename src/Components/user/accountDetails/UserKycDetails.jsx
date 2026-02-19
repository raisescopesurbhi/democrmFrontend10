import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,            
  Maximize,
  Minimize,
  Loader,
  CheckCircle2,
  Ban,
  Camera,
} from "lucide-react";
import { useSelector } from "react-redux"; 
import UseUserHook from "../../../hooks/user/UseUserHook"
import toast from "react-hot-toast";
import { getData } from "country-list";
import { backendApi } from "../../../utils/apiClients";
import { FloatingParticles } from "../../../utils/FloatingParticles";
import {Sparkles} from "lucide-react";

/* =========================================================================
   💚💗💙 THEME: "NEON REACTOR / CIRCUIT RAVE" (APPLIED HERE)
   - Neon green + hot pink + electric blue + emerald on deep black
   - Heavy animations + shimmer borders + glow tiles
   - NO Reactor Rings
   - Workflow/APIs unchanged
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

      {/* particles */}
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
    {/* animated neon border */}
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
    {/* subtle shimmer */}
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

const Pill = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "border-white/10 bg-white/5 text-white/75",
    green: "border-green-300/25 bg-green-500/12 text-green-100",
    emerald: "border-emerald-300/25 bg-emerald-500/12 text-emerald-100",
    blue: "border-blue-300/25 bg-blue-500/12 text-blue-100",
    pink: "border-pink-300/25 bg-pink-500/12 text-pink-100",
    yellow: "border-yellow-300/25 bg-yellow-500/12 text-yellow-100",
    red: "border-red-300/25 bg-red-500/12 text-red-100",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-black tracking-wide",
        tones[tone] || tones.gray
      )}
    >
      {children}
    </span>
  );
};

/* ========================= FIELDS (UNCHANGED LOGIC) ========================= */

const SelectWrap = ({ disabled, children }) => (
  <div
    className={cx(
      "relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden",
      "focus-within:border-green-300/25 focus-within:ring-2 focus-within:ring-green-400/10",
      disabled && "opacity-60"
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

const DropdownField = ({ label, options, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[12px] text-white/75 font-black tracking-wide mb-2">
      {label}
    </label>

    <SelectWrap>
      <select
        className={cx(
          "w-full appearance-none bg-transparent px-4 py-3.5 pr-10",
          "outline-none text-white/90 text-[13px] font-black"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option className="bg-[#0b0d14]" value="" disabled>
          Select {label}
        </option>
        {options?.map((option, index) => (
          <option className="bg-[#0b0d14]" key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none">
        ▾
      </span>
    </SelectWrap>
  </div>
);

const ImageUploadField = ({ label, onFileChange }) => {
  const fieldNameMap = {
    "Front Side of Document": "frontSideOfDocument",
    "Back Side of Document": "backSideOfDocument",
    "Selfie with Document": "selfieWithDocument",
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onFileChange(fieldNameMap[label], {
        file,
        preview: reader.result,
        label,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <label className="block text-[12px] text-white/75 font-black tracking-wide mb-2">
        {label}
      </label>

      <div className="relative flex flex-col gap-2">
        {/* Upload from device */}
        <input
          type="file"
          className="hidden"
          id={`file-${label}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
              onFileChange(fieldNameMap[label], {
                file,
                preview: reader.result,
                label,
              });
            };
            reader.readAsDataURL(file);
          }}
          accept="image/*"
        />

        {/* Camera capture */}
        <input
          type="file"
          className="hidden"
          id={`camera-${label}`}
          onChange={handleCameraCapture}
          accept="image/*"
          capture="environment"
        />

        <motion.label
          htmlFor={`file-${label}`}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 cursor-pointer font-black text-[13px]"
        >
          <Upload className="mr-2" size={18} />
          Choose file
        </motion.label>

        {/* Camera Button (mobile only) */}
        <motion.label
          htmlFor={`camera-${label}`}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="md:hidden flex items-center justify-center w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 cursor-pointer font-black text-[13px]"
        >
          <Camera className="mr-2" size={18} />
          Open Camera
        </motion.label>
      </div>
    </div>
  );
};

const ImagePreview = ({ label, preview, onRemove, onFullScreen }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative group"
    >
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="aspect-[3/4] w-full">  
          {isLoading && (
            <div className="absolute inset-0 grid place-items-center bg-black/30">
              <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
            </div>
          )}

          <img
            src={preview}
            alt={`Preview of ${label}`}
            className={cx(
              "w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />  
        </div>

        <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={onFullScreen}
            className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors duration-300 mr-2"
            type="button"
          >
            <Maximize size={20} />
          </button>
          <button
            onClick={onRemove}
            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors duration-300"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <p className="mt-2 text-[12px] text-white/70 text-center font-black">
        {label}
      </p>
    </motion.div>
  );
};

const FullScreenModal = ({ image, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
  >
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <img
        src={image}
        alt="Full screen preview"
        className="max-w-full max-h-full object-contain"
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors duration-300"
        type="button"
      >
        <Minimize size={24} />
      </button>
    </div>
  </motion.div>
);

/* ============================== COMPONENT ============================== */

const UserKycDetails = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const { getUpdateLoggedUser } = UseUserHook();

  const countriesArray = getData();

  const [formData, setFormData] = useState({
    documentType: loggedUser?.kycDetails?.documentType || "",
    countryOfIssue: loggedUser?.kycDetails?.countryOfIssue || "",
    purpose: loggedUser?.kycDetails?.purpose || "",
    occupation: loggedUser?.kycDetails?.occupation || "",
  });

  const [imageFiles, setImageFiles] = useState({
    frontSideOfDocument: null,
    backSideOfDocument: null,
    selfieWithDocument: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    "Front Side of Document": "",
    "Back Side of Document": "",
    "Selfie with Document": "",
  });

  const [fullScreenImage, setFullScreenImage] = useState(null);

  const documentTypes = ["Passport", "Driver's License", "National ID"];
  const countries = countriesArray?.map((value) => value.name);
  const purposes = ["Personal", "Business", "Investment"];
  const occupations = [
    "Employee",
    "Self-Employed",
    "Student",
    "Retired",  
    "Unemployed",
  ];

  const handleDropdownChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFileChange = (fieldName, { file, preview, label }) => {
    setImageFiles((prev) => ({ ...prev, [fieldName]: file }));
    setImagePreviews((prev) => ({ ...prev, [label]: preview }));
  };

  const handleRemove = (label) => {
    const fieldNameMap = {
      "Front Side of Document": "frontSideOfDocument",
      "Back Side of Document": "backSideOfDocument",
      "Selfie with Document": "selfieWithDocument",
    };

    setImageFiles((prev) => ({ ...prev, [fieldNameMap[label]]: null }));
    setImagePreviews((prev) => ({ ...prev, [label]: "" }));
  };

  const customContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdrawal Request Confirmation - Arena Trade</title>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 5px;
        background-color: #ffffff;
      }
      .header {
        background-color: #19422df2;
        color: #ffffff;
        padding: 20px 15px;
        text-align: center;
        border-radius: 10px 10px 0 0;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        letter-spacing: 1px;
      }
      .content {
        padding: 10px 20px;
      }
      .cta-button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #2d6a4f;
        color: #FFFFFF;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin: 10px 0;
      }
      .footer {
        background-color: #19422df2;
        color: #ffffff;
        text-align: center;
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 0 0 10px 10px;
      }
      .footer-info {
        margin-top: 6px;
      }
      .footer-info a {
        color: #B6D0E2;
        text-decoration: none;
      }
      .withdrawal-details {
        background-color: #f8f8f8;
        border-left: 4px solid #2d6a4f;
        padding: 15px;
        margin: 20px 0;
      }
      .withdrawal-details p {
        margin: 5px 0;
      }
      .highlight {
        font-weight: bold;
        color: #0a2342;
      }
      .risk-warning {
        color: #C70039;
        padding: 5px;
        font-size: 12px;
        line-height: 1.4;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Kyc submitted</h1>
      </div>
      <div class="content">
        <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
<p>Your KYC has been successfully submitted. We will notify you when it gets verified!</p>
        <div class="withdrawal-details">
        <p>Username: <span class="highlight">${loggedUser.email}</span></p>
         <p>Document Type: <span class="highlight">${formData?.documentType}</span></p>
          <p>Country of issue: <span class="highlight">${formData.countryOfIssue}</span></p>
          <p>Purpose: <span class="highlight">${formData.purpose}</span></p>
          <p>Occupation: <span class="highlight">${formData.occupation}</span></p>
        </div>

  <p>Thank you for choosing us.</p>
  <p>Happy trading!</p>

        <p>Best regards,<br>The ${import.meta.env.VITE_WEBSITE_NAME || "Forex"} Team</p>
        <hr>
   <div class="risk-warning">
    <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
    <br><br>
    Our services are not for U.S. citizens or in jurisdictions where they violate local laws.
  </div>

      </div>
       <div class="footer">
         <div class="footer-info">
                  <p>Website: <a href="https://${import.meta.env.VITE_EMAIL_WEBSITE}"> ${import.meta.env.VITE_EMAIL_WEBSITE} </a> |
            E-mail: <a href="mailto:${import.meta.env.VITE_EMAIL_EMAIL || ""}">${import.meta.env.VITE_EMAIL_EMAIL || ""}</a></p>

                  <p>© 2025 ${import.meta.env.VITE_WEBSITE_NAME || ""}. All Rights Reserved</p>
                </div>
        </div>
    </div>
  </body>
  </html>`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait..");

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

       if (imageFiles.frontSideOfDocument) {
        formDataToSend.append("frontSideOfDocument", imageFiles.frontSideOfDocument);
       }
       if (imageFiles.backSideOfDocument) {
         formDataToSend.append("backSideOfDocument", imageFiles.backSideOfDocument);
       }
       if (imageFiles.selfieWithDocument) {
      formDataToSend.append("selfieWithDocument", imageFiles.selfieWithDocument);
       }

      formDataToSend.append("status", "submitted");

      await backendApi.put(`/client/${loggedUser._id}/kyc-details`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await backendApi.post(`/client/custom-mail`, {
        email: loggedUser.email,
        content: customContent,
        subject: "Kyc Submitted",
      });

      getUpdateLoggedUser();
      toast.success("Details updated", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!", { id: toastId });
    }
  };

  useEffect(() => {
    const getFullImageUrl = (path) => {
      if (!path) return "";
      return path.startsWith("http")
        ? path
        : `${import.meta.env.VITE_API_BASE_URL}/${path.replace(/\\/g, "/")}`;
    };

    // setImagePreviews({
    //   "Front Side of Document": getFullImageUrl(
    //     loggedUser?.kycDetails?.frontSideOfDocument || ""  
    //   ),
    //   "Back Side of Document": getFullImageUrl(
    //     loggedUser?.kycDetails?.backSideOfDocument || ""
    //   ),
    //   "Selfie with Document": getFullImageUrl(
    //     loggedUser?.kycDetails?.selfieWithDocument || ""
    //   ),
    // });
  }, [loggedUser]);

  useEffect(() => {
    getUpdateLoggedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = loggedUser?.kycDetails?.status;

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <NeonReactorBackdrop />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 170, damping: 18 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-7 py-2"
      >
        <FloatingParticles />

        {/* STATUS (kept logic, themed UI) */}
        {loggedUser?.kycDetails?.documentType && (
          <div className="flex gap-2 font-semibold pt-2 items-center justify-center mb-4">
            <Pill tone="gray">Status</Pill>

            {status === "submitted" ? (
              <Pill tone="yellow">
                <Loader className="h-4 w-4 animate-spin" />
                Under Review
              </Pill>
            ) : status === "approved" ? (
              <Pill tone="green">
                <CheckCircle2 className="h-4 w-4" />
                Approved
              </Pill>
            ) : status === "rejected" ? (
              <Pill tone="red">
                <Ban className="h-4 w-4" />
                Rejected
              </Pill>
            ) : null}
          </div>
        )}

        <NeonFrame className="p-5 sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Pill tone="green">
                  <Sparkles className="h-3.5 w-3.5" />
                  KYC MODULE
                </Pill>
                <Pill tone="blue">UPLOAD · VERIFY</Pill>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-pink-400">
                  KYC Details
                </span>
              </h1>
              <p className="text-white/70 mt-2 max-w-2xl text-[13px]">
                Submit your details and upload clear documents for verification.
              </p>
            </div>
          </div>

          {/* FORM (unchanged workflow) */}
          <form onSubmit={handleSubmit} className="mt-6">
            {/* Dropdown Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DropdownField
                label="Purpose"
                options={purposes}
                value={formData.purpose}
                onChange={(value) => handleDropdownChange("purpose", value)}
              />
              <DropdownField
                label="Occupation"
                options={occupations}
                value={formData.occupation}
                onChange={(value) => handleDropdownChange("occupation", value)}
              />
              <DropdownField
                label="Document Type"
                options={documentTypes}
                value={formData.documentType}
                onChange={(value) => handleDropdownChange("documentType", value)}
              />
              <DropdownField
                label="Country of Issue"
                options={countries}
                value={formData.countryOfIssue}
                onChange={(value) => handleDropdownChange("countryOfIssue", value)}
              />
            </div>

            {/* Image Upload Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
              {Object.keys(imagePreviews).map((label) => (
                <ImageUploadField
                  key={label}
                  label={label}
                  onFileChange={handleFileChange}
                />
              ))}
            </div>

            {/* Image Previews */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
              <AnimatePresence>
                {Object.entries(imagePreviews).map(([label, preview]) =>
                  preview ? (
                    <ImagePreview
                      key={label}
                      label={label}
                      preview={preview}
                      onRemove={() => handleRemove(label)}
                      onFullScreen={() => setFullScreenImage(preview)}
                    />
                  ) : null
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center mt-8">
              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cx(
                  "rounded-2xl px-6 py-3 text-[13px] font-black transition inline-flex items-center justify-center gap-2",
                  "bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-black hover:brightness-110"
                )}
              >
                Update Details
              </motion.button>
            </div>
          </form>
        </NeonFrame>
      </motion.div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <FullScreenModal
            image={fullScreenImage}
            onClose={() => setFullScreenImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserKycDetails;
