import pkg from "hardhat";

const { ethers } = pkg;

async function main() {
  const MyToken = await ethers.getContractFactory("MyToken");

  const token = await MyToken.deploy();
  await token.waitForDeployment();

  console.log("MyToken deployed to:", await token.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });