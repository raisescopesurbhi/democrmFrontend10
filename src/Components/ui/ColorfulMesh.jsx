import { motion } from "framer-motion";

const ColorfulMesh = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-900 to-blue-950" />

    <motion.div
      className="absolute -top-64 -left-64 h-[900px] w-[900px] rounded-full blur-[140px]"
      style={{
        background:
          "radial-gradient(circle, rgba(236,72,153,0.4), rgba(168,85,247,0.3) 40%, transparent 70%)",
      }}
      animate={{ scale: [1, 1.3, 1], x: [0, 80, 0], y: [0, 60, 0], rotate: [0, 90, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />

    <motion.div
      className="absolute -bottom-64 -right-64 h-[1000px] w-[1000px] rounded-full blur-[150px]"
      style={{
        background:
          "radial-gradient(circle, rgba(59,130,246,0.5), rgba(14,165,233,0.4) 45%, transparent 75%)",
      }}
      animate={{ scale: [1.2, 0.8, 1.2], x: [0, -60, 0], y: [0, -80, 0], rotate: [0, -90, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

export default ColorfulMesh;
