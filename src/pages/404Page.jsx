import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldAlert, Home, RefreshCw, Copy, Check } from "lucide-react";

const NotFound = () => {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [identity] = useState(() => {
    const randomValues = new Uint32Array(2);

    if (window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(randomValues);
      return {
        errorCode: (randomValues[0] % 9000) + 1000,
        diagnosticId: `0x${randomValues[1].toString(16).slice(0, 8)}`,
      };
    }

    return {
      errorCode: 4040,
      diagnosticId: "0x00000000",
    };
  });
  const particles = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    x: (index * window.innerWidth) / 20,
    y: (((index * 137) % 100) / 100) * window.innerHeight,
    duration: 2 + (index % 3) * 0.7,
    delay: (index % 5) * 0.15,
  }));

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyErrorCode = () => {
    navigator.clipboard.writeText(`ERR_404_${identity.errorCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const MotionSpan = motion.span;
  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  return (
    <div className="bg-black min-h-screen flex items-center justify-center relative overflow-hidden font-mono">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-size-[30px_30px] pointer-events-none" />

      {/* Glitch Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-linear-to-r from-red-500/10 via-transparent to-red-500/10 animate-pulse" />
      </div>

      {/* 1. Corrupted Background Star */}
      <MotionSpan
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.05, 1],
          filter: ["blur(2px)", "blur(8px)", "blur(2px)"],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 0.3, repeat: Infinity }}
        className="absolute text-[600px] md:text-[800px] -z-10 text-transparent [-webkit-text-stroke:2px_rgba(255,0,0,0.15)] font-bold pointer-events-none select-none"
      >
        ✦
      </MotionSpan>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-0.5 h-0.5 bg-red-500/30 rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            y: [null, -20, 20],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      {/* 2. Central Terminal Panel */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-[90%] max-w-2xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-6 md:p-12 relative shadow-2xl shadow-red-500/10"
      >
        {/* Glitch Line Animation */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500 to-transparent animate-[glitch_2s_linear_infinite]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500 to-transparent animate-[glitch_2s_linear_infinite_reverse]" />

        {/* Error Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="relative">
            <ShieldAlert className="text-red-500 w-10 h-10 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-custom italic lg:text-6xl font-bold text-white uppercase tracking-tighter">
              Error
              <span className="text-transparent [-webkit-text-stroke:0.8px_white]">
                _404
              </span>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono">
                {identity.errorCode}
              </span>
            </h1>
            <p className="text-[10px] text-red-500/70 uppercase tracking-[0.2em] mt-1">
              Status: Access_Denied | Sector: Restricted_Zone
            </p>
          </div>
          <button
            onClick={copyErrorCode}
            className="text-gray-500 hover:text-white transition-colors"
            title="Copy error code"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        {/* Error Details */}
        <div className="space-y-4 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 items-start"
          >
            <span className="text-red-500 font-bold">{">"}</span>
            <p className="text-gray-400 text-sm leading-relaxed">
              The requested resource at{" "}
              <span className="text-red-400 bg-red-500/10 px-1 py-0.5 rounded font-mono text-xs">
                {window.location.pathname}
              </span>{" "}
              could not be located in the Bazaar Mainframe. Data packets may be
              corrupted, moved, or never existed.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 items-start"
          >
            <span className="text-yellow-500 font-bold">{">"}</span>
            <p className="text-gray-400 text-sm">
              Possible causes: Broken link, mistyped URL, or the NFT has been
              burned from existence.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 items-center"
          >
            <span className="text-red-500 font-bold animate-pulse">{">"}</span>
            <div className="flex gap-2 items-center">
              <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                Packet_Loss: 100% | Signal_Strength: 0%
              </p>
            </div>
          </motion.div>

          {/* Auto-redirect indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 pt-4 border-t border-white/5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Auto-reboot in:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>
                <span className="text-red-400 font-mono">{countdown}s</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1">
            <MotionButton
              whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-white/10 backdrop-blur border border-white/20 text-white font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-500 hover:border-red-500 transition-all duration-300 group rounded"
            >
              <Home
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              Return_To_Hub
            </MotionButton>
          </Link>

          <MotionButton
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 w-full py-3 bg-transparent border border-white/20 text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/5 transition-all duration-300 rounded"
          >
            <RefreshCw size={16} />
            Scan_Again
          </MotionButton>
        </div>

        {/* Diagnostic Info */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <details className="text-[10px] text-gray-600 cursor-pointer group">
            <summary className="hover:text-gray-400 transition-colors">
              {">"} View_Diagnostic_Report
            </summary>
            <div className="mt-3 space-y-1 font-mono">
              <p>Timestamp: {new Date().toLocaleString()}</p>
              <p>User_Agent: {navigator.userAgent.slice(0, 50)}...</p>
              <p>Referrer: {document.referrer || "Direct_Access"}</p>
              <p>Error_ID: {identity.diagnosticId}</p>
            </div>
          </details>
        </div>
      </MotionDiv>

      {/* 3. Bottom Technical Info */}
      <div className="absolute bottom-5 left-5 right-5 text-[8px] md:text-[9px] text-white/10 flex flex-wrap justify-between gap-3">
        <p>TERMINAL: BAZAAR_MAINFRAME_v2.0.4</p>
        <p>ENCRYPTION: ACTIVE (AES-256)</p>
        <p>LATENCY: ∞</p>
        <p>SECTOR: VOID_{identity.errorCode}</p>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes glitch {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes glitch-reverse {
          0% { transform: translateX(100%); opacity: 0; }
          50% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        
        .animate-glitch-line {
          animation: glitch 4s linear infinite;
        }
        
        .animate-glitch-line-reverse {
          animation: glitch-reverse 4s linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
