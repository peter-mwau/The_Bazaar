import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  "USER_CONNECTED: 0x...a3f",
  "ORACLE_SYNC: BLOCK_19283",
  "NEW_LISTING: NEON_SAMURAI",
  "LIQUIDITY_CHECK: [OK]",
  "ENCRYPTING_DATA_STREAM...",
];

const SystemAlerts = () => {
  void motion;
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert =
        notifications[Math.floor(Math.random() * notifications.length)];
      setAlerts((prev) => [
        ...prev.slice(-2),
        { id: Date.now(), text: newAlert },
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 left-10 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            className="flex items-center gap-3 px-3 py-1 bg-white/5 border-l border-white/20 backdrop-blur-sm"
          >
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
              {alert.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SystemAlerts;
