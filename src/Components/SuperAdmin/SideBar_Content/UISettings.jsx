// UISettings.jsx
import React, { useMemo, useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Settings2 } from "lucide-react";
import { backendApi } from "../../../utils/apiClients";
import { useDispatch } from "react-redux";
// import backendApi from "../../../utils/apiClients";
//import { setIsEnabled } from "../../../redux/user/userSlice";
import { Trash2 } from "lucide-react";


/* ===================== Helpers ===================== */
const cx = (...c) => c.filter(Boolean).join(" ");

/* ===================== Motion Variants ===================== */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, when: "beforeChildren", staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 140, damping: 18 } },
};

/* =========================================================================
   ✅ THEME: "NEON REACTOR / CIRCUIT RAVE" (UserNewChallenge vibe)
   ✅ Layout exactly: Right aligned Create button, table below it
   ✅ Modal: Name, Description, Toggle switch (green enabled / red disabled), Submit centered
   ======================================================================= */

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
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#020307]" />

      <motion.div
        className="absolute -top-[28rem] -left-[28rem] h-[60rem] w-[60rem] rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.65), transparent 58%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30rem] -right-[30rem] h-[64rem] w-[64rem] rounded-full blur-3xl opacity-35"
        style={{
          background: "radial-gradient(circle at 70% 60%, rgba(59,130,246,0.62), transparent 60%)",
        }}
        animate={{ scale: [1.06, 0.95, 1.06], opacity: [0.18, 0.4, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.55), transparent 62%)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, black 55%, transparent 85%)",
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
          background: "linear-gradient(to bottom, transparent 0%, rgba(34,197,94,0.85) 50%, transparent 100%)",
        }}
        animate={{ y: ["-10vh", "120vh"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <div  
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 85% at 50% 18%, transparent 35%, rgba(0,0,0,0.88) 82%)",
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
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
      }}
      animate={{ x: ["-120%", "120%"] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
    />

    <div className="relative">{children}</div>
  </div>
);

const FieldLabel = ({ children }) => (
  <div className="text-xs font-black tracking-wider text-white/70 mb-2">{children}</div>
);

const PrimaryButton = ({ children, onClick, type = "button", disabled = false }) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
    whileTap={disabled ? {} : { scale: 0.97 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className={cx(
      "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-black text-sm",
      "border border-white/10 backdrop-blur-xl",
      disabled ? "bg-white/5 text-white/35 cursor-not-allowed" : "bg-white/10 text-white hover:bg-white/15",
      "shadow-[0_0_40px_rgba(59,130,246,0.10)]"
    )}
    style={{
      backgroundImage:
        "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(59,130,246,0.16) 40%, rgba(236,72,153,0.14) 100%)",
    }}
  >
    {children}
  </motion.button>
);

function ToggleSwitch({ enabled, onChange }) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!enabled)}
      whileTap={{ scale: 0.98 }}
      className={cx(
        "relative h-10 w-[150px] rounded-full border overflow-hidden",
        enabled ? "border-emerald-300/25" : "border-rose-300/25",
        "bg-white/5"
      )}
    >
      {/* bar */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: 1,
        }}
        style={{
          background: enabled
            ? "linear-gradient(90deg, rgba(16,185,129,0.42), rgba(34,197,94,0.18))"
            : "linear-gradient(90deg, rgba(244,63,94,0.40), rgba(236,72,153,0.18))",
        }}
      />
      {/* knob */}
      <motion.div
        className="absolute top-1 left-1 h-8 w-8 rounded-full bg-[#04050b] border border-white/15 shadow-[0_0_30px_rgba(0,0,0,0.45)]"
        animate={{ x: enabled ? 108 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      />
      <div className="relative h-full w-full flex items-center justify-between px-4 text-xs font-black tracking-wider">

      </div>
    </motion.button>
  );
}

/* ===================== Main Component ===================== */ 
export default function UISettings() {
  const [rows, setRows] = useState([]); // starts empty (as requested)
  const [open, setOpen] = useState(false);  
  const [formData,setFormData]=useState({
    name:"",
    description:"",
    enabled:true,

  })

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const dispatch=useDispatch();
  
  const fetchDetails=async()=>{
    try{

        const response = await backendApi.get("/s-admin/get-toogle");
        //dispatch(setEnabled(response.data.data));
        setRows(response.data.data);
        
    }
    catch(e){
        console.log(e);
    }
  }

  const openModal = () => {
    setName("");
    setDescription("");
    setEnabled(true);
    setOpen(true);
  };

  const closeModal = () =>{
     setOpen(false);
  }
  const ToggleStatus=async(enabled ,r)=>{
    console.log(enabled);
    console.log(r);

    
     const res = await backendApi.put(`/s-admin/update-toogle/${r._id}` ,{enabled});
     await fetchDetails();

  }
  const handleDeleteRule = async (r) => {
  try {
    // NOTE: aapke routes me spelling "toogle" hai, isliye yahi rakha:
    await backendApi.delete(`/s-admin/delete-toogle/${r._id}`);
    await fetchDetails();
  } catch (e) {
    console.error(e);
  }
};


 const onSubmit=async(e)=>{
     e.preventDefault();
     try{
     const res = await backendApi.post("/s-admin/add-toggle", {
      name: formData.name.trim(),
      description: formData.description.trim(),
      enabled: formData.enabled,

 })
 setOpen(false);
 await fetchDetails();
     }
     catch (e) {
      console.error(e);
     }
//      const fetchDetails=async()=>{
//     const response=await backendApi.get("/get-toggle")
//         console.log("response",response.data.data);
//   }
    }

  const  placeholderCount = 6;
  const showPlaceholders = rows.length === 0;

   useEffect(()=>{
         fetchDetails();
      },[]);

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="relative min-h-screen overflow-hidden text-white">
      <NeonReactorBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 py-3 -mt-10 sm:py-10">
        {/* Create button on the RIGHT */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <PrimaryButton onClick={openModal}>
            <Plus size={18} />
            Create
          </PrimaryButton>
        </motion.div>

        {/* Table BELOW the button */} 
        <motion.div variants={itemVariants} className="mt-6">
          <NeonFrame className="p-5 sm:p-6">
            {/* table header */}
            <div className="rounded-xl border border-white/10 bg-[#04050b]/70 backdrop-blur-2xl px-4 py-3">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3 text-xs font-black text-white/45 tracking-wider">NAME</div>
                <div className="col-span-3 text-xs font-black text-white/45 tracking-wider">DESCRIPTION</div>
                <div className="col-span-3 text-xs font-black text-white/45 tracking-wider text-right">TOGGLE</div>
                <div className="col-span-3 text-xs font-black text-white/45 tracking-wider text-right">Actions</div>

              </div>
            </div>

            {/* rows */}
            <div className="mt-3 space-y-2">
              {showPlaceholders
                ? Array.from({ length: placeholderCount }).map((_, i) => (
                    <div
                      key={`ph-${i}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4 text-sm font-bold text-white/35">—</div>
                        <div className="col-span-6 text-sm font-bold text-white/30">—</div>
                        <div className="col-span-2 flex justify-end">
                          <div className="h-10 w-[150px] rounded-full border border-white/10 bg-white/5" />
                        </div>
                      </div>
                    </div>
                  ))
                : rows.map((r, idx) => (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: idx * 0.04, type: "spring", stiffness: 160, damping: 18 }}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 text-sm font-black text-white/90 truncate">{r.name || "—"}</div>
                        <div className="col-span-4 text-sm font-bold text-white/70 truncate">{r.description || "—"}</div>
                        <div className="col-span-3 flex justify-end">
                          <ToggleSwitch
                            enabled={r.enabled}
                            onChange={(val) => ToggleStatus(val , r)}
                          />
                          </div>
                        <div className="col-span-2 flex justify-end">  
                           <button
    type="button"
    onClick={() => handleDeleteRule(r)}
    className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70
               hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-400/30 active:scale-95 transition"
  >
    <Trash2 className="h-4 w-4" />
  </button>

                        </div>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </NeonFrame>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}       
              exit={{ opacity: 0 }}
              onClick={closeModal}  
            />

            <motion.div 
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-xl p-6 -mt-90"
            >
              <NeonFrame className="p-6 sm:p-8 ">
                {/* header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                      className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 grid place-items-center"
                    >
                      <Settings2 className="text-blue-200" size={22} />
                    </motion.div>

                    <div>
                      <div
                        className="text-2xl sm:text-3xl font-black tracking-tight"
                        style={{
                          background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 40%, #ec4899 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Create Setting
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08, rotate: 10 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={closeModal}
                    className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 grid place-items-center"
                  >
                    <X className="text-white/70" size={18} />
                  </motion.button>
                </div>

                {/* form */}
                <form onSubmit={onSubmit} className="space-y-5">
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <input
                      value={formData.name}
                    //   onChange={(e) => setName(e.target.value)}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}

                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-green-300/25 focus:ring-4 focus:ring-green-400/10 transition-all"
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      value={formData.description}
                    //   onChange={(e) => setDescription(e.target.value)}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                      className="w-full min-h-[120px] resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-blue-300/25 focus:ring-4 focus:ring-blue-400/10 transition-all"
                      placeholder="Enter description"
                    />
                  </div>

                  <div>
                    <FieldLabel>Toggle</FieldLabel>
                    {/* <ToggleSwitch enabled={enabled} onChange={setEnabled} /> */}
                    <ToggleSwitch
  enabled={formData.enabled}
  onChange={(val) => setFormData(p => ({ ...p, enabled: val }))}
/>
                  </div>

                  {/* submit button centered */}
                  <div className="pt-2 flex justify-center">
                     {/* <PrimaryButton type="submit" disabled={!name.trim() || !description.trim()}>
                      Submit
                    </PrimaryButton>  */}
                     <PrimaryButton type="submit">
                      Submit
                    </PrimaryButton> 
                   
                  </div>
                </form>
              </NeonFrame>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

