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
});