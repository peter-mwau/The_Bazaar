import { useContext } from "react";
import { MarketPlaceContext } from "./marketPlaceStore";

export const useMarketPlace = () => {
  const context = useContext(MarketPlaceContext);

  if (context === undefined) {
    throw new Error("useMarketPlace must be used within a MarketPlaceProvider");
  }

  return context;
};
