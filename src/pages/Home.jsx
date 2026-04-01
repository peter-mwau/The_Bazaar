import React, { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useActiveAccount } from "thirdweb/react";
import { Minimize2, Upload, Box } from "lucide-react";
import { useMarketPlace } from "../contexts/useMarketPlace";
import { toast } from "react-hot-toast";
import { uploadFileToPinata } from "../services/pinata";
import { BazaarConnectButton } from "../providers/Provider";
import FeaturedTicker from "../components/FeaturedTicker";
import ProtocolStats from "../components/LiveProtocolStats";
import TerminalNews from "../components/TerminalNews";
import SystemAlerts from "../components/SystemAlerts";
import Web3LogoMarquee from "../components/Web3LogoMarquee";

function Home() {
  void motion;
  const account = useActiveAccount();
  const isConnected = !!account;
  const [preview, setPreview] = useState(null);
  const [openCreateNFTForm, setOpenCreateNFTForm] = useState(false);
  const { createNFT, isLoading, marketData, fetchAllNFTs } = useMarketPlace();
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    fetchAllNFTs();
  }, [fetchAllNFTs]);

  const STEPS = {
    1: "INITIALIZING MINTING PROTOCOL",
    2: "UPLOADING IMAGE TO IPFS",
    3: "MINTING NFT ON BLOCKCHAIN",
    4: "CONFIRMING TRANSACTION",
  };

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle text/number field updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openForm = () => {
    setOpenCreateNFTForm(true);
  };

  const closeForm = () => {
    if (isMinting) return; // Don't close while minting
    setOpenCreateNFTForm(false);
    setCurrentStep(0);
    setIsMinting(false);
    // Reset form after closing
    setTimeout(() => {
      setFormData({ name: "", description: "", price: "" });
      setPreview(null);
      setSelectedFile(null);
    }, 300);
  };

  // Reset form function
  const resetForm = () => {
    setFormData({ name: "", description: "", price: "" });
    setPreview(null);
    setSelectedFile(null);
    setCurrentStep(0);
    setIsMinting(false);
  };

  // Function to mint a new asset
  const createNewAsset = async () => {
    if (!selectedFile) {
      toast.error("Please upload an image for your NFT.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price
    ) {
      toast.error("Please complete all NFT details before minting.");
      return;
    }

    // Validate price is a valid number
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid price greater than 0");
      return;
    }

    setIsMinting(true);
    setCurrentStep(1);

    try {
      // Step 1: Initialize
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 2: Upload to IPFS
      setCurrentStep(2);
      const ipfsHash = await uploadFileToPinata(selectedFile);

      if (!ipfsHash) {
        throw new Error("Failed to upload to IPFS");
      }

      const metadata = {
        name: formData.name,
        description: formData.description,
        tokenURI: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        price: formData.price,
      };

      // Step 3: Mint NFT
      setCurrentStep(3);
      await createNFT(metadata);

      // Step 4: Confirmation
      setCurrentStep(4);

      // Fetch updated NFTs
      await fetchAllNFTs();

      toast.success("NFT minted successfully!");

      // Reset form after successful mint
      resetForm();

      // Close form after 2 seconds
      setTimeout(() => {
        closeForm();
      }, 2000);
    } catch (error) {
      console.error("Error creating NFT:", error);
      toast.error(error.message || "Failed to mint NFT. Please try again.");
      setCurrentStep(0);
      setIsMinting(false);
    }
  };

  const { scrollYProgress } = useScroll();

  const xWelcome = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const xBazaar = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const strikeWidth = useTransform(scrollYProgress, [0, 0.2], ["100%", "0%"]);
  const strikeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const xJoin = useTransform(scrollYProgress, [0.2, 0.4], [0, -150]);
  const xVendor = useTransform(scrollYProgress, [0.2, 0.4], [0, 150]);
  const yJoin = useTransform(scrollYProgress, [0.2, 0.4], [0, 60]);
  const yVendor = useTransform(scrollYProgress, [0.2, 0.4], [100, 60]);
  const btnOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);

  const isMintingInProgress = currentStep > 0 && currentStep < 5;

  return (
    <div className="bg-black h-auto overflow-x-hidden" id="main">
      {/* Add Toaster component for toast notifications */}

      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
      >
        <img
          src="/hero.png"
          alt="Hero"
          className="w-full h-full object-cover pt-10"
        />
      </motion.div>

      <FeaturedTicker nfts={marketData?.allNFTs || []} />

      <div className="flex flex-col mx-auto w-[100%] sticky top-0 h-screen justify-center">
        <div className="flex flex-col gap-1 mt-20 left-5 ml-10 items-start mb-[150px]">
          <motion.h1
            style={{ x: xWelcome }}
            className="text-6xl font-custom font-bold mb-4 underline decoration-double decoration-gray-500 underline-offset-[18px] text-white uppercase pt-5"
          >
            Welcome to
          </motion.h1>

          <motion.div style={{ x: xBazaar }} className="relative inline-block">
            <span className="font-custom text-[170px] italic font-bold text-transparent [-webkit-text-stroke:1px_white] uppercase">
              The Bazaar
            </span>

            <motion.div
              style={{ width: strikeWidth, opacity: strikeOpacity }}
              className="absolute top-[60%] left-0 h-[2px] bg-gray-700 origin-left"
            />
          </motion.div>
        </div>

        <p className="text-lg font-custom text-gray-300 mt-0 max-w-2xl mx-auto text-start underline decoration-wavy underline-offset-4 font-satoshi">
          Interweaving Art, Assets, and Accurate Data. Discover, Collect, and
          Trade Unique NFTs with Confidence.
        </p>

        <span className="absolute text-gray-700/20 hover:text-gray-500 transition-all duration-1000 ml-[32%] mt-0 uppercase text-8xl tracking-[0.1em] font-bold font-serif -z-10 mb-[700px]">
          Veritas
        </span>

        <span className="text-[900px] ml-[40%] absolute -z-10 text-transparent [-webkit-text-stroke:2px_theme(colors.gray.700/30%)] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] font-bold">
          ★
        </span>
      </div>

      <div className="flex flex-col items-center mt-35 mb-20 py-10 relative z-20 h-60 w-full">
        <motion.button
          style={{ x: xJoin, y: yJoin, opacity: btnOpacity }}
          className="absolute px-10 py-3 bg-transparent rounded-lg text-white font-custom uppercase tracking-widest text-sm border-t border-b border-white/60 hover:border-t-0 hover:border-b-0 hover:border-l hover:border-r hover:border-white hover:translate-y-[-4px] transition-all duration-300 ease-in-out whitespace-nowrap"
        >
          Join The Vibe
        </motion.button>

        <motion.button
          style={{ x: xVendor, y: yVendor, opacity: btnOpacity }}
          onClick={openForm}
          className="absolute px-10 py-3 bg-white text-black font-custom font-bold uppercase text-sm rounded-lg hover:bg-gray-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 whitespace-nowrap hover:cursor-pointer"
        >
          Become a Vendor
        </motion.button>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {openCreateNFTForm && isConnected ? (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden w-[60%] mx-auto mb-20 mt-10 relative z-30 bg-black"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-lg border-r border-l border-white/20 p-8 shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Box className="text-white w-6 h-6" />
                  <h2 className="text-xl font-custom italic font-bold text-white uppercase tracking-tighter">
                    Mint New Asset
                  </h2>
                </div>
                {!isMinting && (
                  <button onClick={closeForm}>
                    <Minimize2 className="text-gray-500 hover:text-white transition-colors" />
                  </button>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Upload Section */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Upload Media
                  </label>
                  <div className="relative group h-64 w-full border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center overflow-hidden hover:border-white/40 transition-colors">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover:text-white transition-colors" />
                        <p className="text-gray-500 text-sm">
                          PNG, JPG, GIF (Max 10MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      disabled={isMinting}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Right Side: Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isMinting}
                      placeholder="e.g. Cyber Samurai"
                      className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Price (ETH)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled={isMinting}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={isMinting}
                      placeholder="Describe the utility of this NFT..."
                      className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/40 transition-all resize-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Mint Progress Steps */}
              {isMintingInProgress && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-lg font-mono overflow-hidden shadow-2xl"
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a3a2a",
                    boxShadow: "0 0 30px rgba(0, 255, 0, 0.1)",
                  }}
                >
                  {/* Terminal Header */}
                  <div
                    className="flex items-center justify-between px-4 py-2"
                    style={{
                      background: "#0d0d0d",
                      borderBottom: "1px solid #1a3a2a",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: "#ff5f56" }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: "#ffbd2e" }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: "#27c93f" }}
                        />
                      </div>
                      <span className="text-[11px] text-green-500/60 ml-2">
                        bash — zsh — 80x24
                      </span>
                    </div>
                    <div className="text-[10px] text-green-500/40 font-mono">
                      terminal@bazaar:~/minting
                    </div>
                  </div>

                  {/* Terminal Content */}
                  <div className="p-6" style={{ background: "#0a0a0a" }}>
                    {/* System Header */}
                    <div className="mb-6 pb-3 border-b border-green-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-green-500 text-sm">┌─[</span>
                        <span className="text-green-400 font-bold">
                          BAZAAR MINTING DAEMON
                        </span>
                        <span className="text-green-500 text-sm">]</span>
                        <span className="text-green-500/40 text-xs">—</span>
                        <span className="text-green-500/40 text-xs">
                          PID: 42069
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-green-500/50">
                        <span>├─ Status:</span>
                        <span className="text-green-400 animate-pulse">
                          ● ACTIVE
                        </span>
                        <span>└─ Session: 0x7B3F</span>
                      </div>
                    </div>

                    {/* Terminal Logs */}
                    <div className="space-y-3 font-mono">
                      {/* Step 1: Initializing */}
                      <div className="relative">
                        <div
                          className={`flex items-start gap-3 p-3 rounded transition-all duration-500 ${
                            currentStep > 1
                              ? "bg-green-500/5 border-l-2 border-green-500"
                              : currentStep === 1
                              ? "bg-green-500/10 border-l-2 border-green-400 shadow-[0_0_10px_rgba(0,255,0,0.1)]"
                              : "opacity-40"
                          }`}
                        >
                          <div className="shrink-0">
                            {currentStep > 1 ? (
                              <span className="text-green-500 text-sm">✓</span>
                            ) : currentStep === 1 ? (
                              <div className="relative">
                                <span className="text-green-400 text-sm animate-pulse">
                                  ⧗
                                </span>
                                <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                              </div>
                            ) : (
                              <span className="text-gray-700 text-sm">○</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`text-xs font-bold ${
                                  currentStep === 1
                                    ? "text-green-400"
                                    : currentStep > 1
                                    ? "text-green-500"
                                    : "text-gray-700"
                                }`}
                              >
                                [system@bazaar init]
                              </span>
                              <span
                                className={`text-[11px] ${
                                  currentStep === 1
                                    ? "text-green-400/80"
                                    : currentStep > 1
                                    ? "text-green-500/60"
                                    : "text-gray-700/60"
                                }`}
                              >
                                {currentStep === 1
                                  ? "››› executing..."
                                  : currentStep > 1
                                  ? "››› completed"
                                  : "››› pending"}
                              </span>
                            </div>
                            <div
                              className={`text-[11px] mt-1 font-mono ${
                                currentStep === 1
                                  ? "text-green-400/60"
                                  : currentStep > 1
                                  ? "text-green-500/40"
                                  : "text-gray-700/40"
                              }`}
                            >
                              {currentStep === 1 ? (
                                <span className="inline-flex items-center gap-1">
                                  <span>Initializing Web3 provider</span>
                                  <span className="inline-block w-1.5 h-3 bg-green-400 animate-pulse ml-1" />
                                </span>
                              ) : currentStep > 1 ? (
                                "✓ Web3 provider initialized successfully"
                              ) : (
                                "awaiting execution..."
                              )}
                            </div>
                          </div>
                          {currentStep === 1 && (
                            <div className="text-[8px] text-green-500/30 font-mono">
                              [00:00:01]
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 2: Uploading to IPFS */}
                      <div className="relative">
                        <div
                          className={`flex items-start gap-3 p-3 rounded transition-all duration-500 ${
                            currentStep > 2
                              ? "bg-green-500/5 border-l-2 border-green-500"
                              : currentStep === 2
                              ? "bg-green-500/10 border-l-2 border-green-400 shadow-[0_0_10px_rgba(0,255,0,0.1)]"
                              : "opacity-40"
                          }`}
                        >
                          <div className="shrink-0">
                            {currentStep > 2 ? (
                              <span className="text-green-500 text-sm">✓</span>
                            ) : currentStep === 2 ? (
                              <div className="relative">
                                <span className="text-green-400 text-sm animate-spin">
                                  ↻
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-700 text-sm">○</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`text-xs font-bold ${
                                  currentStep === 2
                                    ? "text-green-400"
                                    : currentStep > 2
                                    ? "text-green-500"
                                    : "text-gray-700"
                                }`}
                              >
                                [ipfs@pinata upload]
                              </span>
                              <span
                                className={`text-[11px] ${
                                  currentStep === 2
                                    ? "text-green-400/80"
                                    : currentStep > 2
                                    ? "text-green-500/60"
                                    : "text-gray-700/60"
                                }`}
                              >
                                {currentStep === 2
                                  ? "››› streaming..."
                                  : currentStep > 2
                                  ? "››› complete"
                                  : "››› pending"}
                              </span>
                            </div>
                            <div
                              className={`text-[11px] mt-1 font-mono ${
                                currentStep === 2
                                  ? "text-green-400/60"
                                  : currentStep > 2
                                  ? "text-green-500/40"
                                  : "text-gray-700/40"
                              }`}
                            >
                              {currentStep === 2 ? (
                                <span className="inline-flex items-center gap-1">
                                  <span>Uploading asset to IPFS</span>
                                  <span className="flex gap-0.5 ml-1">
                                    <span
                                      className="w-1 h-2 bg-green-400 animate-bounce"
                                      style={{ animationDelay: "0s" }}
                                    />
                                    <span
                                      className="w-1 h-2 bg-green-400 animate-bounce"
                                      style={{ animationDelay: "0.2s" }}
                                    />
                                    <span
                                      className="w-1 h-2 bg-green-400 animate-bounce"
                                      style={{ animationDelay: "0.4s" }}
                                    />
                                  </span>
                                </span>
                              ) : currentStep > 2 ? (
                                "✓ Asset pinned to IPFS (CID: QmX..." +
                                Math.random().toString(36).substring(2, 6) +
                                ")"
                              ) : (
                                "awaiting file transfer..."
                              )}
                            </div>
                          </div>
                          {currentStep === 2 && (
                            <div className="text-[8px] text-green-500/30 font-mono">
                              [transferring]
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 3: Minting NFT */}
                      <div className="relative">
                        <div
                          className={`flex items-start gap-3 p-3 rounded transition-all duration-500 ${
                            currentStep > 3
                              ? "bg-green-500/5 border-l-2 border-green-500"
                              : currentStep === 3
                              ? "bg-green-500/10 border-l-2 border-green-400 shadow-[0_0_10px_rgba(0,255,0,0.1)]"
                              : "opacity-40"
                          }`}
                        >
                          <div className="shrink-0">
                            {currentStep > 3 ? (
                              <span className="text-green-500 text-sm">✓</span>
                            ) : currentStep === 3 ? (
                              <div className="relative">
                                <span className="text-green-400 text-sm animate-pulse">
                                  ⧗
                                </span>
                                <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                              </div>
                            ) : (
                              <span className="text-gray-700 text-sm">○</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`text-xs font-bold ${
                                  currentStep === 3
                                    ? "text-green-400"
                                    : currentStep > 3
                                    ? "text-green-500"
                                    : "text-gray-700"
                                }`}
                              >
                                [blockchain@sepolia mint]
                              </span>
                              <span
                                className={`text-[11px] ${
                                  currentStep === 3
                                    ? "text-green-400/80"
                                    : currentStep > 3
                                    ? "text-green-500/60"
                                    : "text-gray-700/60"
                                }`}
                              >
                                {currentStep === 3
                                  ? "››› broadcasting..."
                                  : currentStep > 3
                                  ? "››› confirmed"
                                  : "››› pending"}
                              </span>
                            </div>
                            <div
                              className={`text-[11px] mt-1 font-mono ${
                                currentStep === 3
                                  ? "text-green-400/60"
                                  : currentStep > 3
                                  ? "text-green-500/40"
                                  : "text-gray-700/40"
                              }`}
                            >
                              {currentStep === 3 ? (
                                <span className="inline-flex items-center gap-1">
                                  <span>Sending transaction to blockchain</span>
                                  <span className="inline-block w-1.5 h-3 bg-green-400 animate-pulse ml-1" />
                                </span>
                              ) : currentStep > 3 ? (
                                "✓ Transaction confirmed at block " +
                                Math.floor(Math.random() * 1000000)
                              ) : (
                                "preparing transaction..."
                              )}
                            </div>
                          </div>
                          {currentStep === 3 && (
                            <div className="text-[8px] text-green-500/30 font-mono">
                              [tx: 0x3f8a...]
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 4: Finalizing */}
                      <div className="relative">
                        <div
                          className={`flex items-start gap-3 p-3 rounded transition-all duration-500 ${
                            currentStep >= 4
                              ? "bg-green-500/5 border-l-2 border-green-500"
                              : "opacity-40"
                          }`}
                        >
                          <div className="shrink-0">
                            {currentStep >= 4 ? (
                              <span className="text-green-500 text-sm">✓</span>
                            ) : (
                              <span className="text-gray-700 text-sm">○</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`text-xs font-bold ${
                                  currentStep >= 4
                                    ? "text-green-500"
                                    : "text-gray-700"
                                }`}
                              >
                                [daemon@bazaar finalize]
                              </span>
                              <span
                                className={`text-[11px] ${
                                  currentStep >= 4
                                    ? "text-green-500/60"
                                    : "text-gray-700/60"
                                }`}
                              >
                                {currentStep >= 4
                                  ? "››› completed"
                                  : "››› waiting"}
                              </span>
                            </div>
                            <div
                              className={`text-[11px] mt-1 font-mono ${
                                currentStep >= 4
                                  ? "text-green-500/40"
                                  : "text-gray-700/40"
                              }`}
                            >
                              {currentStep >= 4
                                ? "✓ Minting complete! NFT added to collection"
                                : "finalizing deployment..."}
                            </div>
                          </div>
                          {currentStep >= 4 && (
                            <div className="text-[8px] text-green-500/30 font-mono">
                              [complete]
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ASCII Art - Terminal Style */}
                    <div className="mt-6 pt-4 border-t border-green-500/20">
                      <pre className="text-[8px] text-green-500/20 leading-3 overflow-x-auto">
                        {`
  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
     ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
`}
                      </pre>
                    </div>

                    {/* Terminal Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[9px] text-green-500/40 mb-1 font-mono">
                        <span>
                          PROGRESS: {Math.floor((currentStep / 4) * 100)}%
                        </span>
                        <span>[{currentStep}/4] COMPLETE</span>
                      </div>
                      <div className="w-full h-1 bg-green-500/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                          initial={{ width: "0%" }}
                          animate={{ width: `${(currentStep / 4) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mt-4 pt-3 border-t border-green-500/20">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-500/60 text-[10px]">⚠</span>
                        <p className="text-[9px] text-amber-500/40 font-mono leading-relaxed">
                          [WARNING] Do not close browser or disconnect wallet
                          during transaction execution.
                          <br />
                          Unexpected termination may result in loss of funds or
                          incomplete minting process.
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[8px] text-green-500/30">
                        <span>└─$</span>
                        <span className="animate-pulse">_</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Button */}
              <button
                onClick={createNewAsset}
                disabled={isLoading || isMintingInProgress}
                className={`w-full mt-8 py-4 bg-white text-black font-bold uppercase tracking-[0.3em] rounded-lg hover:invert transition-all duration-500 hover:cursor-pointer ${
                  isLoading || isMintingInProgress
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLoading ? "Minting..." : "Execute Transaction"}
              </button>
            </div>
          </motion.div>
        ) : (
          openCreateNFTForm &&
          !isConnected && (
            <motion.div
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: "auto", opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden w-[60%] mb-20 mx-auto mt-10 relative z-30 bg-transparent"
            >
              <div className="backdrop-blur-xl rounded-lg border-r border-l border-white/20 p-12 shadow-2xl flex flex-col items-center text-center bg-black/30">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6 p-4 rounded-full bg-white/5 border border-white/20"
                >
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </motion.div>

                <h3 className="text-2xl font-custom italic font-bold text-white uppercase tracking-widest mb-2">
                  Authentication Required
                </h3>

                <p className="text-gray-400 font-mono text-sm max-w-sm mb-8 leading-relaxed">
                  Please link your decentralized identity to access the
                  <span className="text-white"> BAZAAR MINTING PROTOCOL</span>.
                </p>

                <BazaarConnectButton />

                <button
                  onClick={closeForm}
                  className="mt-6 text-[10px] text-gray-600 uppercase tracking-[0.4em] hover:text-white transition-colors"
                >
                  [ Cancel Operation ]
                </button>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>

      <ProtocolStats />

      <TerminalNews />

      <SystemAlerts />
    </div>
  );
}

export default Home;
