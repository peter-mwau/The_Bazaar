import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import { MarketPlaceProvider } from "./contexts/marketPlaceContext";
import { TokenProvider } from "./contexts/tokenContext";
import { TokenShopProvider } from "./contexts/tokenShopContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThirdwebProvider>
        <MarketPlaceProvider>
          <TokenProvider>
            <TokenShopProvider>
              <App />
            </TokenShopProvider>
          </TokenProvider>
        </MarketPlaceProvider>
      </ThirdwebProvider>
    </BrowserRouter>
  </StrictMode>,
);
