import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronRight, Cpu, Zap, Activity } from "lucide-react";

const messages = [
  "> INITIALIZING MARKET_SCAN...",
  "> SCANNING SECTOR_7: 42 NEW ASSETS DETECTED.",
  "> VERITAS ORACLE: SYNC_COMPLETE (LATENCY: 12MS).",
  "> ALERT: HIGH TRADING VOLUME IN 'CYBER_SAMURAI' COLLECTION.",
  "> SYSTEM_NOTICE: GAS_PRICE STABILIZED AT 14 GWEI.",
  "> NEW USER_ID: 0x71...fE2 HAS ENTERED THE BAZAAR.",
  "> ANALYZING LIQUIDITY_POOLS... [OK]",
  "> CHAINLINK FEED: ETH/USD @ $2,345.67",
  "> NFT_MINT: 'NEON_DREAM' #1243 MINTED BY 0x3a...bF9",
  "> MARKET_CAP: +2.3% OVER LAST HOUR",
];

const TerminalNews = () => {
  void motion;
  const [logs, setLogs] = useState([]);
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const terminalRef = useRef(null);

  const commands = {
    help: "Available commands: status, price, volume, clear, help",
    status: "SYSTEM STATUS: ONLINE | BLOCK: 19,283,471 | PEERS: 247",
    price: "ETH/USD: $2,345.67 | BTC/USD: $43,210.89 | LINK/USD: $18.42",
    volume: "24H VOLUME: 1,234 ETH | ACTIVE USERS: 8,942",
    clear: "CLEAR",
  };

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLogs = [...prev, messages[i]];
        return nextLogs.length > 8 ? nextLogs.slice(1) : nextLogs;
      });
      i = (i + 1) % messages.length;
    }, 4000); // New log every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.toLowerCase().trim();
    let response = "";

    if (commands[cmd]) {
      response = commands[cmd];
      if (cmd === "clear") {
        setLogs([]);
        setCommandHistory([]);
        response = "> TERMINAL CLEARED";
      }
    } else {
      response = `> COMMAND NOT RECOGNIZED: '${cmd}'. TYPE 'help' FOR AVAILABLE COMMANDS.`;
    }

    setCommandHistory([...commandHistory, { cmd: commandInput, response }]);
    setCommandInput("");

    // Add command to logs
    setLogs((prev) => [...prev, `> ${commandInput}`, response]);
  };

  return (
    <section className="py-16 bg-black px-4 my-30 sm:px-8 relative overflow-hidden">
      {/* Vintage Scratch Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L400 0 L400 600 L0 600 Z' fill='none'/%3E%3Cpath d='M50 50 L80 45 L75 80 Z' fill='white' opacity='0.2'/%3E%3Cpath d='M320 120 L340 118 L338 140 Z' fill='white' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "100px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative group">
        {/* Terminal Header - Enhanced */}
        <div className="flex items-center justify-between bg-white/5 border-l border-r border-t border-white/20 rounded-t-md px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors cursor-pointer" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 hover:bg-emerald-500 transition-colors cursor-pointer" />
            </div>
            <div className="w-px h-4 bg-white/20 mx-2" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={10} /> BAZAAR_OS_TERMINAL
            </span>
            <div className="flex items-center gap-1">
              <Cpu size={10} className="text-white/30" />
              <span className="text-[8px] font-mono text-white/20">v2.1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Activity size={8} className="text-emerald-500/60" />
              <span className="text-[8px] font-mono text-emerald-500/60">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={8} className="text-white/30" />
              <span className="text-[8px] font-mono text-white/30 animate-pulse">
                LIVE_FEED
              </span>
            </div>
          </div>
        </div>

        {/* Terminal Body - Scrollable */}
        <div
          ref={terminalRef}
          className="bg-black/40 backdrop-blur-sm border-l border-r border-b border-white/20 rounded-b-md p-5 min-h-[280px] max-h-[320px] overflow-y-auto relative"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.2) rgba(0,0,0,0.5)",
          }}
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:20px_20px]" />

          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" />

          <div className="relative z-10 font-mono text-[11px] space-y-1.5">
            <AnimatePresence mode="popLayout">
              {logs.map((log, index) => {
                const isCommand =
                  log.startsWith("> ") &&
                  !log.includes("COMMAND NOT RECOGNIZED");
                const isError =
                  log.includes("NOT RECOGNIZED") || log.includes("ERROR");
                const isSuccess =
                  log.includes("[OK]") || log.includes("COMPLETE");

                return (
                  <motion.div
                    key={log + index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-2 ${
                      index === logs.length - 1
                        ? "text-white"
                        : isError
                        ? "text-red-500/80"
                        : isSuccess
                        ? "text-emerald-500/80"
                        : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`mt-0.5 ${
                        isCommand
                          ? "text-blue-500/60"
                          : isError
                          ? "text-red-500"
                          : "text-emerald-500/60"
                      }`}
                    >
                      {isCommand ? ">" : "›"}
                    </span>
                    <span className="break-all">{log}</span>
                    {index === logs.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-1.5 h-3.5 bg-emerald-500 ml-1"
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Command Input - Interactive Terminal */}
        <form onSubmit={handleCommandSubmit} className="mt-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md p-2 hover:border-white/20 transition-colors focus-within:border-white/30">
            <span className="text-emerald-500 font-mono text-xs">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter command (help, status, price, volume, clear)..."
              className="flex-1 bg-transparent text-white text-xs font-mono outline-none placeholder:text-white/20"
            />
            <button
              type="submit"
              className="text-[9px] font-mono text-white/40 hover:text-white/80 transition-colors uppercase tracking-wider"
            >
              EXECUTE
            </button>
          </div>
          <div className="mt-2 flex gap-4 text-[8px] font-mono text-white/20">
            <span>Available: help, status, price, volume, clear</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Press Enter to execute</span>
          </div>
        </form>

        {/* Bottom Metadata - Enhanced */}
        <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
                CONNECTION: STABLE
              </span>
            </div>
            <div className="w-px h-2 bg-white/10" />
            <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
              BLOCK_HEIGHT: 19,283,471
            </span>
            <div className="w-px h-2 bg-white/10" />
            <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
              PEERS: 247
            </span>
          </div>
          <p className="text-[7px] font-mono text-white/10 uppercase tracking-[0.3em]">
            Protocol_Ver: v2.1.0 // User_Status: Authorized
          </p>
        </div>

        {/* ASCII Art Decoration */}
        <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none hidden lg:block">
          <pre className="text-[4px] leading-2 font-mono">
            {`
  ╔══════════════════════╗
  ║   TERMINAL_ACTIVE   ║
  ║   SINCE 2024        ║
  ╚══════════════════════╝
`}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default TerminalNews;
