import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  Zap,
  ShieldCheck,
  Globe,
  TrendingUp,
  TrendingDown,
  Cpu,
  Database,
} from "lucide-react";

const ProtocolStats = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [animatedValues, setAnimatedValues] = useState({
    Total_Volume: 0,
    Assets_Minted: 0,
    Veritas_Nodes: 0,
    Global_Reach: 0,
  });

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Real stats with dynamic changes
  const [liveStats, setLiveStats] = useState({
    Total_Volume: 1284.5,
    Assets_Minted: 42069,
    Veritas_Nodes: 812,
    Global_Reach: 142,
  });

  const [trends, setTrends] = useState({
    Total_Volume: "+2.3%",
    Assets_Minted: "+0.8%",
    Veritas_Nodes: "+5.2%",
    Global_Reach: "+1.4%",
  });

  const stats = [
    {
      key: "Total_Volume",
      label: "Total_Volume",
      value: liveStats.Total_Volume.toFixed(1),
      unit: "ETH",
      icon: <Activity size={14} />,
      trend: trends.Total_Volume,
      color: "emerald",
      description: "24h trading volume",
    },
    {
      key: "Assets_Minted",
      label: "Assets_Minted",
      value: liveStats.Assets_Minted.toLocaleString(),
      unit: "NFT",
      icon: <Zap size={14} />,
      trend: trends.Assets_Minted,
      color: "blue",
      description: "Total minted assets",
    },
    {
      key: "Veritas_Nodes",
      label: "Veritas_Nodes",
      value: liveStats.Veritas_Nodes.toLocaleString(),
      unit: "ACTIVE",
      icon: <ShieldCheck size={14} />,
      trend: trends.Veritas_Nodes,
      color: "purple",
      description: "Oracle nodes online",
    },
    {
      key: "Global_Reach",
      label: "Global_Reach",
      value: liveStats.Global_Reach,
      unit: "SECTORS",
      icon: <Globe size={14} />,
      trend: trends.Global_Reach,
      color: "cyan",
      description: "Active regions",
    },
  ];

  // Animate numbers when in view
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;

      const targets = {
        Total_Volume: 1284.5,
        Assets_Minted: 42069,
        Veritas_Nodes: 812,
        Global_Reach: 142,
      };

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setAnimatedValues({
          Total_Volume: targets.Total_Volume * progress,
          Assets_Minted: Math.floor(targets.Assets_Minted * progress),
          Veritas_Nodes: Math.floor(targets.Veritas_Nodes * progress),
          Global_Reach: Math.floor(targets.Global_Reach * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues({
            Total_Volume: targets.Total_Volume,
            Assets_Minted: targets.Assets_Minted,
            Veritas_Nodes: targets.Veritas_Nodes,
            Global_Reach: targets.Global_Reach,
          });
        }
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        Total_Volume: +(prev.Total_Volume + (Math.random() - 0.5) * 2).toFixed(
          1,
        ),
        Assets_Minted: prev.Assets_Minted + Math.floor(Math.random() * 10),
        Veritas_Nodes: prev.Veritas_Nodes + (Math.random() > 0.7 ? 1 : 0),
        Global_Reach: prev.Global_Reach,
      }));

      setTrends({
        Total_Volume:
          (Math.random() > 0.5 ? "+" : "-") +
          (Math.random() * 5).toFixed(1) +
          "%",
        Assets_Minted: "+" + (Math.random() * 2).toFixed(1) + "%",
        Veritas_Nodes: "+" + (Math.random() * 3).toFixed(1) + "%",
        Global_Reach: "+" + (Math.random() * 1.5).toFixed(1) + "%",
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTrendColor = (trend) => {
    return trend.startsWith("+") ? "text-emerald-500" : "text-red-500";
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 bg-black border-y border-white/5 overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(0,255,0,0.02) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(0,255,0,0.02) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(0,255,0,0.02) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* 3D Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          transform: "skewY(-2deg)",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100 - 20}%`],
              opacity: [0, 0.1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            className="absolute w-[1px] h-[1px] bg-white/20 rounded-full"
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header Metadata */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-emerald-500/60" />
              <p className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-[0.4em]">
                {"//"} Protocol_Metrics
              </p>
              <div className="flex items-center gap-1">
                <Cpu size={10} className="text-white/30" />
                <span className="text-[8px] font-mono text-white/20">
                  LIVE_DATA_STREAM
                </span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-custom italic font-bold text-transparent [-webkit-text-stroke:0.8px_white] uppercase">
              Market Intelligence
            </h2>
            <p className="text-xs font-mono text-white/40 max-w-xl">
              Real-time metrics from the Bazaar protocol • Chainlink oracle
              verified • 24/7 monitoring
            </p>
          </div>

          <div className="text-right font-mono">
            <div className="flex items-center gap-2 justify-end">
              <Database size={10} className="text-white/30" />
              <p className="text-[8px] text-white/30 uppercase tracking-widest">
                LAST_UPDATE
              </p>
            </div>
            <p className="text-sm text-white/60 font-mono tracking-tighter">
              {timestamp}
            </p>
            <div className="mt-1 flex items-center gap-2 justify-end">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[7px] font-mono text-emerald-500/40">
                SYNC_ACTIVE
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="relative bg-black p-6 sm:p-8 transition-all duration-300 group cursor-pointer"
            >
              {/* Background Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-[1px] bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 left-0 w-[1px] h-6 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-gradient-to-l from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-gradient-to-t from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon and Label */}
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`flex items-center gap-2 text-white/40 group-hover:text-${stat.color}-400 transition-all duration-300`}
                >
                  {stat.icon}
                  <span className="text-[9px] font-mono uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 text-[8px] font-mono ${getTrendColor(
                    stat.trend,
                  )}`}
                >
                  {stat.trend.startsWith("+") ? (
                    <TrendingUp size={10} />
                  ) : (
                    <TrendingDown size={10} />
                  )}
                  {stat.trend}
                </div>
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-custom font-bold text-white tracking-tighter">
                  {isInView
                    ? stat.key === "Total_Volume"
                      ? animatedValues.Total_Volume.toFixed(1)
                      : stat.key === "Assets_Minted"
                      ? animatedValues.Assets_Minted.toLocaleString()
                      : stat.key === "Veritas_Nodes"
                      ? animatedValues.Veritas_Nodes.toLocaleString()
                      : animatedValues.Global_Reach
                    : "0"}
                </span>
                <span className="text-[10px] font-mono text-white/40 group-hover:text-white/60 transition-colors">
                  {stat.unit}
                </span>
              </div>

              {/* Description */}
              <p className="text-[8px] font-mono text-white/20 mb-4">
                {stat.description}
              </p>

              {/* Status Pulse */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-[7px] font-mono text-emerald-500/50 uppercase tracking-wider">
                  Verified by Chainlink
                </span>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 1.5, delay: idx * 0.1 }}
                  className={`h-full bg-gradient-to-r from-${stat.color}-500 to-emerald-500`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Metrics Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-white/5"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[8px] font-mono text-white/30">
                  Chainlink Oracle v3.0
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span className="text-[8px] font-mono text-white/30">
                  Real-time Aggregation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span className="text-[8px] font-mono text-white/30">
                  Decentralized Network
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
                Last Block: 19,283,471
              </span>
              <div className="w-px h-3 bg-white/10" />
              <span className="text-[7px] font-mono text-white/20 uppercase tracking-wider">
                Gas: 14 GWEI
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
    </section>
  );
};

export default ProtocolStats;
