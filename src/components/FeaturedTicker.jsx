import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FeaturedTicker = ({ nfts }) => {
  const [index, setIndex] = useState(0);
  const [scratchedTexture, setScratchedTexture] = useState(null);
  const MotionDiv = motion.div;

  const formatPriceInEth = (weiValue) => {
    try {
      const wei = BigInt(weiValue ?? 0);
      const base = 10n ** 18n;
      const whole = wei / base;
      const fraction = (wei % base)
        .toString()
        .padStart(18, "0")
        .slice(0, 4)
        .replace(/0+$/, "");

      return fraction ? `${whole}.${fraction}` : whole.toString();
    } catch {
      return "0";
    }
  };

  const shortAddress = (address) => {
    if (!address) return "unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Generate scratched texture SVG on mount
  useEffect(() => {
    const generateScratchedTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      // Fill with dark gray/black background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add scratches and imperfections
      for (let i = 0; i < 200; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 2 + 0.5;
        const angle = Math.random() * Math.PI;
        const length = Math.random() * 30 + 5;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.02})`;
        ctx.fillRect(0, 0, width, length);
        ctx.restore();
      }

      // Add dust particles
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 1.5,
          Math.random() * 1.5,
        );
      }

      // Add corner wear
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(30, 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, 30);
        ctx.stroke();

        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(30, 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, 30);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(30, 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, 30);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(canvas.width, canvas.height);
        ctx.scale(-1, -1);
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(30, 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, 30);
        ctx.stroke();
        ctx.restore();
      }

      return canvas.toDataURL();
    };

    setScratchedTexture(generateScratchedTexture());
  }, []);

  // Auto-scroll logic (every 30 seconds)
  useEffect(() => {
    if (nfts.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % nfts.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [nfts]);

  useEffect(() => {
    if (index >= nfts.length) {
      setIndex(0);
    }
  }, [index, nfts.length]);

  if (!nfts || nfts.length === 0) return null;

  const activeNft = nfts[index];

  return (
    <div className="hidden lg:flex fixed right-4 xl:right-10 top-[52%] -translate-y-1/2 z-40 flex-col items-center gap-6 pointer-events-none">
      {/* Scroll Indicator - Vintage Style */}
      <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent" />

      {/* Decorative Top Element */}
      <div className="text-[8px] font-mono text-white/20 tracking-widest rotate-90 mb-4">
        ⋆ FEATURED ⋆
      </div>

      <div className="relative h-[480px] w-64 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <MotionDiv
            key={index}
            initial={{ opacity: 0, y: 50, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            exit={{ opacity: 0, y: -50, rotateY: 10 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group relative w-full aspect-[3/4] pointer-events-auto"
          >
            {/* Main Card Container */}
            <div className="relative w-full h-full">
              {/* Uneven/Scratched Background */}
              <div
                className="absolute inset-0 bg-black"
                style={{
                  clipPath:
                    "polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%, 0% 50%, 1% 2%)",
                  background: scratchedTexture
                    ? `url(${scratchedTexture})`
                    : "#0a0a0a",
                  backgroundSize: "cover",
                  boxShadow:
                    "inset 0 0 50px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3)",
                }}
              />

              {/* Border with worn effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath:
                    "polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%, 0% 50%, 1% 2%)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
                }}
              />

              {/* Content Container */}
              <div
                className="relative h-full w-full flex flex-col p-4 text-white"
                style={{
                  clipPath:
                    "polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%, 0% 50%, 1% 2%)",
                }}
              >
                {/* Image Container */}
                <div className="flex-grow overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                  <img
                    src={activeNft.tokenURI}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    alt="Featured"
                    style={{
                      filter: "grayscale(100%)",
                    }}
                  />
                  {/* Vintage Overlay */}
                  <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none" />
                </div>

                {/* Content Area */}
                <div className="mt-3 space-y-2 relative">
                  {/* Asset Name with Vintage Stamp Effect */}
                  <div className="border-t border-white/20 pt-2">
                    <p className="text-[9px] font-mono text-white/40 tracking-widest uppercase">
                      ASSET REGISTRY
                    </p>
                    <p className="text-[11px] font-mono font-bold uppercase tracking-tighter mt-0.5 text-white/80">
                      {activeNft.name.length > 20
                        ? activeNft.name.slice(0, 18) + "..."
                        : activeNft.name}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                    <span className="text-[8px] font-mono text-white/40 tracking-wider">
                      ₿ PRICE
                    </span>
                    <span className="text-[11px] font-bold tracking-tight text-white/90">
                      {formatPriceInEth(activeNft.price)} ETH
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px]">
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">OWNER</span>
                      <span className="font-mono text-white/70 text-[8px]">
                        {shortAddress(activeNft.owner)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">ID</span>
                      <span className="font-mono text-white/70 text-[8px]">
                        #{activeNft.tokenId?.toString?.()?.slice(0, 6) || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center col-span-2">
                      <span className="text-white/40">STATUS</span>
                      <span
                        className={`text-[8px] font-mono ${
                          activeNft.isListed
                            ? "text-green-400/70"
                            : "text-red-400/70"
                        }`}
                      >
                        {activeNft.isListed ? "● LISTED" : "○ UNLISTED"}
                      </span>
                    </div>
                  </div>

                  {/* Vintage Stamp Mark */}
                  <div className="absolute -bottom-1 -right-1 opacity-20">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                      <circle
                        cx="15"
                        cy="15"
                        r="12"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M15 8 L15 22 M8 15 L22 15"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute -top-1 -left-1 w-6 h-6">
              <div className="absolute top-0 left-0 w-3 h-[1px] bg-white/30" />
              <div className="absolute top-0 left-0 w-[1px] h-3 bg-white/30" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6">
              <div className="absolute top-0 right-0 w-3 h-[1px] bg-white/30" />
              <div className="absolute top-0 right-0 w-[1px] h-3 bg-white/30" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6">
              <div className="absolute bottom-0 left-0 w-3 h-[1px] bg-white/30" />
              <div className="absolute bottom-0 left-0 w-[1px] h-3 bg-white/30" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6">
              <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-white/30" />
              <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-white/30" />
            </div>
          </MotionDiv>
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="font-mono text-[9px] text-white/30 tracking-wider">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(nfts.length).padStart(2, "0")}
        </div>
        <div className="h-12 w-[1px] bg-gradient-to-b from-white/30 to-transparent" />

        {/* Vintage Arrow Indicator */}
        <div className="text-[10px] text-white/20 font-mono animate-pulse">
          ▼
        </div>
      </div>
    </div>
  );
};

export default FeaturedTicker;
