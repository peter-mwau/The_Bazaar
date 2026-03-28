import pkg from "hardhat";

const { ethers } = pkg;

async function main() {
  const MarketPlace = await ethers.getContractFactory("MarketPlace");

  const marketPlace = await MarketPlace.deploy();
  await marketPlace.waitForDeployment();

  console.log("MarketPlace deployed to:", await marketPlace.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });