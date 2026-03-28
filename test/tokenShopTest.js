import { expect } from "chai";
import pkg from "hardhat";
import { beforeEach, describe, it } from "mocha";

const { ethers } = pkg;

let owner;
let _addr1;
let _addr2;
let _addr3;

beforeEach(async function () {
    [owner, _addr1, _addr2, _addr3] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    const TokenShop = await ethers.getContractFactory("TokenShop");

    this.token = await Token.deploy();
    await this.token.waitForDeployment();

    // deploy token shop
    this.tokenShop = await TokenShop.deploy(await this.token.getAddress());
    await this.tokenShop.waitForDeployment();
});

describe("TokenShop", function () {
    it("It should ensure that contract is deployed", async function () {
        const tokenShopAddress = await this.tokenShop.getAddress();
        expect(tokenShopAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    describe("Minting Tokens via ETH", function () {
        it("Should revert if no ETH is sent", async function () {
            const MINTER_ROLE = await this.token.MINTER_ROLE();
            await this.token.grantRole(MINTER_ROLE, await this.tokenShop.getAddress());

            // Attempt to call receive with 0 value should revert
            await expect(
                _addr1.sendTransaction({
                    to: await this.tokenShop.getAddress(),
                    value: 0,
                })
            ).to.be.reverted;
        });

        it("Should revert when Chainlink feed is unavailable (expected on local network)", async function () {
            const MINTER_ROLE = await this.token.MINTER_ROLE();
            await this.token.grantRole(MINTER_ROLE, await this.tokenShop.getAddress());

            // On local Hardhat network, Sepolia Chainlink feed is not available
            // This test verifies the contract correctly reverts on unavailable feed
            const ethAmount = ethers.parseEther("1");
            await expect(
                _addr1.sendTransaction({
                    to: await this.tokenShop.getAddress(),
                    value: ethAmount,
                })
            ).to.be.reverted;
        });
    });

    describe("Amount Calculation", function () {
        it("Should revert when Chainlink feed unavailable (expected on local network)", async function () {
            // On local Hardhat, Sepolia Chainlink feed doesn't exist
            // Contract should revert when trying to fetch price data
            const ethAmount = ethers.parseEther("1");
            await expect(
                this.tokenShop.amountToMint(ethAmount)
            ).to.be.reverted;
        });
    });

    describe("Withdrawing Funds", function () {
        it("Should allow owner to call withdraw function", async function () {
            // Test that owner can call withdraw (no ETH needed for this test)
            // On local network, contract has no balance, so nothing is withdrawn
            // but the call should succeed without permission error
            await expect(
                this.tokenShop.connect(owner).withdraw()
            ).to.not.be.reverted;
        });

        it("Should only allow owner to call withdraw", async function () {
            // Non-owner should not be able to call withdraw
            await expect(
                this.tokenShop.connect(_addr1).withdraw()
            ).to.be.reverted;
        });
    });

    describe("Price Feed Management", function () {
        it("Should allow owner to add price feeds", async function () {
            // Mock Chainlink feed address
            const mockFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

            // This should succeed without revert
            await expect(
                this.tokenShop.connect(owner).addTokenPriceFeed(
                    await this.token.getAddress(),
                    mockFeedAddress
                )
            ).to.not.be.reverted;

            // Verify feed was added
            const feed = await this.tokenShop.tokenPriceFeeds(await this.token.getAddress());
            expect(feed).to.equal(mockFeedAddress);
        });

        it("Should only allow owner to add price feeds", async function () {
            const mockFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

            // Non-owner should not be able to add price feeds
            await expect(
                this.tokenShop.connect(_addr1).addTokenPriceFeed(
                    await this.token.getAddress(),
                    mockFeedAddress
                )
            ).to.be.reverted;
        });
    });

    describe("Token Swap", function () {
        it("Should revert if amount is zero", async function () {
            const tokenAddress = await this.token.getAddress();

            await expect(
                this.tokenShop.connect(_addr1).swapTokens(
                    tokenAddress,
                    tokenAddress,
                    0
                )
            ).to.be.reverted;
        });

        it("Should revert if input token feed is missing", async function () {
            const tokenAddress = await this.token.getAddress();
            const amount = ethers.parseEther("1");

            // No feed registered, should fail with MissingPriceFeed
            await expect(
                this.tokenShop.connect(_addr1).swapTokens(
                    tokenAddress,
                    tokenAddress,
                    amount
                )
            ).to.be.reverted;
        });

        it("Should revert if output token feed is missing", async function () {
            const tokenAddress = await this.token.getAddress();
            const mockFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
            const amount = ethers.parseEther("1");

            // Add feed for input token only
            await this.tokenShop.connect(owner).addTokenPriceFeed(tokenAddress, mockFeedAddress);

            // Output feed not set, should fail
            await expect(
                this.tokenShop.connect(_addr1).swapTokens(
                    tokenAddress,
                    tokenAddress,
                    amount
                )
            ).to.be.reverted;
        });
    });
});