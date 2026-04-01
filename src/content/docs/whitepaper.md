# Whitepaper

## Protocol Overview

The Bazaar is a resilient, transparent NFT exchange layer engineered for the modern digital asset economy. Built on SKALE Network gasless infrastructure, it combines a marketplace with an integrated token shop and Chainlink-powered pricing.

Current deployment: Sepolia Testnet (Ethereum)

Target mainnet: SKALE Titan Hub (gasless, high-performance)

## Vision

The Bazaar aims to become a marketplace where physical and digital assets converge through transparent, verifiable ownership and provenance. The protocol is designed so every transfer leaves an immutable footprint that builds trust over time.

## Core Principles

### 1. Verifiable Ownership

Every NFT keeps a complete on-chain ownership trail so buyers can verify provenance before purchase.

### 2. Deterministic Listing Flow

Listing and purchase execution follow a predictable state flow to reduce ambiguity and operational risk.

### 3. Transparent Market Data

Pricing logic is powered by Chainlink oracles for manipulation-resistant market references.

### 4. Composable Smart Contracts

The protocol uses modular contract components to support future extension while preserving current behavior.

### 5. Asset Agnosticism

Supported categories include:

- Skills and services
- Real-world assets (RWAs)
- Art and media
- Property and land rights
- Collectibles
- Intellectual property

## Protocol Architecture

### Contract Layer

| Component       | Description                    | Key Features                                             |
| --------------- | ------------------------------ | -------------------------------------------------------- |
| MarketPlace.sol | NFT listing and trading engine | Listing management, purchases, ownership tracking        |
| Token.sol       | ERC20 utility token            | Minter role access, supply controls, burn                |
| TokenShop.sol   | Token-to-ETH swap path         | Chainlink ETH/USD feed integration, minting, withdrawals |

### Data Layer

- NFT metadata on IPFS/Arweave with on-chain references
- Ownership history tracked in contract state
- Chainlink AggregatorV3Interface used for live pricing data

### Interface Layer

- Vintage industrial UI with grayscale-to-color transitions
- On-chain activity signals and transaction context
- Live price signal surfaces

## Marketplace Features

### NFT Creation and Minting

Creators can mint NFTs by supplying:

- Asset name and description
- Metadata URI (IPFS recommended)
- Listing price in ETH
- Listing fee (0.001 ETH, governance-adjustable)

### Listing Management

- List asset for purchase
- Unlist asset without penalty
- Price update flow (future)

### Purchase Execution

1. Buyer submits ETH
2. Contract checks listing state and exact value requirements
3. Ownership transfers atomically
4. Settlement routes funds to seller
5. Provenance trail appends previous owner
6. Excess value is refunded when applicable

### Provenance Flow

`Genesis Owner -> Previous Owner 1 -> Previous Owner 2 -> Current Owner`

## Token Shop

### Purpose

The Token Shop acts as an on-ramp path for participants who need ETH for marketplace interactions.

### Chainlink Integration

- Network: Sepolia Testnet
- Oracle: ETH/USD Aggregator (`0x694AA1769357215DE4FAC081bf1f309aDC325306`)
- Staleness protection: max age validation before quote usage

### Swap Mechanism

`User sends supported token -> TokenShop fetches oracle price -> ETH amount is computed -> ETH sent to user`

### Token Economics

- Utility token: MTK (MyToken)
- Max supply: 100,000,000 MTK
- Initial supply: 100,000 MTK
- Reference value: 2.00 USD per MTK (oracle-linked)

Primary utility targets:

- Gas abstraction on target network
- Governance (future)
- Fee discounting
- Premium feature access

## Security Architecture

### Reentrancy Protection

Value-transfer logic uses OpenZeppelin ReentrancyGuard patterns.

### Access Control

- Owner: admin operations and withdrawals
- MINTER_ROLE: mint privileges (TokenShop)
- DEFAULT_ADMIN_ROLE: role management

### Oracle Safety

- Round completeness checks
- Staleness checks
- Positive value checks

### Funds Safety

- Marketplace fees and swap liquidity separated
- Restricted withdrawals
- Overpayment refund logic

## Technical Specifications

### Contracts

| Contract        | Solidity | Key Functions                                  | Dependencies                               |
| --------------- | -------- | ---------------------------------------------- | ------------------------------------------ |
| MarketPlace.sol | ^0.8.24  | mintNFT, listNFT, buyNFT, withdrawFees         | ERC721URIStorage, Ownable, ReentrancyGuard |
| Token.sol       | ^0.8.24  | mintToken, burn                                | ERC20, Ownable                             |
| TokenShop.sol   | ^0.8.24  | amountToMint, getChainlinkDataFeedLatestAnswer | AggregatorV3Interface, Ownable             |

### Chainlink Integration Example

```solidity
AggregatorV3Interface internal immutable i_priceFeed;
// ETH/USD feed returns price with 8 decimals
// (ethAmount * ethUsdPrice) / 1e18 => USD notional
```

### Gas Optimization Notes

- Storage packing where feasible
- Efficient array updates (swap-and-pop patterns)
- View-heavy read paths for UI

## Roadmap

### Phase 1: Foundation (completed)

- Core contract development and tests
- Marketplace baseline features
- Chainlink integration
- Initial UI
- Sepolia deployment

### Phase 2: Expansion (Q2-Q3 2026)

- Collection management and royalty primitives
- Advanced search and filtering
- Analytics dashboard
- Bulk operations
- Mobile UX hardening

### Phase 3: Enhancement (Q4 2026)

- SKALE Titan Hub mainnet deployment
- Multi-token support (for example USDC, DAI)
- Lazy minting
- Auction mechanisms
- Bundled sales

### Phase 4: Ecosystem (2027+)

- Governance DAO
- Creator royalty automation
- Cross-chain interoperability
- Provenance graph visualization
- Fractionalization support

## Tokenomics

### MTK Utility

| Use Case          | Description                            | Value Driver              |
| ----------------- | -------------------------------------- | ------------------------- |
| Gas abstraction   | Network transaction support            | Activity increases demand |
| Listing discounts | Marketplace fee reduction              | Volume increases utility  |
| Governance        | Parameter voting                       | Community alignment       |
| Premium features  | Enhanced analytics and listing options | Feature adoption          |

### Fee Structure

| Transaction Type | Fee        | Recipient            | Notes                           |
| ---------------- | ---------- | -------------------- | ------------------------------- |
| NFT minting      | 0.001 ETH  | Marketplace treasury | Operational cost coverage       |
| Token swap       | 0% (intro) | N/A                  | Governance-controlled in future |
| Secondary sales  | TBD        | Creator royalties    | Planned phase 4 item            |

## Testnet Deployment

| Contract    | Address | Explorer  |
| ----------- | ------- | --------- |
| MarketPlace | TBD     | Etherscan |
| Token (MTK) | TBD     | Etherscan |
| TokenShop   | TBD     | Etherscan |

Chainlink feed (ETH/USD): `0x694AA1769357215DE4FAC081bf1f309aDC325306`

## Getting Started

### For Creators

1. Connect wallet (MetaMask, WalletConnect, or compatible)
2. Open Marketplace and create NFT
3. Upload metadata and set pricing
4. Pay listing fee
5. Manage listings from your collection views

### For Collectors

1. Browse and filter listed assets
2. Inspect provenance and owner details
3. Purchase with ETH or acquire funds through Token Shop
4. Track acquired assets in your collection

### For Traders

1. Use Token Shop for swap flow
2. Monitor oracle-based price signals
3. Use analytics surfaces for decision support

## Audits and Assurance

Third-party audit publication is planned before production mainnet release. Internal testing follows OpenZeppelin best practices and continuous hardhat test execution.

## Contributing

Contributions are welcome:

- Open issues for bugs
- Propose features
- Improve docs and tooling
- Build protocol integrations and custom interfaces

## License

MIT License

## Contact and Resources

- Documentation: https://docs.thebazaar.xyz
- GitHub: https://github.com/thebazaar/protocol
- Twitter/X: https://x.com/TheBazaarMarket
- Discord: https://discord.gg/thebazaar

Version 1.0.4

Last updated: April 2026
