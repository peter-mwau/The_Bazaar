require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.VITE_SEPOLIA_RPC_URL || "",
      accounts:
        process.env.VITE_PRIVATE_KEY !== undefined ? [process.env.VITE_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.VITE_ETHERSCAN_API_KEY,
  },
};
