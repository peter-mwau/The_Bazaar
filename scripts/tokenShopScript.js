import pkg from "hardhat";
import { createRequire } from "module";

const { ethers } = pkg;
const require = createRequire(import.meta.url);
const [tokenAddress] = require("../constructorArgs.cjs");

async function main() {
  const TokenShop = await ethers.getContractFactory("TokenShop");

  if (!tokenAddress) {
    throw new Error("Missing token address in constructorArgs.cjs");
  }

  const tokenShop = await TokenShop.deploy(tokenAddress);
  await tokenShop.waitForDeployment();

  console.log("TokenShop deployed to:", await tokenShop.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });