import { useState } from "react";
import TokenShopABI from "../../artifacts/contracts/TokenShop.sol/TokenShop.json";
import { client } from "../services/client";
import { TokenShopContext } from "./tokenShopStore";
import { useActiveAccount } from "thirdweb/react";
import {
  prepareContractCall,
  prepareTransaction,
  sendTransaction,
  getContract,
  defineChain,
  readContract,
} from "thirdweb";
import { toast } from "react-hot-toast";

const TOKENSHOP_ADDRESS = import.meta.env
  .VITE_SEPOLIA_TOKENSHOP_CONTRACT_ADDRESS;
const TOKENSHOP_ABI = TokenShopABI.abi;
const SEPOLIA_CHAIN_ID = 11155111;

export const TokenShopProvider = ({ children }) => {
  const [tokenShopData, setTokenShopData] = useState({
    ethPrice: 0n,
    estimatedTokens: 0n,
    tokenPrice: 0n,
  });

  const account = useActiveAccount();
  const address = account?.address;

  const getTokenShopContract = async () => {
    if (!TOKENSHOP_ADDRESS) {
      throw new Error(
        "Missing token shop contract address in environment variables.",
      );
    }

    return getContract({
      address: TOKENSHOP_ADDRESS,
      abi: TOKENSHOP_ABI,
      client,
      chain: defineChain(SEPOLIA_CHAIN_ID),
    });
  };

  const getErrorMessage = (error) => {
    return error?.message || "Something went wrong. Please try again.";
  };

  const buyTokens = async (ethAmountWei) => {
    const toastId = toast.loading("Purchasing tokens...");

    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const transaction = prepareTransaction({
        to: TOKENSHOP_ADDRESS,
        value: BigInt(ethAmountWei),
        chain: defineChain(SEPOLIA_CHAIN_ID),
        client,
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("Tokens purchased successfully!", { id: toastId });
      return receipt;
    } catch (error) {
      toast.error(`Error purchasing tokens: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  const withdraw = async () => {
    const toastId = toast.loading("Withdrawing token shop balance...");

    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const contract = await getTokenShopContract();

      const transaction = await prepareContractCall({
        contract,
        method: "withdraw",
        params: [],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("Token shop balance withdrawn!", { id: toastId });
      return receipt;
    } catch (error) {
      toast.error(`Error withdrawing balance: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  const addTokenPriceFeed = async (tokenAddress, feedAddress) => {
    const toastId = toast.loading("Adding token price feed...");

    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const contract = await getTokenShopContract();

      const transaction = await prepareContractCall({
        contract,
        method: "addTokenPriceFeed",
        params: [tokenAddress, feedAddress],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("Token price feed added!", { id: toastId });
      return receipt;
    } catch (error) {
      toast.error(`Error adding token price feed: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  const swapTokens = async (tokenIn, tokenOut, amountIn) => {
    const toastId = toast.loading("Swapping tokens...");

    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const contract = await getTokenShopContract();

      const transaction = await prepareContractCall({
        contract,
        method: "swapTokens",
        params: [tokenIn, tokenOut, amountIn],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("Token swap completed!", { id: toastId });
      return receipt;
    } catch (error) {
      toast.error(`Error swapping tokens: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  const fetchEthPrice = async () => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }

      const contract = await getTokenShopContract();

      const ethPrice = await readContract({
        contract,
        method: "getChainlinkDataFeedLatestAnswer",
        params: [],
      });

      setTokenShopData((prev) => ({ ...prev, ethPrice: BigInt(ethPrice) }));
      return BigInt(ethPrice);
    } catch (error) {
      toast.error(`Error fetching ETH price: ${getErrorMessage(error)}`);
      return 0n;
    }
  };

  const fetchAmountToMint = async (amountInEthWei) => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }

      const contract = await getTokenShopContract();

      const estimatedTokens = await readContract({
        contract,
        method: "amountToMint",
        params: [amountInEthWei],
      });

      setTokenShopData((prev) => ({ ...prev, estimatedTokens }));
      return estimatedTokens;
    } catch (error) {
      toast.error(`Error estimating token amount: ${getErrorMessage(error)}`);
      return 0n;
    }
  };

  const fetchTokenPrice = async (tokenAddress) => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }

      const contract = await getTokenShopContract();

      const tokenPrice = await readContract({
        contract,
        method: "getPrice",
        params: [tokenAddress],
      });

      setTokenShopData((prev) => ({ ...prev, tokenPrice }));
      return tokenPrice;
    } catch (error) {
      toast.error(`Error fetching token price: ${getErrorMessage(error)}`);
      return 0n;
    }
  };

  return (
    <TokenShopContext.Provider
      value={{
        tokenShopData,
        setTokenShopData,
        buyTokens,
        withdraw,
        addTokenPriceFeed,
        swapTokens,
        fetchEthPrice,
        fetchAmountToMint,
        fetchTokenPrice,
      }}
    >
      {children}
    </TokenShopContext.Provider>
  );
};
