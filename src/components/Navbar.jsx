import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BazaarConnectButton } from "../providers/Provider";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[999] w-full bg-black backdrop-blur pt-6 flex justify-center">
      <nav className="max-w-7xl w-full flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold text-white flex-shrink-0">
          {/* The Bazaar */}
          <img src="/thebazaar_logo.png" className="h-15 w-20" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link
            to="/"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/")
                ? "text-white border-b-2 border-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/marketplace")
                ? "text-white border-b-2 border-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Marketplace
          </Link>
          <Link
            to="/my-nfts"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/my-nfts")
                ? "text-white border-b-2 border-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            My NFTs
          </Link>
        </div>

        {/* Desktop Connect Button */}
        <div className="hidden md:block">
          <BazaarConnectButton />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
            aria-expanded="false"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b rounded-bl-lg rounded-br-lg bg-opacity-95 backdrop-blur border-white border-1 border-l-0 border-r-0 border-t-0">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Link
              to="/"
              className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive("/")
                  ? "text-white border-l border-r border-white"
                  : "text-gray-300 hover:text-white hover:border-t hover:border-b hover:rounded-lg hover:bg-transparent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive("/marketplace")
                  ? "text-white border-l border-r border-white"
                  : "text-gray-300 hover:text-white hover:border-t hover:border-b hover:rounded-lg hover:bg-transparent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/my-nfts"
              className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                isActive("/my-nfts")
                  ? "text-white border-l border-r border-white"
                  : "text-gray-300 hover:text-white hover:border-t hover:border-b hover:rounded-lg hover:bg-transparent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              My NFTs
            </Link>
            <div className="pt-2 border-t border-gray-700">
              <BazaarConnectButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
