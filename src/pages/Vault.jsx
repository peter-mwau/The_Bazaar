import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Shield,
  Activity,
  Landmark,
  ArrowUpRight,
  BarChart3,
  Database,
  RefreshCw,
  Copy,
  Check,
  Lock,
  Unlock,
  AlertTriangle,
  Clock,
  Fingerprint,
  Key,
  Scan,
  Radio,
  Terminal,
  Eye,
  EyeOff,
} from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import {
  eth_getBalance,
  getContract,
  getRpcClient,
  readContract,
  defineChain,
  toEther,
} from "thirdweb";
import { toast } from "react-hot-toast";
import { client } from "../services/client";
import { getEnv } from "../config/env";
import MarketPlaceABI from "../../artifacts/contracts/MarketPlace.sol/MarketPlace.json";
import { useMarketPlace } from "../contexts/useMarketPlace";

const MARKETPLACE_ADDRESS = getEnv("VITE_SEPOLIA_MARKETPLACE_CONTRACT_ADDRESS");
const SEPOLIA_CHAIN_ID = 11155111;

function Vault() {
  const account = useActiveAccount();
  const connectedAddress = account?.address;
  const { withdrawFees } = useMarketPlace();
  const [contractOwner, setContractOwner] = useState("");
  const [contractBalance, setContractBalance] = useState(0n);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [protocolFee] = useState("0.001");
  const [totalSales] = useState("1,420");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [glitchEffect, setGlitchEffect] = useState(false);

  const isOwner =
    Boolean(connectedAddress && contractOwner) &&
    connectedAddress.toLowerCase() === contractOwner.toLowerCase();

  const loadAdminData = useCallback(async () => {
    if (!client || !MARKETPLACE_ADDRESS) return;
    setIsLoading(true);
    try {
      const contract = getContract({
        address: MARKETPLACE_ADDRESS,
        abi: MarketPlaceABI.abi,
        client,
        chain: defineChain(SEPOLIA_CHAIN_ID),
      });
      const rpcClient = getRpcClient({
        client,
        chain: defineChain(SEPOLIA_CHAIN_ID),
      });
      const [owner, balance] = await Promise.all([
        readContract({ contract, method: "owner", params: [] }),
        eth_getBalance(rpcClient, { address: MARKETPLACE_ADDRESS }),
      ]);
      setContractOwner(owner);
      setContractBalance(balance);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error(error?.message || "Protocol_Sync_Failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
    // Random glitch effect every 30 seconds
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 30000);
    return () => clearInterval(glitchInterval);
  }, [loadAdminData]);

  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  const handleWithdraw = async () => {
    if (!isOwner) {
      toast.error("Only the contract owner can withdraw fees.");
      return;
    }

    try {
      setIsLoading(true);
      await withdrawFees();
      await loadAdminData();
      toast.success("Withdrawal executed successfully");
    } catch (error) {
      toast.error(error?.message || "Withdrawal failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const accessLogId = connectedAddress
    ? `${connectedAddress.slice(2, 10).toUpperCase()}-${Number(
        contractBalance % 1000000n,
      )
        .toString(16)
        .toUpperCase()}`
    : "PENDING";

  const balanceLabel = showBalance
    ? `${toEther(contractBalance)} ETH`
    : "•••••• ETH";

  // Vintage scanning line animation
  const ScanningLine = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent animate-scan"></div>
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-black text-white px-10 py-32 font-mono relative overflow-hidden ${
        glitchEffect ? "animate-glitch" : ""
      }`}
    >
      {/* Vintage CRT Overlay */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_50%,rgba(0,0,0,0.8)_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full animate-flicker opacity-30">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-white/20 animate-scan"></div>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[28px_28px] opacity-50 pointer-events-none" />

      {/* Decorative Elements */}
      <span className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[900px] -z-10 text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.02)] font-bold pointer-events-none select-none">
        ★
      </span>

      <div className="fixed bottom-8 left-8 text-[8px] text-white/5 font-mono uppercase tracking-widest z-10 hidden lg:block">
        <div>SECURE_CONNECTION: ESTABLISHED</div>
        <div>ENCRYPTION: AES-256-GCM</div>
        <div>SIGNATURE: VERIFIED</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section with Vintage Style */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-l-2 border-emerald-500/50 pl-8 relative">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
              </div>
              <p className="text-[10px] text-emerald-500/60 uppercase tracking-[0.5em]">
                {"//"} BAZAAR_VAULT_DEPOSITORY_V2.1
              </p>
            </div>
            {/* <h1 className="text-7xl font-custom italic font-bold uppercase tracking-tighter bg-gradient-to-r from-white via-emerald-100 to-emerald-500 bg-clip-text text-transparent">
              The_Vault
            </h1> */}
            <h1 className="text-7xl sm:text-5xl font-custom italic lg:text-6xl font-bold text-white uppercase tracking-tighter">
              THE_
              <span className="text-transparent [-webkit-text-stroke:0.8px_white]">
                VAULT
              </span>
            </h1>
            <p className="text-[11px] text-white/30 mt-4 font-mono tracking-wider">
              [ SECURE_COLD_STORAGE || MULTISIG_REQUIRED || CHAINLINK_VERIFIED ]
            </p>
          </div>
          <div className="hidden md:block text-right space-y-2">
            <div className="flex items-center gap-3 justify-end">
              <Radio size={10} className="text-emerald-500 animate-pulse" />
              <p className="text-[9px] text-emerald-500/60 uppercase tracking-widest">
                ● System_Liquid_Assets: Verified
              </p>
            </div>
            <p className="text-[10px] text-white/30 mt-1 uppercase font-mono">
              Block_Height: #{Math.floor(Date.now() / 1000) - 1700000000}
            </p>
            <button
              onClick={loadAdminData}
              className="text-[9px] text-white/20 hover:text-white/60 transition-colors flex items-center gap-1 ml-auto"
            >
              <RefreshCw size={10} />
              SYNC_VAULT
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        {!isOwner && connectedAddress && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r flex items-center gap-4"
          >
            <AlertTriangle className="text-red-500 animate-pulse" size={16} />
            <p className="text-[10px] text-red-200 uppercase tracking-widest font-mono">
              ⚠ UNAUTHORIZED_ACCESS_DETECTED || WITHDRAWAL_FUNCTIONS_DISABLED ||
              REPORT_TO_AUTHORITIES
            </p>
          </MotionDiv>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Vault Section */}
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 flex flex-col justify-between min-h-[500px] relative group hover:border-emerald-500/30 transition-all duration-500">
            <ScanningLine />
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Landmark className="text-emerald-500" size={18} />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                    CONTRACT_RESERVES
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-white/20">
                  <Clock size={10} />
                  <span>UPDATED: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-4 flex-wrap justify-between">
                  <p className="text-7xl font-custom italic font-bold tracking-tighter bg-gradient-to-r from-white via-emerald-200 to-emerald-500 bg-clip-text text-transparent">
                    {balanceLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowBalance((prev) => !prev)}
                    className="inline-flex hover:cursor-pointer items-center gap-2 px-3 py-2 border border-white/10 rounded-full text-[9px] uppercase tracking-[0.25em] text-gray-400 hover:text-white hover:border-emerald-500/50 transition-all duration-300"
                  >
                    {showBalance ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showBalance ? "Hide" : "Reveal"}
                  </button>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                  <p className="text-[9px] text-emerald-500/40 uppercase tracking-widest font-mono">
                    {showBalance ? "BALANCE_DECRYPTED" : "BALANCE_ENCRYPTED"} ◆
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-l from-emerald-500/20 to-transparent"></div>
                </div>
              </div>
            </div>

            <MotionButton
              whileHover={isOwner ? { scale: 1.02 } : {}}
              whileTap={isOwner ? { scale: 0.98 } : {}}
              onClick={handleWithdraw}
              disabled={!isOwner || isLoading}
              className={`w-full py-5 font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-300 relative overflow-hidden group ${
                isOwner
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
                  : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/10"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw size={14} className="animate-spin" />
                  PROCESSING...
                </div>
              ) : isOwner ? (
                "EXECUTE_WITHDRAWAL_SEQUENCE"
              ) : (
                "VAULT_LOCKED 🔒"
              )}
              {isOwner && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </MotionButton>
          </div>

          {/* Protocol Specs */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 space-y-6 group hover:border-emerald-500/30 transition-all duration-500">
            <div className="flex items-center gap-3">
              <Database size={16} className="text-emerald-500" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                PROTOCOL_SPECS
              </h2>
            </div>
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <p className="text-[9px] text-emerald-500/60 uppercase mb-2 tracking-wider">
                  Listing_Fee
                </p>
                <p className="text-3xl font-bold text-white font-mono">
                  {protocolFee}{" "}
                  <span className="text-sm text-white/40">ETH</span>
                </p>
              </div>
              <div className="border-b border-white/5 pb-4">
                <p className="text-[9px] text-emerald-500/60 uppercase mb-2 tracking-wider">
                  Total_Market_Sales
                </p>
                <p className="text-3xl font-bold text-white font-mono">
                  {totalSales}{" "}
                  <span className="text-sm text-white/40">NFTs</span>
                </p>
              </div>
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <Activity
                    size={12}
                    className="text-emerald-500 animate-pulse"
                  />
                  <span className="text-[9px] text-emerald-500 uppercase tracking-wider font-mono">
                    Veritas_Oracle: Active ◆ Chainlink_Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-white/30" />
                  <span className="text-[9px] text-white/30 uppercase tracking-wider font-mono">
                    Audit_Passed: Q1_2025
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Authority Section */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 space-y-6 group hover:border-emerald-500/30 transition-all duration-500">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-emerald-500" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                AUTHORITY_KEY
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-[8px] text-emerald-500/60 uppercase mb-2 tracking-wider flex items-center gap-1">
                  <Fingerprint size={10} />
                  Registered_Owner
                </p>
                <p className="text-[10px] text-white break-all leading-tight font-mono">
                  {contractOwner || "SEARCHING_OWNER..."}
                </p>
              </div>

              <div
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  isOwner
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <p className="text-[8px] text-white/40 uppercase mb-2 tracking-wider flex items-center gap-1">
                  <Key size={10} />
                  Session_Status
                </p>
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isOwner ? "text-emerald-500 animate-pulse" : "text-red-500"
                  }`}
                >
                  {isOwner ? "◆ ACCESS_GRANTED ◆" : "◆ ACCESS_RESTRICTED ◆"}
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-[8px] text-white/40 uppercase mb-2 tracking-wider flex items-center gap-1">
                  <Scan size={10} />
                  Connected_Wallet
                </p>
                <p className="text-[10px] text-white break-all leading-tight font-mono">
                  {connectedAddress || "NO_SESSION_DETECTED"}
                </p>
                <div className="mt-2 flex justify-end">
                  {isOwner ? (
                    <Unlock size={12} className="text-emerald-500" />
                  ) : (
                    <Lock size={12} className="text-red-500" />
                  )}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[8px] text-white/40 uppercase mb-1 tracking-wider">
                    Wallet_Verification
                  </p>
                  <p className="text-[9px] text-white/60 font-mono">
                    {connectedAddress ? "VERIFIED" : "PENDING_CONNECTION"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!contractOwner) return;
                    navigator.clipboard.writeText(contractOwner);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-white/30 hover:text-emerald-500 transition-all duration-300"
                  type="button"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 group hover:border-emerald-500/30 transition-all duration-500">
          <h3 className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <Terminal size={12} /> // RECENT_VAULT_ACTIVITY_LOG
          </h3>
          <div className="space-y-2 font-mono text-[10px]">
            {[
              "LISTING_FEE_RECEIVED: 0.025 ETH | TX: 0x8f3...a2d1",
              "OWNER_RECLAIM_READY: TRUE | MULTISIG: 2/3 APPROVED",
              `SESSION_OWNER_MATCH: ${
                isOwner ? "YES" : "NO"
              } | PROTOCOL_STATE: ${isOwner ? "ADMIN" : "READONLY"}`,
              "CHAINLINK_ORACLE_UPDATE: PRICE_FEED_SYNCED",
              `VAULT_BALANCE_SYNC: ${
                showBalance ? "DECRYPTED" : "ENCRYPTED"
              } MODE`,
            ].map((entry, index) => (
              <div
                key={entry}
                className="flex justify-between items-center py-2 border-b border-white/5 text-white/40 hover:text-white/80 transition-colors group-hover:border-emerald-500/10"
              >
                <span className="font-mono">
                  {">"} {entry}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-white/20 text-[8px]">
                    HASH: 0x{Math.random().toString(36).substring(2, 10)}...
                    {index + 1}f3
                  </span>
                  <span className="text-white/20 text-[8px]">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-[8px] text-white/20 font-mono">
          <p>PROTOCOL_ADDR: {MARKETPLACE_ADDRESS}</p>
          <p>ACCESS_LOG_ID: {accessLogId}</p>
          <p>SESSION_KEY: {isOwner ? "ADMIN_PRIVILEGES" : "READONLY_MODE"}</p>
        </div>
      </div>
    </div>
  );
}

export default Vault;
