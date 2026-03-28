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

    // deploy token
    this.token = await Token.deploy();
    await this.token.waitForDeployment();
});


describe("Deployment", function () {
    it("It should ensure that contract is deployed", async function () {
        const tokenAddress = await this.token.getAddress();
        expect(tokenAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });
});

describe("Token Metadata", function () {

    it("Should ensure fungible token metadata is correct", async function () {
        expect(await this.token.name()).to.equal("MyToken");
        expect(await this.token.symbol()).to.equal("MTK");
    });
});

describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
        const mintAmount = ethers.parseEther("1000");
        const initialSupply = await this.token.INITIAL_SUPPLY();

        await this.token.mintToken(owner.address, mintAmount);
        const ownerBalance = await this.token.balanceOf(owner.address);
        expect(ownerBalance).to.equal(initialSupply + mintAmount);
    });

    it("Should prevent non-minters from minting tokens", async function () {
        const mintAmount = ethers.parseEther("1000");
        await expect(this.token.connect(_addr1).mintToken(_addr1.address, mintAmount)).to.be.reverted;
    });
});

describe("Total Supply", function () {
    it("Should return the correct total supply after minting", async function () {
        const mintAmount = ethers.parseEther("1000");
        const initialSupply = await this.token.INITIAL_SUPPLY();

        await this.token.mintToken(owner.address, mintAmount);
        const totalSupply = await this.token.totalSupply();
        expect(totalSupply).to.equal(initialSupply + mintAmount);
    });
});

describe("Max Supply", function () {
    it("Should prevent minting beyond max supply", async function () {
        const maxSupply = await this.token.MAX_SUPPLY();
        const initialSupply = await this.token.INITIAL_SUPPLY();
        const remainingMintable = maxSupply - initialSupply;

        await this.token.mintToken(owner.address, remainingMintable);
        await expect(this.token.mintToken(owner.address, 1)).to.be.revertedWith(
            "MAX SUPPLY EXCEEDED"
        );
    });
});

describe("Burning", function () {
    it("Should allow owner to burn tokens from an address", async function () {
        const mintAmount = ethers.parseEther("1000");
        const initialSupply = await this.token.INITIAL_SUPPLY();

        await this.token.burnToken(owner.address, mintAmount);
        const ownerBalance = await this.token.balanceOf(owner.address);
        expect(ownerBalance).to.equal(initialSupply - mintAmount);
    });

    it("Should prevent burning more tokens than balance", async function () {
        const initialSupply = await this.token.INITIAL_SUPPLY();

        await expect(this.token.burnToken(owner.address, initialSupply + 1n)).to.be.revertedWith(
            "INSUFFICIENT BALANCE"
        );
    });
});
