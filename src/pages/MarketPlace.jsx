import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketPlace } from "../contexts/useMarketPlace";
import { useActiveAccount } from "thirdweb/react";
import { Box, Zap, Database, Filter } from "lucide-react";
import FilterSidebar from "../components/Sidebar";

function MarketPlace() {
  const { marketData, fetchAllNFTs, listNFT, delistNFT } = useMarketPlace();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [actionLoadingTokenId, setActionLoadingTokenId] = useState(null);
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

  console.log("Market Data:", marketData);

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      {/* Background Star Overlay (Keep the theme consistent) */}
      <span className="text-[600px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.05)] font-bold pointer-events-none">
        ★
      </span>

      <FilterSidebar isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="border-l-2 border-white pl-5 sm:pl-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-custom font-bold text-white uppercase tracking-tighter italic">
            Asset <span className="text-gray-500">Inventory</span>
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-[0.3em]">
            Listing_Protocol: 0.1.4 // Found {nfts.length} Records
          </p>
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="self-start md:self-auto flex items-center gap-2 border-l border-r border-white/20 px-6 py-2 text-xs font-bold text-white uppercase hover:bg-white/5 transition-all"
        >
          <Filter className="w-4 h-4" /> Open_Filters
        </button>
      </div>

      {/* NFT Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {nfts.map((nft, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white/5 backdrop-blur-md border-l border-r border-white/20 rounded-xl overflow-hidden shadow-2xl hover:border-white transition-all duration-500"
            >
              {(() => {
                const tokenIdStr = nft.tokenId?.toString?.() || "";
                const isOwner =
                  !!connectedAddress &&
                  nft.owner?.toLowerCase?.() === connectedAddress;
                const isListed = Boolean(nft.isListed);
                const isActionLoading = actionLoadingTokenId === tokenIdStr;

                return (
                  <>
                    {/* NFT Image Container */}
                    <div className="relative h-72 overflow-hidden bg-black/40">
                      <img
                        src={nft.tokenURI}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                        <Zap className="w-3 h-3 text-white" />
                        <span className="text-[10px] text-white font-bold uppercase">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* NFT Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-custom font-bold text-white uppercase tracking-tight">
                            {nft.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">
                            ID: {Number(nft.tokenId)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase font-bold">
                            Price
                          </p>
                          <p className="text-lg font-custom text-white italic">
                            {formatPriceInEth(nft.price)} ETH
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-400 text-xs font-mono leading-relaxed mb-6 h-12 overflow-hidden">
                        {nft.description}
                      </p>

                      {/* Card Action */}
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
                        className="w-full py-3 bg-white/5 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-lg group-hover:bg-white group-hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Box className="w-4 h-4" />
                        {isActionLoading
                          ? "Processing..."
                          : isOwner
                          ? isListed
                            ? "Unlist Asset"
                            : "List Asset"
                          : "View Details"}
                      </button>
                    </div>

                    {/* Scanning Glow (Hover) */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 pointer-events-none transition-all" />
                  </>
                );
              })()}
            </MotionDiv>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {nfts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 border border-white/5 rounded-3xl bg-white/2">
          <Database className="text-gray-700 w-16 h-16 mb-4 animate-pulse" />
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
            Database_Empty: No Assets Found in Sector
          </p>
        </div>
      )}
    </div>
  );
}

export default MarketPlace;
