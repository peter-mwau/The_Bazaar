import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMarketPlace } from "../contexts/useMarketPlace";
import { useActiveAccount } from "thirdweb/react";
import {
  Box,
  Zap,
  Database,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  Award,
  TrendingUp,
} from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";

function MarketPlace() {
  const { marketData, fetchAllNFTs, listNFT, delistNFT } = useMarketPlace();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [actionLoadingTokenId, setActionLoadingTokenId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all"); // all, listed, owned
  const scrollContainerRef = useRef(null);
  const account = useActiveAccount();
  const connectedAddress = account?.address?.toLowerCase();
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
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    fetchAllNFTs();
  }, [fetchAllNFTs]);

  const handleList = async (tokenId) => {
    try {
      setActionLoadingTokenId(tokenId.toString());
      await listNFT(tokenId);
      await fetchAllNFTs();
    } finally {
      setActionLoadingTokenId(null);
    }
  };

  const handleUnlist = async (tokenId) => {
    try {
      setActionLoadingTokenId(tokenId.toString());
      await delistNFT(tokenId);
      await fetchAllNFTs();
    } finally {
      setActionLoadingTokenId(null);
    }
  };

  const nfts = marketData?.allNFTs || [];
  const listedNFTs = nfts.filter((nft) => nft.isListed);
  const ownedNFTs = nfts.filter(
    (nft) => nft.owner?.toLowerCase?.() === connectedAddress,
  );

  const displayNFTs =
    selectedTab === "all"
      ? nfts
      : selectedTab === "listed"
      ? listedNFTs
      : ownedNFTs;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-black min-h-screen pt-24 pb-20 relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_50%)]" />
        <span className="absolute top-1/4 left-1/4 text-[300px] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.02)] font-bold rotate-12">
          ★
        </span>
        <span className="absolute bottom-1/4 right-1/4 text-[400px] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.02)] font-bold -rotate-12">
          ✦
        </span>
      </div>

      <FilterSidebar isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="border-l-2 border-white/40 pl-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-4 bg-emerald-500/60" />
              <p className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-[0.4em]">
                // BAZAAR_MARKETPLACE
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-custom font-bold text-white uppercase tracking-tighter italic">
              Asset{" "}
              <span className="text-transparent [-webkit-text-stroke:0.8px_white]">
                Inventory
              </span>
            </h1>
            <p className="text-gray-500 font-mono text-[10px] mt-3 uppercase tracking-[0.3em] flex items-center gap-3">
              <span>LISTING_PROTOCOL: v1.0.4</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>{displayNFTs.length} RECORDS FOUND</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 border border-white/20 px-5 py-2.5 text-[11px] font-mono text-white uppercase hover:bg-white/5 transition-all hover:border-white/40"
            >
              <Filter className="w-3.5 h-3.5" /> FILTERS
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 mb-8 border-b border-white/10"
        >
          {[
            {
              id: "all",
              label: "ALL ASSETS",
              count: nfts.length,
              icon: Database,
            },
            {
              id: "listed",
              label: "LISTED",
              count: listedNFTs.length,
              icon: TrendingUp,
            },
            {
              id: "owned",
              label: "MY COLLECTION",
              count: ownedNFTs.length,
              icon: Award,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`relative px-6 py-3 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                selectedTab === tab.id
                  ? "text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
              <span
                className={`text-[9px] ${
                  selectedTab === tab.id ? "text-emerald-500" : "text-white/30"
                }`}
              >
                ({tab.count})
              </span>
              {selectedTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* HORIZONTAL SCROLL SECTION - FEATURED LISTED NFTS */}
        {listedNFTs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-emerald-500/60" />
                <h2 className="text-sm font-mono text-white uppercase tracking-widest">
                  FEATURED_LISTINGS
                </h2>
                <div className="flex items-center gap-1">
                  <Zap size={10} className="text-emerald-500/60" />
                  <span className="text-[8px] text-emerald-500/40">
                    LIVE_AUCTION
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="p-1.5 border border-white/20 hover:border-white/40 transition-all rounded"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-1.5 border border-white/20 hover:border-white/40 transition-all rounded"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {listedNFTs.slice(0, 10).map((nft, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="flex-none w-64 hover:bg-white/5 hover:border-r hover:border-l border-white/10 rounded-lg overflow-hidden group hover:border-white/30 transition-all cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={nft.tokenURI}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[8px] font-mono text-emerald-400">
                      LISTED
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold uppercase truncate text-white/60">
                      {nft.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[9px] font-mono text-white/40">
                        PRICE
                      </span>
                      <span className="text-[10px] font-bold text-white">
                        {formatPriceInEth(nft.price)} ETH
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Main NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {displayNFTs.map((nft, index) => {
              const tokenIdStr = nft.tokenId?.toString?.() || "";
              const isOwner =
                !!connectedAddress &&
                nft.owner?.toLowerCase?.() === connectedAddress;
              const isListed = Boolean(nft.isListed);
              const isActionLoading = actionLoadingTokenId === tokenIdStr;

              return (
                <MotionDiv
                  key={nft.tokenId || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-gradient-to-b from-white/5 to-transparent border-r border-l border-white rounded-lg overflow-hidden hover:border-white hover:border-b hover:border-t hover:border-r-0 hover:border-l-0 transition-all duration-300"
                >
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-black/40">
                    <img
                      src={nft.tokenURI}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {isListed && (
                        <div className="bg-emerald-500/20 backdrop-blur border border-emerald-500/30 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                          <Zap size={8} /> LISTED
                        </div>
                      )}
                      {isOwner && (
                        <div className="bg-blue-500/20 backdrop-blur border border-blue-500/30 px-2 py-0.5 rounded text-[8px] font-mono text-blue-400 flex items-center gap-1">
                          <Shield size={8} /> OWNED
                        </div>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur border border-white/20 px-2 py-1 rounded">
                      <p className="text-[10px] font-mono text-white/80">
                        {formatPriceInEth(nft.price)} ETH
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold uppercase tracking-tight truncate">
                          {nft.name}
                        </h3>
                        <p className="text-[8px] font-mono text-white/30 mt-1">
                          #{Number(nft.tokenId)}
                        </p>
                      </div>
                      <Eye
                        size={12}
                        className="text-white/20 group-hover:text-white/60 transition-colors"
                      />
                    </div>

                    <p className="text-[9px] font-mono text-white/40 line-clamp-2 mb-3">
                      {nft.description}
                    </p>

                    <div className="flex justify-between items-center text-[8px] font-mono text-white/30 mb-3">
                      <span>OWNER</span>
                      <span className="text-white/50">
                        {shortAddress(nft.owner)}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        if (!isOwner) {
                          window.open(
                            nft.tokenURI,
                            "_blank",
                            "noopener,noreferrer",
                          );
                          return;
                        }
                        if (isListed) {
                          handleUnlist(nft.tokenId);
                        } else {
                          handleList(nft.tokenId);
                        }
                      }}
                      disabled={isActionLoading}
                      className="w-full py-2 bg-white/5 border border-white/10 text-white text-[9px] font-mono uppercase tracking-wider rounded hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 hover:cursor-pointer"
                    >
                      <Box size={10} />
                      {isActionLoading
                        ? "PROCESSING..."
                        : isOwner
                        ? isListed
                          ? "UNLIST"
                          : "LIST ASSET"
                        : "VIEW DETAILS"}
                    </button>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-lg pointer-events-none transition-all" />
                </MotionDiv>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {displayNFTs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 border border-white/5 rounded-2xl bg-white/2"
          >
            <Database className="text-gray-700 w-12 h-12 mb-4" />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
              NO_ASSETS_FOUND_IN_SECTOR
            </p>
            <p className="text-gray-600 font-mono text-[9px] mt-2">
              Try adjusting your filters or check back later
            </p>
          </motion.div>
        )}
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default MarketPlace;
