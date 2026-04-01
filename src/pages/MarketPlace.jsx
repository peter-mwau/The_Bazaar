import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Layers,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

function MarketPlace() {
  const { marketData, fetchAllNFTs, listNFT, delistNFT, buyNFT } =
    useMarketPlace();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState("filters");
  const [selectedNft, setSelectedNft] = useState(null);
  const [actionLoadingTokenId, setActionLoadingTokenId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [scratchedTexture, setScratchedTexture] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    minPrice: "",
    maxPrice: "",
    listedOnly: false,
    ownerMode: "all",
  });
  const scrollContainerRef = useRef(null);
  const account = useActiveAccount();
  const connectedAddress = account?.address?.toLowerCase();
  const MotionDiv = motion.div;

  // Generate scratched texture for cards
  useEffect(() => {
    const generateScratchedTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add scratches
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

      return canvas.toDataURL();
    };

    setScratchedTexture(generateScratchedTexture());
  }, []);

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

  const parseEthToWei = (ethValue) => {
    try {
      if (ethValue === "" || ethValue === null || ethValue === undefined) {
        return null;
      }

      const normalized = String(ethValue).trim();
      if (!normalized) return null;

      const [wholePart, fracPart = ""] = normalized.split(".");
      if (!/^\d+$/.test(wholePart || "0") || !/^\d*$/.test(fracPart)) {
        return null;
      }

      const whole = BigInt(wholePart || "0");
      const frac = BigInt((fracPart + "0".repeat(18)).slice(0, 18));
      return whole * 10n ** 18n + frac;
    } catch {
      return null;
    }
  };

  const getSectorClass = (nft) => {
    const text = `${nft?.name || ""} ${nft?.description || ""}`.toLowerCase();

    if (/samurai|katana|ronin|shogun|warrior/.test(text)) return "Samurai";
    if (/neural|synapse|mind|brain|network/.test(text)) return "Neural";
    if (/wasteland|desert|ruin|dystopia|post-apocalyptic/.test(text)) {
      return "Wasteland";
    }
    if (/cyber|neon|circuit|robot|ai|futur/.test(text)) return "Cybernetic";

    return "Unclassified";
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

  const handleBuy = async (tokenId, price) => {
    try {
      setActionLoadingTokenId(tokenId.toString());
      await buyNFT(tokenId, price);
      await fetchAllNFTs();
    } finally {
      setActionLoadingTokenId(null);
    }
  };

  const openFilterSidebar = () => {
    setSidebarMode("filters");
    setIsFilterOpen(true);
  };

  const openNftDetailsSidebar = (nft) => {
    setSelectedNft(nft);
    setSidebarMode("nftDetails");
    setIsFilterOpen(true);
  };

  const nfts = useMemo(() => marketData?.allNFTs || [], [marketData?.allNFTs]);
  const listedNFTs = nfts.filter((nft) => nft.isListed);
  const ownedNFTs = nfts.filter(
    (nft) => nft.owner?.toLowerCase?.() === connectedAddress,
  );

  const baseNFTs =
    selectedTab === "all"
      ? nfts
      : selectedTab === "listed"
      ? listedNFTs
      : ownedNFTs;

  const categoryCounts = useMemo(() => {
    const counts = {
      Cybernetic: 0,
      Samurai: 0,
      Wasteland: 0,
      Neural: 0,
      Unclassified: 0,
    };

    nfts.forEach((nft) => {
      const sector = getSectorClass(nft);
      counts[sector] = (counts[sector] || 0) + 1;
    });

    return counts;
  }, [nfts]);

  const displayNFTs = useMemo(() => {
    const searchText = filters.search.trim().toLowerCase();
    const minWei = parseEthToWei(filters.minPrice);
    const maxWei = parseEthToWei(filters.maxPrice);

    return baseNFTs.filter((nft) => {
      const nftText = `${nft.name || ""} ${nft.description || ""} ${
        nft.owner || ""
      } ${nft.tokenId?.toString?.() || ""}`.toLowerCase();

      const searchPass = searchText ? nftText.includes(searchText) : true;
      const nftSector = getSectorClass(nft);
      const categoryPass =
        filters.categories.length === 0 ||
        filters.categories.includes(nftSector);

      const priceWei = BigInt(nft.price ?? 0);
      const minPass = minWei === null ? true : priceWei >= minWei;
      const maxPass = maxWei === null ? true : priceWei <= maxWei;
      const listedPass = filters.listedOnly ? Boolean(nft.isListed) : true;
      const nftOwner = nft.owner?.toLowerCase?.();
      const ownerPass =
        filters.ownerMode === "mine"
          ? !!connectedAddress && nftOwner === connectedAddress
          : filters.ownerMode === "others"
          ? !connectedAddress || nftOwner !== connectedAddress
          : true;

      return (
        searchPass &&
        categoryPass &&
        minPass &&
        maxPass &&
        listedPass &&
        ownerPass
      );
    });
  }, [baseNFTs, filters, connectedAddress]);

  const featuredListedNFTs = displayNFTs.filter((nft) => nft.isListed);

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

  // Custom clip path for vintage card shape
  const vintageClipPath =
    "polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%, 0% 50%, 1% 2%)";

  return (
    <div className="bg-black min-h-screen pt-24 pb-20 relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.02)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <Sidebar
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        mode={sidebarMode}
        selectedNft={selectedNft}
        filters={filters}
        onFiltersChange={setFilters}
        categoryCounts={categoryCounts}
        hasConnectedWallet={Boolean(connectedAddress)}
        shortAddress={shortAddress}
        formatPriceInEth={formatPriceInEth}
        isSelectedNftOwner={
          !!connectedAddress &&
          selectedNft?.owner?.toLowerCase?.() === connectedAddress
        }
        isSelectedNftListed={Boolean(selectedNft?.isListed)}
        isActionLoading={
          actionLoadingTokenId === (selectedNft?.tokenId?.toString?.() || "")
        }
        onList={handleList}
        onUnlist={handleUnlist}
        onBuy={handleBuy}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="border-l-2 border-white/20 pl-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-4 bg-emerald-500/60" />
              <p className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-[0.4em]">
                // BAZAAR_MARKETPLACE
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tighter">
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
              onClick={openFilterSidebar}
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
                  className="absolute bottom-0 left-0 right-0 h-px bg-white"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* HORIZONTAL SCROLL SECTION - FEATURED LISTED NFTS */}
        {featuredListedNFTs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-emerald-500/60" />
                <h2 className="text-sm font-mono text-white uppercase tracking-widest">
                  FEATURED_LISTINGS
                </h2>
                <div className="flex items-center gap-1">
                  <Sparkles size={10} className="text-emerald-500/60" />
                  <span className="text-[8px] text-emerald-500/40">
                    LIVE_AUCTION
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="p-1.5 border border-white/20 hover:border-white/40 transition-all rounded hover:bg-white/5"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-1.5 border border-white/20 hover:border-white/40 transition-all rounded hover:bg-white/5"
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
              {featuredListedNFTs.slice(0, 10).map((nft, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => openNftDetailsSidebar(nft)}
                  whileHover={{ y: -5 }}
                  className="flex-none w-64 group cursor-pointer"
                >
                  <div className="relative w-full h-[320px]">
                    {/* Vintage Card Background */}
                    <div
                      className="absolute inset-0 bg-black"
                      style={{
                        clipPath: vintageClipPath,
                        background: scratchedTexture
                          ? `url(${scratchedTexture})`
                          : "#0a0a0a",
                        backgroundSize: "cover",
                      }}
                    />

                    {/* Border Effect */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        clipPath: vintageClipPath,
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    />

                    {/* Content */}
                    <div
                      className="relative h-full w-full flex flex-col p-3"
                      style={{ clipPath: vintageClipPath }}
                    >
                      <div className="flex-grow overflow-hidden relative">
                        <img
                          src={nft.tokenURI}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                          alt={nft.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-[8px] font-mono text-white/40 uppercase tracking-wider">
                          ASSET #{nft.tokenId?.toString?.()?.slice(0, 6)}
                        </p>
                        <p className="text-[10px] font-mono font-bold uppercase text-white/80 truncate">
                          {nft.name}
                        </p>
                        <div className="flex justify-between items-center border-t border-white/10 pt-1">
                          <span className="text-[7px] font-mono text-white/40">
                            PRICE
                          </span>
                          <span className="text-[9px] font-bold text-white/90">
                            {formatPriceInEth(nft.price)} ETH
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Corner Decorations */}
                    <div className="absolute -top-0.5 -left-0.5 w-3 h-3">
                      <div className="absolute top-0 left-0 w-2 h-px bg-white/30" />
                      <div className="absolute top-0 left-0 w-px h-2 bg-white/30" />
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                  onClick={() => openNftDetailsSidebar(nft)}
                >
                  <div className="relative w-full aspect-[3/4]">
                    {/* Vintage Card Background */}
                    <div
                      className="absolute inset-0 bg-black transition-all duration-300 group-hover:shadow-2xl"
                      style={{
                        clipPath: vintageClipPath,
                        background: scratchedTexture
                          ? `url(${scratchedTexture})`
                          : "#0a0a0a",
                        backgroundSize: "cover",
                        boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
                      }}
                    />

                    {/* Border with worn effect */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-all duration-300 group-hover:border-white/30"
                      style={{
                        clipPath: vintageClipPath,
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    />

                    {/* Content Container */}
                    <div
                      className="relative h-full w-full flex flex-col p-4 text-white"
                      style={{ clipPath: vintageClipPath }}
                    >
                      {/* Image Container */}
                      <div className="flex-grow overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                        <img
                          src={nft.tokenURI}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                          alt={nft.name}
                        />

                        {/* Status Badges */}
                        <div className="absolute top-2 left-2 z-20 flex gap-1">
                          {isListed && (
                            <div className="bg-emerald-500/20 backdrop-blur border border-emerald-500/30 px-1.5 py-0.5 rounded text-[7px] font-mono text-emerald-400 flex items-center gap-0.5">
                              <Zap size={6} /> LISTED
                            </div>
                          )}
                          {isOwner && (
                            <div className="bg-blue-500/20 backdrop-blur border border-blue-500/30 px-1.5 py-0.5 rounded text-[7px] font-mono text-blue-400 flex items-center gap-0.5">
                              <Shield size={6} /> OWNED
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="mt-3 space-y-1.5 relative">
                        {/* Asset ID */}
                        <p className="text-[7px] font-mono text-white/40 tracking-widest uppercase">
                          ASSET #
                          {nft.tokenId?.toString?.()?.slice(0, 6) || "----"}
                        </p>

                        {/* Asset Name */}
                        <p className="text-[11px] font-mono font-bold uppercase tracking-tighter text-white/80 line-clamp-1">
                          {nft.name.length > 20
                            ? nft.name.slice(0, 18) + "..."
                            : nft.name}
                        </p>

                        {/* Price Section */}
                        <div className="flex justify-between items-center border-t border-white/10 pt-1.5">
                          <span className="text-[7px] font-mono text-white/40 tracking-wider">
                            ₿ PRICE
                          </span>
                          <span className="text-[10px] font-bold tracking-tight text-white/90">
                            {formatPriceInEth(nft.price)} ETH
                          </span>
                        </div>

                        {/* Owner Info */}
                        <div className="flex justify-between items-center">
                          <span className="text-[6px] font-mono text-white/30">
                            OWNER
                          </span>
                          <span className="font-mono text-white/50 text-[6px]">
                            {shortAddress(nft.owner)}
                          </span>
                        </div>

                        {/* Vintage Stamp Mark */}
                        <div className="absolute -bottom-1 -right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              stroke="white"
                              strokeWidth="0.5"
                            />
                            <path
                              d="M10 5 L10 15 M5 10 L15 10"
                              stroke="white"
                              strokeWidth="0.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Corner Decorations */}
                    <div className="absolute -top-0.5 -left-0.5 w-4 h-4">
                      <div className="absolute top-0 left-0 w-2.5 h-px bg-white/20 group-hover:bg-white/40 transition-colors" />
                      <div className="absolute top-0 left-0 w-px h-2.5 bg-white/20 group-hover:bg-white/40 transition-colors" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4">
                      <div className="absolute top-0 right-0 w-2.5 h-px bg-white/20 group-hover:bg-white/40 transition-colors" />
                      <div className="absolute top-0 right-0 w-px h-2.5 bg-white/20 group-hover:bg-white/40 transition-colors" />
                    </div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4">
                      <div className="absolute bottom-0 left-0 w-2.5 h-px bg-white/20 group-hover:bg-white/40 transition-colors" />
                      <div className="absolute bottom-0 left-0 w-px h-2.5 bg-white/20 group-hover:bg-white/40 transition-colors" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4">
                      <div className="absolute bottom-0 right-0 w-2.5 h-px bg-white/20 group-hover:bg-white/40 transition-colors" />
                      <div className="absolute bottom-0 right-0 w-px h-2.5 bg-white/20 group-hover:bg-white/40 transition-colors" />
                    </div>

                    {/* Action Button Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOwner && !isListed) {
                            openNftDetailsSidebar(nft);
                            return;
                          }
                          if (isOwner && isListed) {
                            handleUnlist(nft.tokenId);
                          } else if (isOwner && !isListed) {
                            handleList(nft.tokenId);
                          } else if (!isOwner && isListed) {
                            openNftDetailsSidebar(nft);
                          } else {
                            openNftDetailsSidebar(nft);
                          }
                        }}
                        disabled={isActionLoading}
                        className="w-full py-2 bg-black/80 backdrop-blur border border-white/20 text-white text-[8px] font-mono uppercase tracking-wider rounded hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <Box size={8} />
                        {isActionLoading
                          ? "PROCESSING..."
                          : isOwner
                          ? isListed
                            ? "UNLIST"
                            : "LIST ASSET"
                          : isListed
                          ? "PURCHASE"
                          : "VIEW DETAILS"}
                      </button>
                    </div>
                  </div>
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
            style={{ clipPath: vintageClipPath }}
          >
            <Layers className="text-gray-700 w-12 h-12 mb-4" />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
              NO_ASSETS_FOUND
            </p>
            <p className="text-gray-600 font-mono text-[9px] mt-2">
              Try adjusting your filters or check back later
            </p>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default MarketPlace;
