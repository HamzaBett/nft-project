import { useState, useEffect } from 'react';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

// Import contract ABI and address
import contractABI from './abi/NFTCollectible.json';
import { ethers } from 'ethers';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [isMinting, setIsMinting] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [message, setMessage] = useState('');

  // Contract configuration
  const contractAddress = "DEPLOYED_CONTRACT_ADDRESS";

  useEffect(() => {
    // Check if user is already connected
    checkIfWalletIsConnected();
    
    // Initialize provider and contract
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(nftContract);
      }
    };
    
    initProvider();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setCurrentAccount(accounts[0]);
        
        // Initialize contract with signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(nftContract);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setMessage('Failed to connect wallet');
      }
    } else {
      setMessage('Please install MetaMask!');
    }
  };

  const mintNFT = async () => {
    if (!contract || !ipfsUrl.trim()) return;
    
    try {
      setIsMinting(true);
      setMessage('Minting in progress...');
      
      const tx = await contract.mint(ipfsUrl.trim());
      setMessage('Transaction submitted! Waiting for confirmation...');
      
      await tx.wait();
      setMessage('NFT minted successfully!');
      
      // Refresh NFTs
      fetchUserNFTs();
      setIpfsUrl('');
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMessage(`Minting failed: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  const fetchUserNFTs = async () => {
    if (!contract || !currentAccount) return;
    
    try {
      const tokenCount = await contract.balanceOf(currentAccount);
      const userNFTs = [];
      
      for (let i = 0; i < tokenCount; i++) {
        const tokenIndex = await contract.tokenOfOwnerByIndex(currentAccount, i);
        const tokenId = tokenIndex.toString();
        const tokenURI = await contract.tokenURI(tokenId);
        
        // Fetch metadata from IPFS
        let metadata = null;
        if (tokenURI) {
          try {
            const response = await fetch(tokenURI);
            metadata = await response.json();
          } catch (error) {
            console.error(`Error fetching metadata for token ${tokenId}:`, error);
          }
        }
        
        userNFTs.push({
          tokenId,
          tokenURI,
          metadata
        });
      }
      
      setNfts(userNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setMessage('Failed to fetch your NFTs');
    }
  };

  useEffect(() => {
    if (currentAccount && contract) {
      fetchUserNFTs();
    }
  }, [currentAccount, contract]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              NFT Collectible Marketplace
            </h1>
            
            {!currentAccount ? (
              <div className="text-center">
                <p className="mb-6 text-gray-600">
                  Connect your wallet to start minting and viewing your NFTs
                </p>
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Mint New NFT</h2>
                  <p className="text-gray-600 mb-4">
                    Enter the IPFS URL of your NFT metadata JSON file
                  </p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={ipfsUrl}
                      onChange={(e) => setIpfsUrl(e.target.value)}
                      placeholder="https://ipfs.io/ipfs/Qm..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={mintNFT}
                      disabled={isMinting || !ipfsUrl.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      {isMinting ? 'Minting...' : 'Mint NFT'}
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${message.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Your NFT Collection ({nfts.length})</h2>
                  {nfts.length === 0 ? (
                    <p className="text-gray-600">You don't have any NFTs yet. Mint your first one!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {nfts.map((nft) => (
                        <div key={nft.tokenId} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="p-4">
                            <h3 className="font-semibold text-lg">Token #{nft.tokenId}</h3>
                            {nft.metadata ? (
                              <div className="mt-2 space-y-2">
                                <p><strong>Name:</strong> {nft.metadata.name}</p>
                                <p><strong>Description:</strong> {nft.metadata.description}</p>
                                {nft.metadata.image && (
                                  <img 
                                    src={nft.metadata.image} 
                                    alt={nft.metadata.name}
                                    className="mt-2 w-full h-48 object-cover rounded"
                                  />
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-600">Metadata: {nft.tokenURI}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
