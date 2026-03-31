import React, { useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PerspectiveGrid = () => {
  void motion;
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Mapping scroll to movement and opacity
  const gridMove = useTransform(scrollYProgress, [0.7, 1], ["0%", "30%"]);
  const gridOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 0.45]);
  const gridScale = useTransform(scrollYProgress, [0.7, 1], [0.95, 1]);

  const particleSeeds = useMemo(() => {
    const pseudoRandom = (n) => {
      const x = Math.sin(n * 999.91) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 50 }, (_, i) => {
      const startX = pseudoRandom(i + 1) * 100;
      const startY = pseudoRandom(i + 101) * 100;
      const endY = startY - (10 + pseudoRandom(i + 201) * 20);
      const driftX = (pseudoRandom(i + 301) - 0.5) * 20;
      const duration = 5 + pseudoRandom(i + 401) * 10;

      return {
        id: i,
        startX,
        startY,
        endY,
        driftX,
        duration,
      };
    });
  }, []);

  // Mouse movement effect for dynamic grid
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isHovering) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering]);

  return (
    <div
      className="relative h-[700px] w-full bg-black overflow-hidden perspective-[1000px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {/* Enhanced 3D Grid Floor */}
      <motion.div
        style={{
          rotateX: "75deg",
          rotateY: useTransform(
            scrollYProgress,
            [0.7, 1],
            [0, mousePosition.x * 0.5],
          ),
          scale: gridScale,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 60px 60px, 30px 30px",
          backgroundPosition: `0px ${gridMove}, 0px ${gridMove}, 0px 0px`,
          opacity: gridOpacity,
          filter: "drop-shadow(0 0 3px rgba(255,255,255,0.3))",
          transition: "transform 0.1s ease-out",
        }}
        className="absolute inset-x-0 bottom-[-50%] h-[300%] w-[200%] left-[-50%] origin-bottom pointer-events-none"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particleSeeds.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.startX}%`,
              y: `${particle.startY}%`,
              opacity: 0,
            }}
            animate={{
              y: [`${particle.startY}%`, `${particle.endY}%`],
              opacity: [0, 0.3, 0],
              x: `calc(${particle.startX}% + ${particle.driftX}px)`,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-[1px] h-[1px] bg-white/20 rounded-full"
          />
        ))}
      </div>

      {/* Vanishing Point Fade - Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

      {/* Additional Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />

      {/* Moving Scanline Beam - Enhanced */}
      <motion.div
        animate={{ y: ["-100%", "400%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 w-full h-[150px] z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 80%)`,
          filter: "blur(2px)",
        }}
      />

      {/* Glowing Horizon Line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-[15%] left-0 right-0 h-[1px] z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), rgba(100,255,100,0.4), rgba(255,255,255,0.6), transparent)",
          boxShadow: "0 0 10px rgba(255,255,255,0.3)",
        }}
      />

      {/* Floating Data Orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.4, 0],
            y: [0, -50, -100],
          }}
          transition={{
            duration: 4,
            delay: i * 1.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          style={{
            left: `${20 + i * 30}%`,
            bottom: `${20 + i * 10}%`,
          }}
          className="absolute w-1 h-1 rounded-full bg-emerald-500/40 blur-[1px] pointer-events-none"
        />
      ))}

      {/* Terminal Label - Enhanced */}
      <div className="absolute bottom-20 left-10 z-20">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-white/60 to-transparent" />
          <p className="text-[9px] font-mono text-white/50 uppercase tracking-[0.5em] hover:text-white/80 transition-colors">
            Sector_Grid_Synced
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[7px] font-mono text-white/20">ACTIVE</span>
          </div>
        </motion.div>
      </div>

      {/* Status Display - Right Side */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-20 right-10 z-20 text-right"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
              GRID RESOLUTION
            </span>
            <span className="text-[10px] font-mono text-white/60">
              1024x1024
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
              DEPTH
            </span>
            <span className="text-[10px] font-mono text-white/60">
              INFINITE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Center Coordinates Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
      >
        <p className="text-[7px] font-mono text-white/20 tracking-[0.2em]">
          [ X: 0.00 | Y: 0.00 | Z: 0.00 ]
        </p>
      </motion.div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20" />

      {/* Hover Effect Glow */}
      {isHovering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 pointer-events-none bg-gradient-radial from-white/10 via-transparent to-transparent"
          style={{
            background: `radial-gradient(circle at ${
              mousePosition.x * 10 + 50
            }% ${
              mousePosition.y * 10 + 50
            }%, rgba(255,255,255,0.1) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .perspective-[1000px] {
          perspective: 1000px;
        }

        @keyframes gridPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .grid-line {
          animation: gridPulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PerspectiveGrid;
