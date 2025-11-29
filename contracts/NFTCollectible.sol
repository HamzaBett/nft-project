// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract NFTCollectible is ERC721URIStorage, Ownable, IERC2981 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    // 5% royalty basis points (500/10000 = 5%)
    uint256 public constant ROYALTY_BPS = 500;
    
    // Marketplace address that can transfer tokens without approval
    address public marketplaceAddress;

    event Minted(address indexed minter, uint256 tokenId, string tokenURI);
    event MarketplaceUpdated(address indexed newMarketplace);

    constructor() ERC721("NFTCollectible", "NFTC") Ownable() {}

    /**
     * @dev Mint a new NFT with given token URI
     */
    function mint(string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit Minted(msg.sender, tokenId, uri);
        return tokenId;
    }

    /**
     * @dev Set marketplace address to enable automatic approval for all
     */
    function setMarketplaceAddress(address _marketplace) external onlyOwner {
        marketplaceAddress = _marketplace;
        emit MarketplaceUpdated(_marketplace);
    }

    /**
     * @dev Override to allow marketplace to transfer tokens without approval
     */
    function isApprovedForAll(address owner, address operator) 
        public 
        view 
        override 
        returns (bool) 
    {
        if (operator == marketplaceAddress) {
            return true;
        }
        return super.isApprovedForAll(owner, operator);
    }

    /**
     * @dev See {IERC2981-royaltyInfo}.
     */
    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        return (owner(), (salePrice * ROYALTY_BPS) / 10000);
    }

    /**
     * @dev Returns the total number of NFTs minted so far
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // Support interfaces (ERC165)
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, IERC165)
        returns (bool)
    {
        return 
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
