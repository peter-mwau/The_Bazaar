import { useState } from "react";
import TokenABI from "../../artifacts/contracts/Token.sol/MyToken.json";
import { client } from "../services/client";
import { TokenContext } from "./tokenStore";
import { useActiveAccount } from "thirdweb/react";
import {
  prepareContractCall,
  sendTransaction,
  getContract,
  defineChain,
  readContract,
} from "thirdweb";
import { toast } from "react-hot-toast";

const TOKEN_ADDRESS = import.meta.env.VITE_SEPOLIA_TOKEN_CONTRACT_ADDRESS;
const TOKEN_ABI = TokenABI.abi;
const SEPOLIA_CHAIN_ID = 11155111;

export const TokenProvider = ({ children }) => {
  const [tokenData, setTokenData] = useState({
    balance: 0n,
    totalSupply: 0n,
    allowance: 0n,
  });

  const account = useActiveAccount();
  const address = account?.address;

  const getTokenContract = async () => {
    if (!TOKEN_ADDRESS) {
      throw new Error(
        "Missing token contract address in environment variables.",
      );
    }

    return getContract({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      client,
      chain: defineChain(SEPOLIA_CHAIN_ID),
    });
  };

  const getErrorMessage = (error) => {
    return error?.message || "Something went wrong. Please try again.";
  };

  const mintToken = async (userAddress, amount) => {
    const toastId = toast.loading("Minting tokens...");

    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const contract = await getTokenContract();

      const transaction = await prepareContractCall({
        contract,
        method: "mintToken",
        params: [userAddress, amount],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("Tokens minted successfully!", { id: toastId });
      return receipt;
    } catch (error) {
      toast.error(`Error minting tokens: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  const burnToken = async (userAddress, amount) => {
    const toastId = toast.loading("Burning tokens...");

    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const contract = await getTokenContract();

      const transaction = await prepareContractCall({
        contract,
        method: "burnToken",
        params: [userAddress, amount],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("Tokens burned successfully!", { id: toastId });
      return receipt;
    } catch (error) {
      toast.error(`Error burning tokens: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  const fetchBalance = async (walletAddress = address) => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }
      if (!walletAddress) {
        throw new Error("Wallet address is required.");
      }

      const contract = await getTokenContract();

      const balance = await readContract({
        contract,
        method: "balanceOf",
        params: [walletAddress],
      });

      setTokenData((prev) => ({ ...prev, balance }));
      return balance;
    } catch (error) {
      toast.error(`Error fetching token balance: ${getErrorMessage(error)}`);
      return 0n;
    }
  };

  const fetchTotalSupply = async () => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }

      const contract = await getTokenContract();

      const totalSupply = await readContract({
        contract,
        method: "totalSupply",
        params: [],
      });

      setTokenData((prev) => ({ ...prev, totalSupply }));
      return totalSupply;
    } catch (error) {
      toast.error(`Error fetching total supply: ${getErrorMessage(error)}`);
      return 0n;
    }
  };

  const fetchAllowance = async (ownerAddress, spenderAddress) => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }

      const contract = await getTokenContract();

      const allowance = await readContract({
        contract,
        method: "allowance",
        params: [ownerAddress, spenderAddress],
      });

      setTokenData((prev) => ({ ...prev, allowance }));
      return allowance;
    } catch (error) {
      toast.error(`Error fetching allowance: ${getErrorMessage(error)}`);
      return 0n;
    }
  };

  return (
    <TokenContext.Provider
      value={{
        tokenData,
        setTokenData,
        mintToken,
        burnToken,
        fetchBalance,
        fetchTotalSupply,
        fetchAllowance,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
