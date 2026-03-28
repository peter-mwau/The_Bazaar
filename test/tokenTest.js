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


describe("Token", function () {
    it("It should ensure that contract is deployed", async function () {
        const tokenAddress = await this.token.getAddress();
        expect(tokenAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should ensure fungible token metadata is correct", async function () {
        expect(await this.token.name()).to.equal("MyToken");
        expect(await this.token.symbol()).to.equal("MTK");
    });
});
