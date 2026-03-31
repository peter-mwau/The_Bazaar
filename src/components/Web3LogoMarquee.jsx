import React, { useState } from "react";
import { motion } from "framer-motion";

const logos = [
  { name: "Ethereum", src: "/ethereum3.svg" },
  { name: "Bitcoin", src: "/bitcoin.svg" },
  { name: "Solana", src: "/solana.svg" },
  { name: "Binance", src: "/binance.svg" },
  { name: "Avalanche", src: "/avalanche.svg" },
  { name: "Arbitrum", src: "/arbitrum.svg" },
  { name: "Aptos", src: "/aptos.svg" },
  { name: "Stellar", src: "/stellar.svg" },
  { name: "Tron", src: "/tron.svg" },
  { name: "Litecoin", src: "/litecoin.svg" },
  { name: "MetaMask", src: "/metamask.svg" },
  { name: "Uniswap", src: "/uniswap.svg" },
  { name: "Worldcoin", src: "/worldcoin.svg" },
  { name: "Skale", src: "/skale.svg" },
];

function Web3LogoMarquee() {
  void motion;
  const [isHovered, setIsHovered] = useState(false);
  const duplicated = [...logos, ...logos];

  return (
    <section
      className="relative  bg-black py-12 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Enhanced Gradient Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-black via-black/90 to-transparent z-10" />

      {/* 2. Vintage Label with Animation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-2 left-10 z-20"
      >
        <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.5em] hover:text-white/50 transition-colors">
          {"//"} NETWORK_PARTNERS_PROTOCOL_v4.0
        </p>
      </motion.div>

      {/* 3. Optional Counter Badge */}
      <div className="absolute top-2 right-10 z-20 hidden sm:block">
        <p className="text-[8px] font-mono text-white/20 tracking-wider">
          {logos.length} INTEGRATIONS
        </p>
      </div>

      {/* 4. Marquee Track */}
      <div className="web3-marquee-track flex w-max items-center gap-12 sm:gap-20">
        {duplicated.map((logo, index) => (
          <motion.div
            key={`${logo.name}-${index}`}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-16 w-32 shrink-0 items-center justify-center 
                       border-l border-r border-white/10 bg-white/2 px-4 
                       transition-all duration-500 group-hover:grayscale-0 
                       hover:bg-white/10 hover:border-white/40 cursor-pointer"
          >
            {/* Tooltip on Hover */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              <div className="bg-black/90 border border-white/20 rounded px-2 py-1 text-[8px] font-mono text-white/80 whitespace-nowrap">
                {logo.name}
              </div>
            </div>

            <img
              src={logo.src}
              alt={logo.name}
              className="max-h-8 w-auto object-contain opacity-40 hover:opacity-100 transition-all duration-300 group-hover:opacity-60"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* 5. Terminal Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* 6. Additional Scratch Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L400 0 L400 600 L0 600 Z' fill='none'/%3E%3Cpath d='M50 50 L80 45 L75 80 Z' fill='white' opacity='0.2'/%3E%3Cpath d='M320 120 L340 118 L338 140 Z' fill='white' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "100px",
          }}
        />
      </div>

      {/* 7. Animated Glow Effect on Hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      )}

      <style>{`
        @keyframes web3-marquee {
          0% { 
            transform: translateX(0);
          }
          100% { 
            transform: translateX(-50%);
          }
        }

        @keyframes slow-pulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }

        .web3-marquee-track {
          animation: web3-marquee 45s linear infinite;
          will-change: transform;
        }

        .web3-marquee-track:hover {
          animation-play-state: paused;
        }

        /* Add smooth gradient animation */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {/* 8. Optional: Add a subtle speed control indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <div className="w-1 h-1 bg-white/20 rounded-full" />
        </div>
        <p className="text-[6px] text-white/20 font-mono mt-0.5">
          HOVER PAUSED
        </p>
      </div>
    </section>
  );
}

export default Web3LogoMarquee;
