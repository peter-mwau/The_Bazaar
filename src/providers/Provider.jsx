import React, { useMemo } from "react";
import { client } from "../services/client";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import BazaarLogo from "/favicon.svg";

export function BazaarConnectButton() {
  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: {
          options: ["google", "discord", "passkey", "github"],
        },
        metadata: {
          name: "The Bazaar",
          image: {
            src: "/favicon.svg",
            width: 150,
            height: 150,
          },
        },
        executionMode: {
          mode: "EIP7702",
          sponsorGas: true,
        },
        smartAccount: {
          chain: defineChain(11155111),
          sponsorGas: true,
        },
        // smartAccount: false,
      }),
      createWallet("io.metamask"),
      createWallet("com.coinbase.wallet"),
      createWallet("me.rainbow"),
    ],
    [],
  );

  if (!client) {
    return (
      <button
        type="button"
        disabled
        title="Missing VITE_THIRDWEB_CLIENT_ID in environment configuration"
      >
        Wallet unavailable
      </button>
    );
  }

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectButton={{
        size: "large",
        titleIcon: BazaarLogo,
        showThirdwebBranding: false,
      }}
      connectModal={{
        size: "compact",
        titleIcon: BazaarLogo,
        showThirdwebBranding: true,
      }}
      theme={darkTheme}
    />
  );
}
