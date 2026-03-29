import React from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "thirdweb/react";
import { client } from "../services/client";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black backdrop-blur pt-10 flex justify-center">
      <nav className="max-w-7xl w-full flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-white">
          The Bazaar
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Marketplace
          </Link>
          <Link
            to="/my-nfts"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            My NFTs
          </Link>
        </div>

        <div>
          <ConnectButton client={client} />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
