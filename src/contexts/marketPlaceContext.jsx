import MarketPlaceABI from "../../artifacts/contracts/MarketPlace.sol/MarketPlace.json";
import { client } from "../services/client";
import { MarketPlaceContext } from "./marketPlaceStore";
import { useActiveAccount } from "thirdweb/react";
import {
  prepareContractCall,
  sendTransaction,
  getContract,
  defineChain,
  readContract,
} from "thirdweb";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useState } from "react";

const MARKETPLACE_ADDRESS = import.meta.env
  .VITE_SEPOLIA_MARKETPLACE_CONTRACT_ADDRESS;
const MARKETPLACE_ABI = MarketPlaceABI.abi;
const SEPOLIA_CHAIN_ID = 11155111;

export const MarketPlaceProvider = ({ children }) => {
  const [marketData, setMarketData] = useState({
    listedNFTs: [],
    allNFTs: [],
    myNFTs: [],
  });
  const account = useActiveAccount();
  const address = account?.address;
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_ADMIN_ROLE = ethers.keccak256(
    ethers.toUtf8Bytes("DEFAULT_ADMIN_ROLE"),
  );

  const getMarketplaceContract = async () => {
    return getContract({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      client,
      chain: defineChain(SEPOLIA_CHAIN_ID),
    });
  };

  const getErrorMessage = (error) => {
    return error?.message || "Something went wrong. Please try again.";
  };

  //=======================================================
  // WRITE FUNCTIONS
  //=======================================================

  //function to create a new NFT and list it on the marketplace
  const createNFT = async (metadata) => {
    const toastId = toast.loading("Minting your NFT...");
    setIsLoading(true);
    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const priceInEth = parseFloat(metadata.price);
      if (isNaN(priceInEth)) {
        throw new Error("Invalid price format");
      }

      const priceInWei = BigInt(Math.floor(priceInEth * 10 ** 18));

      const contract = await getMarketplaceContract();

      //preparecontract call
      const transaction = await prepareContractCall({
        contract,
        method: "mintNFT",
        params: [
          metadata.name,
          metadata.description,
          metadata.tokenURI,
          priceInWei,
        ],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("NFT minted successfully!", { id: toastId });
      console.log("Transaction receipt:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error(`Error minting NFT: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  //   function to list an NFT on the marketplace
  const listNFT = async (tokenId) => {
    const toastId = toast.loading("Listing NFT...");
    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const contract = await getMarketplaceContract();

      const transaction = await prepareContractCall({
        contract,
        method: "listNFT",
        params: [tokenId],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("NFT listed successfully!", { id: toastId });
      console.log("Transaction receipt:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error listing NFT:", error);
      toast.error(`Error listing NFT: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  //function to delist an NFT from the marketplace
  const delistNFT = async (tokenId) => {
    const toastId = toast.loading("Delisting NFT...");
    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const contract = await getMarketplaceContract();

      const transaction = await prepareContractCall({
        contract,
        method: "unlistNFT",
        params: [tokenId],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("NFT delisted successfully!", { id: toastId });
      console.log("Transaction receipt:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error delisting NFT:", error);
      toast.error(`Error delisting NFT: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  // function to buy an NFT from the marketplace
  const buyNFT = async (tokenId, price) => {
    const toastId = toast.loading("Buying NFT...");
    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }
      if (price === undefined || price === null) {
        throw new Error("Price is required to buy NFT.");
      }

      const contract = await getMarketplaceContract();

      const transaction = await prepareContractCall({
        contract,
        method: "buyNFT",
        params: [tokenId],
        value: BigInt(price),
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("NFT bought successfully!", { id: toastId });
      console.log("Transaction receipt:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error buying NFT:", error);
      toast.error(`Error buying NFT: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  //function to withdraw fees from the marketplace
  const withdrawFees = async () => {
    const toastId = toast.loading("Withdrawing marketplace fees...");
    try {
      if (!address || !client) {
        throw new Error("No active account found. Please connect your wallet.");
      }

      const contract = await getMarketplaceContract();

      const transaction = await prepareContractCall({
        contract,
        method: "withdrawFees",
        params: [],
      });

      const receipt = await sendTransaction({ transaction, account });
      toast.success("Fees withdrawn successfully!", { id: toastId });
      console.log("Transaction receipt:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error withdrawing fees:", error);
      toast.error(`Error withdrawing fees: ${getErrorMessage(error)}`, {
        id: toastId,
      });
      throw error;
    }
  };

  //=======================================================
  // READ FUNCTIONS
  //=======================================================

  //function to fetch all listed NFTs from the marketplace
  const fetchListedNFTs = async () => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }

      const contract = await getMarketplaceContract();

      const listedItems = await readContract({
        contract,
        method: "getListedNFTs",
        params: [],
      });

      setMarketData((prev) => ({ ...prev, listedNFTs: listedItems }));
      return listedItems;
    } catch (error) {
      console.error("Error fetching listed NFTs:", error);
      toast.error(`Error fetching listed NFTs: ${getErrorMessage(error)}`);
      return [];
    }
  };

  //FUNCTION to fetch all NFTs from the marketplace
  const fetchAllNFTs = async () => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }

      const contract = await getMarketplaceContract();

      const allItems = await readContract({
        contract,
        method: "getAllNFTs",
        params: [],
      });

      setMarketData((prev) => ({ ...prev, allNFTs: allItems }));
      return allItems;
    } catch (error) {
      console.error("Error fetching all NFTs:", error);
      toast.error(`Error fetching all NFTs: ${getErrorMessage(error)}`);
      return [];
    }
  };

  //function to get all NFTs owned by a specific address
  const fetchNFTsByOwner = async (ownerAddress) => {
    try {
      if (!client) {
        throw new Error("No client found. Please connect your wallet.");
      }

      const contract = await getMarketplaceContract();

      const ownedItems = await readContract({
        contract,
        method: "getNFTsByOwner",
        params: [ownerAddress],
      });

      setMarketData((prev) => ({ ...prev, myNFTs: ownedItems }));
      return ownedItems;
    } catch (error) {
      console.error("Error fetching NFTs by owner:", error);
      toast.error(`Error fetching NFTs by owner: ${getErrorMessage(error)}`);
      return [];
    }
  };

  return (
    <MarketPlaceContext.Provider
      value={{
        marketData,
        setMarketData,
        isLoading,
        createNFT,
        listNFT,
        delistNFT,
        buyNFT,
        withdrawFees,
        fetchListedNFTs,
        fetchAllNFTs,
        fetchNFTsByOwner,
      }}
    >
      {children}
    </MarketPlaceContext.Provider>
  );
};
