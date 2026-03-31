import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  ChevronRight,
  Cpu,
  Search,
  RotateCcw,
  Eye,
  ShoppingCart,
  Shield,
  Zap,
  Box,
  TrendingUp,
  Calendar,
  Hash,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const Sidebar = ({
  isOpen,
  setIsOpen,
  mode,
  selectedNft,
  filters,
  onFiltersChange,
  categoryCounts,
  hasConnectedWallet,
  shortAddress,
  formatPriceInEth,
  isSelectedNftOwner,
  isSelectedNftListed,
  isActionLoading,
  onList,
  onUnlist,
  onBuy,
}) => {
  const [activeTab, setActiveTab] = useState("filters");
  //   const [isAnimating, setIsAnimating] = useState(false);

  const categories = [
    "Cybernetic",
    "Samurai",
    "Wasteland",
    "Neural",
    "Genesis",
  ];
  const sortOptions = [
    { id: "newest", label: "Newest First", icon: Calendar },
    { id: "oldest", label: "Oldest First", icon: Calendar },
    { id: "price_asc", label: "Price: Low to High", icon: TrendingUp },
    { id: "price_desc", label: "Price: High to Low", icon: TrendingUp },
    { id: "name_asc", label: "Name: A to Z", icon: Hash },
  ];

  const MotionDiv = motion.div;
  const MotionAside = motion.aside;

  const updateFilter = (key, value) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category) => {
    onFiltersChange((prev) => {
      const isSelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      minPrice: "",
      maxPrice: "",
      listedOnly: false,
      ownerMode: "all",
      sortBy: "newest",
    });
    setActiveTab("filters");
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.listedOnly) count++;
    if (filters.ownerMode !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    return count;
  };

  const renderDetailsMode = () => {
    if (!selectedNft) {
      return (
        <div className="grow flex flex-col items-center justify-center text-center px-4">
          <Eye className="w-10 h-10 text-white/20 mb-4" />
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
            No asset selected
          </p>
          <p className="text-[9px] font-mono text-white/20 mt-2">
            Click on any NFT to view details
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6 grow overflow-y-auto pr-1 custom-scrollbar pt-20">
        {/* Image Container with Hover Zoom */}
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/40 group">
          <img
            src={selectedNft.tokenURI}
            alt={selectedNft.name}
            className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            {isSelectedNftListed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[8px] font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 inline-flex items-center gap-1 backdrop-blur"
              >
                <Zap className="w-3 h-3" /> LISTED
              </motion.span>
            )}
            {isSelectedNftOwner && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[8px] font-mono px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-400/40 inline-flex items-center gap-1 backdrop-blur"
              >
                <Shield className="w-3 h-3" /> OWNED
              </motion.span>
            )}
          </div>
        </div>

        {/* Asset Info */}
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-xl font-custom italic text-white uppercase tracking-tighter">
            {selectedNft.name}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-[9px] font-mono text-white/40 uppercase">
              Token #{selectedNft.tokenId?.toString?.() || "-"}
            </p>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <p className="text-[9px] font-mono text-white/40 uppercase">
              {selectedNft.isListed ? "Active Listing" : "Not Listed"}
            </p>
          </div>
        </div>

        {/* Price & Owner Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-white/10 bg-white/5 p-3 hover:border-white/20 transition-colors">
            <p className="text-[8px] font-mono text-white/40 uppercase tracking-wider mb-1">
              CURRENT PRICE
            </p>
            <p className="text-lg font-bold text-white">
              {formatPriceInEth(selectedNft.price)}{" "}
              <span className="text-[10px] text-white/60">ETH</span>
            </p>
          </div>
          <div className="rounded border border-white/10 bg-white/5 p-3 hover:border-white/20 transition-colors">
            <p className="text-[8px] font-mono text-white/40 uppercase tracking-wider mb-1">
              OWNER
            </p>
            <p
              className="text-xs font-mono text-white truncate"
              title={selectedNft.owner}
            >
              {shortAddress(selectedNft.owner)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="rounded border border-white/10 bg-white/5 p-3">
          <p className="text-[8px] font-mono text-white/40 uppercase tracking-wider mb-2">
            DESCRIPTION
          </p>
          <p className="text-[10px] text-white/70 leading-relaxed">
            {selectedNft.description ||
              "No description available for this asset."}
          </p>
        </div>

        {/* Previous Owners (if any) */}
        {selectedNft.previousOwners?.length > 0 && (
          <div className="rounded border border-white/10 bg-white/5 p-3">
            <p className="text-[8px] font-mono text-white/40 uppercase tracking-wider mb-2">
              PROVENANCE
            </p>
            <div className="space-y-1">
              {selectedNft.previousOwners.slice(0, 3).map((owner, idx) => (
                <p key={idx} className="text-[8px] font-mono text-white/40">
                  {idx === 0 ? "← " : "   "}
                  {shortAddress(owner)}
                </p>
              ))}
              {selectedNft.previousOwners.length > 3 && (
                <p className="text-[7px] font-mono text-white/30">
                  +{selectedNft.previousOwners.length - 3} more transfers
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {isSelectedNftOwner ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                isSelectedNftListed
                  ? onUnlist(selectedNft.tokenId)
                  : onList(selectedNft.tokenId)
              }
              disabled={isActionLoading}
              className={`w-full py-3 rounded border text-[10px] font-mono uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                isSelectedNftListed
                  ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              } hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isActionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isSelectedNftListed ? (
                <>
                  <X className="w-3.5 h-3.5" /> Unlist Asset
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> List Asset
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onBuy(selectedNft.tokenId, selectedNft.price)}
              disabled={isActionLoading || !isSelectedNftListed}
              className={`w-full py-3 rounded border text-[10px] font-mono uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                isSelectedNftListed
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-400 hover:text-black"
                  : "border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
              } disabled:opacity-50`}
            >
              {isActionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isSelectedNftListed ? (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" /> Purchase Asset
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" /> Not Listed
                </>
              )}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              window.open(selectedNft.tokenURI, "_blank", "noopener,noreferrer")
            }
            className="w-full py-3 rounded border border-white/15 bg-transparent text-white/70 text-[10px] font-mono uppercase tracking-[0.2em] hover:border-white/40 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Box className="w-3.5 h-3.5" /> View Metadata
          </motion.button>
        </div>
      </div>
    );
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* The Sidebar */}
          <MotionAside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[380px] bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] mt-30"
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                {mode === "nftDetails" ? (
                  <Eye className="w-5 h-5 text-white" />
                ) : (
                  <Filter className="w-5 h-5 text-white" />
                )}
                <div>
                  <h2 className="text-xl font-custom italic font-bold text-white uppercase tracking-tighter">
                    {mode === "nftDetails" ? "Asset Details" : "Filters"}
                  </h2>
                  {mode !== "nftDetails" && activeFilterCount > 0 && (
                    <p className="text-[8px] font-mono text-emerald-500/60 mt-0.5">
                      {activeFilterCount} active filter
                      {activeFilterCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Tab Navigation (Filter Mode Only) */}
            {mode !== "nftDetails" && (
              <div className="flex border-b border-white/10 px-6">
                {[
                  { id: "filters", label: "Filters", icon: Filter },
                  { id: "sort", label: "Sort", icon: TrendingUp },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-[10px] font-mono uppercase tracking-wider transition-all relative ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-white/40 hover:text-white/60"
                    }`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeFilterTab"
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {mode === "nftDetails" ? (
                renderDetailsMode()
              ) : activeTab === "filters" ? (
                <div className="space-y-8">
                  {/* Search */}
                  <div>
                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                      <Search size={10} /> Metadata_Query
                    </p>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        placeholder="Search by name, description, owner..."
                        className="w-full bg-white/5 border border-white/10 pl-9 pr-3 py-2.5 rounded text-[11px] text-white outline-none focus:border-white/40 font-mono placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">
                      {"//"} Sector_Class
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
                            filters.categories.includes(cat)
                              ? "bg-white/20 border border-white/40 text-white"
                              : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
                          }`}
                        >
                          {cat}
                          <span className="ml-1 text-[8px] text-white/40">
                            ({categoryCounts?.[cat] ?? 0})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">
                      {"//"} Value_Range (ETH)
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                          updateFilter("minPrice", e.target.value)
                        }
                        placeholder="Min"
                        className="bg-white/5 border border-white/10 p-2.5 rounded text-[10px] text-white outline-none focus:border-white/40 font-mono placeholder:text-white/20"
                      />
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          updateFilter("maxPrice", e.target.value)
                        }
                        placeholder="Max"
                        className="bg-white/5 border border-white/10 p-2.5 rounded text-[10px] text-white outline-none focus:border-white/40 font-mono placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {/* Listing Status & Owner Filter */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2">
                        Status
                      </p>
                      <button
                        onClick={() =>
                          updateFilter("listedOnly", !filters.listedOnly)
                        }
                        className={`w-full px-3 py-2 rounded border text-[10px] font-mono uppercase tracking-wider transition-all ${
                          filters.listedOnly
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                            : "border-white/10 text-white/50 hover:border-white/30"
                        }`}
                      >
                        Listed Only
                      </button>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2">
                        Owner
                      </p>
                      <select
                        value={filters.ownerMode}
                        onChange={(e) =>
                          updateFilter("ownerMode", e.target.value)
                        }
                        className="w-full bg-white/5 border border-white/10 p-2 rounded text-[10px] text-white font-mono"
                        disabled={!hasConnectedWallet}
                      >
                        <option value="all">All</option>
                        <option value="mine">Mine</option>
                        <option value="others">Others</option>
                      </select>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 border border-white/15 px-4 py-2.5 rounded text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white hover:border-white/30 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
                  </button>
                </div>
              ) : (
                /* Sort Options */
                <div className="space-y-2">
                  <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] mb-3">
                    {"//"} Sort_By
                  </p>
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateFilter("sortBy", option.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded border transition-all ${
                        filters.sortBy === option.id
                          ? "border-white/40 bg-white/10 text-white"
                          : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-2">
                        <option.icon size={12} />
                        {option.label}
                      </span>
                      {filters.sortBy === option.id && (
                        <CheckCircle size={12} className="text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Status */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500/60" />
                  <span className="text-[7px] font-mono text-white/30 uppercase tracking-wider">
                    TERMINAL_SYNC: ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[6px] font-mono text-white/20">
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </MotionAside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
