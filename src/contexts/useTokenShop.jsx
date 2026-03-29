import { useContext } from "react";
import { TokenShopContext } from "./tokenShopStore";

export const useTokenShop = () => {
  const context = useContext(TokenShopContext);

  if (context === undefined) {
    throw new Error("useTokenShop must be used within a TokenShopProvider");
  }

  return context;
};
