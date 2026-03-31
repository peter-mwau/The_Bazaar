import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black pt-20 overflow-hidden">
      {/* 1. Signature Side Borders for the Footer */}
      <div className="absolute inset-y-0 left-4 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-y-0 right-4 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      {/* 2. Scanning Line Animation */}
      <motion.div
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-full h-[2px] bg-white/5 z-0 pointer-events-none"
      />

      {/* 3. Vintage Scratch Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L400 0 L400 600 L0 600 Z' fill='none'/%3E%3Cpath d='M50 50 L80 45 L75 80 Z' fill='white' opacity='0.2'/%3E%3Cpath d='M320 120 L340 118 L338 140 Z' fill='white' opacity='0.15'/%3E%3Cpath d='M150 450 L175 445 L172 470 Z' fill='white' opacity='0.1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "100px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16 z-10">
        {/* Grid Layout - Fixed column count */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 border-l border-white/5 pl-8">
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="inline-block group">
              <h2 className="text-2xl font-custom italic font-bold tracking-tighter text-transparent [-webkit-text-stroke:0.5px_white] transition-all duration-300 group-hover:[-webkit-text-stroke:0.8px_white]">
                THE BAZAAR
              </h2>
            </Link>
            <p className="text-gray-500 text-xs leading-relaxed font-mono uppercase tracking-tight">
              {"//"} Interweaving Art, Assets, and Accurate Data. Discover and
              Trade with Confidence.
            </p>
            <div className="inline-block border-l border-r border-white/20 px-3 py-1">
              <p className="text-[9px] text-white/40 tracking-[0.3em] font-mono">
                STABLE_BUILD: 2024
              </p>
            </div>
          </div>

          {/* PROTOCOLS Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/50 tracking-[0.4em] font-mono group cursor-pointer hover:text-white/80 transition-colors">
              ┌─ PROTOCOLS
            </h3>
            <ul className="space-y-2">
              {["Explore", "Featured", "Minting", "Vault"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-gray-500 hover:text-white text-[11px] transition-all font-mono group flex items-center gap-2"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all text-emerald-500 group-hover:translate-x-0 -translate-x-1">
                      ▶
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace Links */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/50 tracking-[0.4em] font-mono group cursor-pointer hover:text-white/80 transition-colors">
              ┌─ MARKETPLACE
            </h3>
            <ul className="space-y-2">
              {["Explore", "Featured", "Collections", "Create"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-gray-500 hover:text-white text-[11px] transition-all font-mono group flex items-center gap-2"
                  >
                    <span className="text-white/20 group-hover:text-white/40 transition-colors">
                      ↳
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/50 tracking-[0.4em] font-mono group cursor-pointer hover:text-white/80 transition-colors">
              ┌─ RESOURCES
            </h3>
            <ul className="space-y-2">
              {["Documentation", "Whitepaper", "Audit Report", "Terms"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-500 hover:text-white text-[11px] transition-all font-mono group flex items-center gap-2"
                    >
                      <span className="text-white/20 group-hover:text-white/40 transition-colors">
                        ↳
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        {item}
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/50 tracking-[0.4em] font-mono group cursor-pointer hover:text-white/80 transition-colors">
              ┌─ CONNECT
            </h3>
            <div className="space-y-4">
              <div className="flex gap-5">
                {[
                  { name: "Twitter", icon: "𝕏", link: "#" },
                  { name: "Discord", icon: "⌨", link: "#" },
                  { name: "GitHub", icon: "⟨⟩", link: "#" },
                  { name: "Medium", icon: "◊", link: "#" },
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.link}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-white transition-all duration-300 inline-block"
                  >
                    <span className="text-xl">{social.icon}</span>
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
              <div className="pt-2">
                <p className="text-[9px] text-white/30 font-mono tracking-tighter">
                  VERITAS PROTOCOL v1.0.4
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-emerald-500/60 rounded-full animate-pulse" />
                  <span className="text-[7px] text-white/30 font-mono tracking-wider">
                    CHAINLINK_ORACLE • ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Section - Enhanced */}
        <div className="mt-12 pt-4">
          <h3 className="text-[10px] font-bold text-white/40 tracking-[0.4em] font-mono mb-3">
            ┌─ SYSTEM_LOG
          </h3>
          <div className="bg-white/5 p-4 rounded border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[9px] text-emerald-500 font-mono uppercase tracking-widest">
                  NETWORK_MAINNET: ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-px h-3 bg-white/20" />
                <span className="text-[8px] text-white/30 font-mono uppercase tracking-tighter">
                  LAT: 24ms
                </span>
                <div className="w-px h-3 bg-white/20" />
                <span className="text-[8px] text-white/30 font-mono uppercase tracking-tighter">
                  BLOCK: 19283471
                </span>
                <div className="w-px h-3 bg-white/20" />
                <span className="text-[8px] text-white/30 font-mono uppercase tracking-tighter">
                  GAS: 18 GWEI
                </span>
              </div>
            </div>
            {/* Additional System Info */}
            <div className="mt-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-4 text-[7px] text-white/20 font-mono">
                <span>✓ ORACLE SYNCED</span>
                <span>✓ LIQUIDITY POOLS</span>
                <span>✓ CONTRACTS VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider with Animation */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <motion.span
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-black px-4 text-[10px] text-white/30 font-mono tracking-widest"
            >
              ⋆⋆⋆
            </motion.span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[8px] font-mono text-white/40 tracking-[0.2em] uppercase">
            © {currentYear} THE BAZAAR // ALL_RIGHTS_RESERVED
          </p>
          <div className="flex gap-6">
            {["Status", "Privacy", "Terms", "Contact"].map((item) => (
              <button
                key={item}
                className="text-[8px] font-mono text-white/40 hover:text-white/80 transition-colors uppercase tracking-wider hover:tracking-widest transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Large Background Star - Enhanced */}
        <motion.span
          animate={{ rotate: [12, 15, 12] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-100px] right-[-50px] text-[400px] -z-10 text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.02)] font-bold pointer-events-none"
        >
          ★
        </motion.span>

        {/* Additional Background Star (Left Side) */}
        <motion.span
          animate={{ rotate: [-8, -5, -8] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-80px] left-[-80px] text-[300px] -z-10 text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.01)] font-bold pointer-events-none"
        >
          ✦
        </motion.span>

        {/* ASCII Art */}
        <div className="hidden lg:block absolute bottom-4 right-8 opacity-10 hover:opacity-20 transition-opacity pointer-events-none">
          <pre className="text-[5px] leading-2 font-mono text-white select-none">
            {`
  ████████╗██╗  ██╗███████╗    ██████╗  █████╗ ███████╗ █████╗  █████╗ ██████╗ 
  ╚══██╔══╝██║  ██║██╔════╝    ██╔══██╗██╔══██╗╚══███╔╝██╔══██╗██╔══██╗██╔══██╗
     ██║   ███████║█████╗      ██████╔╝███████║  ███╔╝ ███████║███████║██████╔╝
     ██║   ██╔══██║██╔══╝      ██╔══██╗██╔══██║ ███╔╝  ██╔══██║██╔══██║██╔══██╗
     ██║   ██║  ██║███████╗    ██████╔╝██║  ██║███████╗██║  ██║██║  ██║██║  ██║
     ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
`}
          </pre>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
