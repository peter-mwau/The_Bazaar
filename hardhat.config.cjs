require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
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
