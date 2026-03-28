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

    const MarketPlace = await ethers.getContractFactory("MarketPlace");

    // deploy marketplace
    this.marketPlace = await MarketPlace.deploy();
    await this.marketPlace.waitForDeployment();

    // console.log("Marketplace deployed at:", await this.marketPlace.target);
});

describe("MarketPlace", function () {
    it("It should ensure that contract is deployed", async function () {
        const marketAddress = await this.marketPlace.getAddress();
        expect(marketAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should ensure that the NFT name & symbol are correct", async function () {
        expect(await this.marketPlace.name()).to.equal("MKT_TOKEN");
        expect(await this.marketPlace.symbol()).to.equal("MKTPTKN");
    });
});

describe("Minting", function () {
    it("Should allow users to mint NFTs", async function () {
        const listingPrice = await this.marketPlace.listingPrice();

        await this.marketPlace
            .connect(_addr1)
            .mintNFT(
                "NFT_ONE",
                "This is the first NFT to be minted in this marketplace",
                "https://example.com/nft1",
                18,
                { value: listingPrice }
            );

        expect(await this.marketPlace.ownerOf(1)).to.equal(_addr1.address);
    });

    it("Should allow users to mint tokens", async function () {
        const listingPrice = await this.marketPlace.listingPrice();

        // Mint an NFT
        await this.marketPlace
            .connect(_addr1)
            .mintNFT(
                "NFT_TWO",
                "This is the second NFT to be minted in this marketplace",
                "https://example.com/nft2",
                18,
                { value: listingPrice }
            );

        // List the NFT for sale
        const tokenId = 1;

        await this.marketPlace.connect(_addr1).listNFT(tokenId);

        const listing = await this.marketPlace.nftObject(tokenId);
        expect(listing.name).to.equal("NFT_TWO");
        expect(listing.description).to.equal(
            "This is the second NFT to be minted in this marketplace"
        );
        expect(listing.tokenURI).to.equal("https://example.com/nft2");
        expect(listing.owner).to.equal(_addr1.address);
    });


    describe("Listing NFTs", function () {
        it("Should allow users to list their NFTs for sale", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint an NFT
            await this.marketPlace
                .connect(_addr1)
                .mintNFT(
                    "NFT_TWO",
                    "This is the second NFT to be minted in this marketplace",
                    "https://example.com/nft2",
                    18,
                    { value: listingPrice }
                );

            // List the NFT for sale
            const tokenId = 1;

            await this.marketPlace.connect(_addr1).listNFT(tokenId);

            const listing = await this.marketPlace.nftObject(tokenId);
            expect(listing.owner).to.equal(_addr1.address);
            expect(listing.isListed).to.equal(true);
            expect(listing.price).to.equal(18n);
        });

        it("Should allow users to delist their NFTs", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint an NFT
            await this.marketPlace
                .connect(_addr1)
                .mintNFT(
                    "NFT_FOUR",
                    "This is the fourth NFT to be minted in this marketplace",
                    "https://example.com/nft4",
                    18,
                    { value: listingPrice }
                );

            // List the NFT for sale
            const tokenId = 1;
            await this.marketPlace.connect(_addr1).listNFT(tokenId);

            // Delist the NFT
            await this.marketPlace.connect(_addr1).unlistNFT(tokenId);

            const listing = await this.marketPlace.nftObject(tokenId);
            expect(listing.isListed).to.equal(false);
        });

        it("Should allow users to relist their NFTs", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint an NFT
            await this.marketPlace
                .connect(_addr1)
                .mintNFT(
                    "NFT_FIVE",
                    "This is the fifth NFT to be minted in this marketplace",
                    "https://example.com/nft5",
                    18,
                    { value: listingPrice }
                );

            // List the NFT for sale
            const tokenId = 1;
            await this.marketPlace.connect(_addr1).listNFT(tokenId);

            // Delist the NFT
            await this.marketPlace.connect(_addr1).unlistNFT(tokenId);

            // Relist the NFT
            await this.marketPlace.connect(_addr1).listNFT(tokenId);

            const listing = await this.marketPlace.nftObject(tokenId);
            expect(listing.isListed).to.equal(true);
        });
    });

    describe("Buying Listed NFTs", function () {
        it("Should allow users to buy listed NFTs", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint an NFT
            await this.marketPlace
                .connect(_addr1)
                .mintNFT(
                    "NFT_THREE",
                    "This is the third NFT to be minted in this marketplace",
                    "https://example.com/nft3",
                    18,
                    { value: listingPrice }
                );

            // List the NFT for sale
            const tokenId = 1;
            await this.marketPlace.connect(_addr1).listNFT(tokenId);

            // Buy the listed NFT
            await this.marketPlace.connect(_addr2).buyNFT(tokenId, { value: 18n });

            expect(await this.marketPlace.ownerOf(tokenId)).to.equal(_addr2.address);
        });
    });

    describe("Withdrawing Funds", function () {
        it("Should allow the contract owner to withdraw funds", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint an NFT
            await this.marketPlace
                .connect(_addr1)
                .mintNFT(
                    "NFT_SIX",
                    "This is the sixth NFT to be minted in this marketplace",
                    "https://example.com/nft6",
                    18,
                    { value: listingPrice }
                );

            // List the NFT for sale
            const tokenId = 1;
            await this.marketPlace.connect(_addr1).listNFT(tokenId);

            // Buy the listed NFT
            await this.marketPlace.connect(_addr2).buyNFT(tokenId, { value: 18n });

            // Withdraw funds (only listing price from mint, buy amount went directly to seller)
            const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
            await this.marketPlace.connect(owner).withdrawFees();
            const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

            // Owner should receive at least the listing fee (minus gas costs)
            expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);
        });
    });

    describe("Get NFTs", function () {
        it("Should return an array of all listed NFTs", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint multiple NFTs
            for (let i = 1; i <= 3; i++) {
                await this.marketPlace
                    .connect(_addr1)
                    .mintNFT(
                        `NFT_${i}`,
                        `This is NFT number ${i} to be minted in this marketplace`,
                        `https://example.com/nft${i}`,
                        18,
                        { value: listingPrice }
                    );
            }

            // List the NFTs for sale
            for (let tokenId = 1; tokenId <= 3; tokenId++) {
                await this.marketPlace.connect(_addr1).listNFT(tokenId);
            }

            const listedNFTs = await this.marketPlace.getListedNFTs();
            expect(listedNFTs.length).to.equal(3);
        });

        it("Should return an empty array if no NFTs are listed", async function () {
            const listedNFTs = await this.marketPlace.getListedNFTs();
            expect(listedNFTs.length).to.equal(0);
        });

        it("Should return an array of NFTs owned by a specific address", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint multiple NFTs
            for (let i = 1; i <= 3; i++) {
                await this.marketPlace
                    .connect(_addr1)
                    .mintNFT(
                        `NFT_${i}`,
                        `This is NFT number ${i} to be minted in this marketplace`,
                        `https://example.com/nft${i}`,
                        18,
                        { value: listingPrice }
                    );
            }

            const ownedNFTs = await this.marketPlace.getNFTsByOwner(_addr1.address);
            expect(ownedNFTs.length).to.equal(3);
        });

        it("Should return an empty array if the address owns no NFTs", async function () {
            const ownedNFTs = await this.marketPlace.getNFTsByOwner(_addr2.address);
            expect(ownedNFTs.length).to.equal(0);
        });

        it("Should return the correct metadata for a given token ID", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint an NFT
            await this.marketPlace
                .connect(_addr1)
                .mintNFT(
                    "NFT_SEVEN",
                    "This is the seventh NFT to be minted in this marketplace",
                    "https://example.com/nft7",
                    18,
                    { value: listingPrice }
                );

            const tokenId = 1;
            const metadata = await this.marketPlace.nftObject(tokenId);

            expect(metadata.name).to.equal("NFT_SEVEN");
            expect(metadata.description).to.equal(
                "This is the seventh NFT to be minted in this marketplace"
            );
            expect(metadata.tokenURI).to.equal("https://example.com/nft7");
        });

        it("Should return all minted NFTs", async function () {
            const listingPrice = await this.marketPlace.listingPrice();

            // Mint multiple NFTs
            for (let i = 1; i <= 3; i++) {
                await this.marketPlace
                    .connect(_addr1)
                    .mintNFT(
                        `NFT_${i}`,
                        `This is NFT number ${i} to be minted in this marketplace`,
                        `https://example.com/nft${i}`,
                        18,
                        { value: listingPrice }
                    );
            }

            const allNFTs = await this.marketPlace.getAllNFTs();
            expect(allNFTs.length).to.equal(3);
        });
    });




})
