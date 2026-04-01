# Getting Started

Welcome to The Bazaar documentation.

## Requirements

- Node.js 20+
- npm 10+
- Git
- Docker (optional, for container workflow)

## Clone The Repository

```bash
git clone https://github.com/peter-mwau/The_Bazaar.git
cd The_Bazaar
```

## Install Dependencies

```bash
npm install
```

## Run In Development

```bash
npm run dev
```

The app runs on the local Vite dev server (typically http://localhost:5173).

## Build For Production

```bash
npm run build
```

## Preview Production Build Locally

```bash
npm run preview
```

## Quick Product Walkthrough

1. Connect your wallet.
2. Open Marketplace.
3. Select an NFT card.
4. If owner: list or delist.
5. If listed by another owner: purchase from details panel.

## Docker: Pull And Run

If your image is already published to a registry, you can run the app without building locally.

### 1) Pull Image

```bash
docker pull pierremwau/the-bazaar:latest
```

### 2) Run Container

```bash
docker run --name the-bazaar -d -p 4173:4173 pierremwau/the-bazaar:latest
```

Then open http://localhost:4173.

## Docker: Build Locally (Optional)

If you prefer building from source:

```bash
docker build -t the-bazaar:local .
docker run --name the-bazaar-local -d -p 4173:4173 the-bazaar:local
```

## Troubleshooting

- If `npm install` fails, delete `node_modules` and `package-lock.json`, then retry.
- If port conflict occurs, change host port in `-p`, for example `-p 8080:4173`.
- If Docker image is private, authenticate first with `docker login`.

## Stack Overview

| Layer     | Tech              |
| --------- | ----------------- |
| Frontend  | React, Vite       |
| Contracts | Solidity, Hardhat |
| Web3      | thirdweb          |
