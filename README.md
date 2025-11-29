# NFT Collectible Project

A complete full-stack NFT marketplace solution with smart contracts built on Ethereum and a modern React frontend. This project enables users to mint, manage, and trade NFTs with royalty support.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Testing](#testing)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Smart Contract (`NFTCollectible.sol`)
- **ERC721 Standard Compliant**: Full implementation of the ERC721 NFT standard with URI storage support
- **Minting**: Users can mint new NFTs with custom metadata URIs
- **Royalty Support**: Implements ERC2981 royalty standard with 5% automatic royalties to contract owner
- **Marketplace Integration**: Built-in support for marketplace contracts with automatic approval
- **Ownable**: Owner-only administrative functions for managing marketplace addresses
- **Event Logging**: Emits events for minting and marketplace updates for better tracking

### Frontend
- **Web3 Wallet Integration**: Connect via MetaMask or WalletConnect
- **React + Vite**: Modern, fast development experience with Vite bundler
- **Wagmi & Ethers.js**: Robust web3 libraries for blockchain interaction
- **React Query**: Efficient data fetching and caching
- **Multi-chain Support**: Built for Mainnet and Sepolia testnet

## 📁 Project Structure

```
nft-project/
├── contracts/
│   └── NFTCollectible.sol          # Main ERC721 smart contract
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main application component
│   │   ├── abi/
│   │   │   └── NFTCollectible.json # Contract ABI for frontend
│   │   ├── App.css                 # Application styles
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # React entry point
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── eslint.config.js            # ESLint rules
├── scripts/                        # Deployment and utility scripts
├── test/
│   └── NFTCollectible.js           # Smart contract tests
├── artifacts/                      # Compiled contract artifacts
├── cache/                          # Hardhat cache
├── hardhat.config.js               # Hardhat configuration
└── package.json                    # Backend dependencies
```

## 🛠 Tech Stack

### Smart Contracts
- **Solidity**: ^0.8.24
- **OpenZeppelin Contracts**: ^4.5.0 (ERC721, Ownable, utilities)
- **Hardhat**: ^2.27.1 (development environment and testing framework)

### Frontend
- **React**: ^19.2.0 (UI framework)
- **Vite**: ^7.2.4 (build tool and development server)
- **Wagmi**: ^3.0.2 (React hooks for Ethereum)
- **Ethers.js**: ^6.15.0 (blockchain interaction)
- **React Query**: ^5.59.14 (data fetching and caching)
- **Viem**: ^2.40.3 (Ethereum utilities)

### Testing & Development
- **Chai**: ^4.5.0 (assertion library)
- **Mocha**: (via Hardhat)
- **TypeChain**: ^8.3.2 (TypeScript bindings for contracts)
- **ESLint**: ^9.39.1 (code quality)

## 📦 Prerequisites

Before you begin, ensure you have installed:
- **Node.js**: v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**: Package manager (comes with Node.js)
- **Git**: Version control ([Download](https://git-scm.com/))
- **MetaMask**: Browser wallet extension ([Download](https://metamask.io/))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HamzaBett/nft-project.git
cd nft-project
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Wallet Configuration
PRIVATE_KEY=your_private_key_here

# RPC Endpoints (optional for custom RPC)
MAINNET_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
SEPOLIA_RPC_URL=https://eth-sepolia.alchemyapi.io/v2/your-api-key

# Block Explorer API (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 📝 Smart Contract

### Contract Overview

The `NFTCollectible` contract is an ERC721-compliant NFT collection with enhanced features:

```solidity
contract NFTCollectible is ERC721URIStorage, Ownable, IERC2981
```

### Key Functions

#### `mint(string memory uri) -> uint256`
Mints a new NFT with the specified metadata URI.

```javascript
const tokenId = await contract.mint("https://ipfs.io/ipfs/QmHash");
```

**Parameters:**
- `uri` (string): IPFS or HTTP URI pointing to the NFT metadata

**Returns:**
- `tokenId` (uint256): The ID of the newly minted NFT

**Emits:** `Minted` event

#### `setMarketplaceAddress(address _marketplace)`
Sets the marketplace address that can transfer tokens without approval (owner only).

```javascript
await contract.setMarketplaceAddress("0x...");
```

#### `royaltyInfo(uint256, uint256 salePrice) -> (address, uint256)`
Returns royalty information for ERC2981 support (5% royalties).

```javascript
const [receiver, royaltyAmount] = await contract.royaltyInfo(tokenId, 1000n);
```

#### `totalSupply() -> uint256`
Returns the total number of NFTs minted.

```javascript
const total = await contract.totalSupply();
```

### Key Features

- **Token URI Storage**: Each NFT can have a unique URI pointing to metadata
- **Royalty Support**: 5% (500 basis points) automatic royalties to contract owner
- **Marketplace Integration**: Approve marketplace contracts to transfer tokens
- **Sequential Token IDs**: Tokens are minted with sequential IDs starting from 0

## 🎨 Frontend

### App Structure

The React frontend (`App.jsx`) includes:

- **Wallet Connection**: Connect and disconnect Web3 wallets
- **Mint Interface**: Form to mint new NFTs
- **NFT Gallery**: Display minted NFTs
- **Account Management**: Show connected account and network

### Key Components

- **Wallet Integration**: Uses Wagmi for wallet connection via MetaMask or WalletConnect
- **Contract Interaction**: Ethers.js for reading and writing to the smart contract
- **Responsive Design**: Mobile-friendly interface with Vite + React

### Running the Frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
cd frontend
npm run build
```

Output will be in the `frontend/dist` directory.

## 🧪 Testing

The project includes comprehensive tests for the smart contract using Hardhat and Chai.

### Run All Tests

```bash
npm test
```

### Test Coverage

The test suite (`test/NFTCollectible.js`) covers:

#### Deployment Tests
- ✓ Sets the right owner
- ✓ Has correct name and symbol

#### Minting Tests
- ✓ Mints tokens with correct URI
- ✓ Increments token ID sequentially

#### Advanced Tests
- Royalty calculations
- Marketplace approval
- Event emission
- Access control

### View Test Output

```bash
npm test -- --reporter spec
```

### Gas Report

Run tests with gas reporting:

```bash
REPORT_GAS=true npm test
```

## 🌐 Deployment

### 1. Compile Smart Contracts

```bash
npx hardhat compile
```

This generates the ABI and artifacts in the `artifacts/` directory.

### 2. Deploy to Testnet (Sepolia)

Create a deployment script in `scripts/deploy.js`:

```javascript
async function main() {
  const NFTCollectible = await ethers.getContractFactory("NFTCollectible");
  const nft = await NFTCollectible.deploy();
  await nft.waitForDeployment();
  console.log("NFTCollectible deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Then deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Update Frontend Contract Address

Update the contract address in `frontend/src/App.jsx`:

```javascript
const contractAddress = "0x..."; // Your deployed contract address
```

### 4. Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### 5. Deploy Frontend

Deploy to any hosting service (Vercel, Netlify, GitHub Pages, etc.):

```bash
cd frontend
npm run build
# Upload the dist/ folder to your hosting provider
```

## 💻 Usage

### Local Development

1. **Start Hardhat Local Network**:
   ```bash
   npx hardhat node
   ```

2. **Deploy to Local Network** (in another terminal):
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Start Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Connect MetaMask**:
   - Add local network: `http://127.0.0.1:8545` (Chain ID: 31337)
   - Import test account from Hardhat output

### Minting an NFT

1. Connect your wallet
2. Prepare metadata JSON file on IPFS (e.g., using [pinata.cloud](https://pinata.cloud))
3. Enter the metadata URI in the mint form
4. Approve the transaction in your wallet
5. Your NFT will appear in your collection

### Metadata Format

NFT metadata should follow the ERC721 metadata standard:

```json
{
  "name": "My NFT",
  "description": "A beautiful NFT",
  "image": "https://ipfs.io/ipfs/QmImageHash",
  "attributes": [
    {
      "trait_type": "Color",
      "value": "Blue"
    }
  ]
}
```

## 📚 Additional Resources

- [OpenZeppelin Contracts Documentation](https://docs.openzeppelin.com/)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [React Documentation](https://react.dev/)
- [ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [ERC2981 Royalties](https://eips.ethereum.org/EIPS/eip-2981)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Guidelines

- Follow Solidity best practices and OpenZeppelin patterns
- Write tests for new smart contract features
- Use ESLint for frontend code quality
- Add comments for complex logic
- Update this README with new features

## 📄 License

This project is licensed under the ISC License. See the LICENSE file for details.

## ⚠️ Disclaimer

This is a sample project for educational purposes. Before deploying to mainnet:

- Conduct thorough security audits
- Test extensively on testnet
- Consider third-party security reviews
- Never share your private keys or seed phrases
- Use hardware wallets for production deployments

## 📧 Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact: [@HamzaBett](https://github.com/HamzaBett)

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for battle-tested smart contract libraries
- [Hardhat](https://hardhat.org/) team for excellent development tools
- [React](https://react.dev/) and [Wagmi](https://wagmi.sh/) communities
- All contributors and testers

---

**Happy NFT building! 🚀**
