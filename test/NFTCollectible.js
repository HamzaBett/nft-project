import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";

import hre from "hardhat";
const { ethers } = hre;

describe("NFTCollectible", function () {
  let NFTCollectible;
  let nftContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    NFTCollectible = await ethers.getContractFactory("NFTCollectible");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    nftContract = await NFTCollectible.deploy();
    await nftContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftContract.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nftContract.name()).to.equal("NFTCollectible");
      expect(await nftContract.symbol()).to.equal("NFTC");
    });
  });

  describe("Minting", function () {
    it("Should mint tokens with correct URI", async function () {
      const tokenURI = "https://ipfs.io/ipfs/QmTest123";
      await nftContract.mint(tokenURI);
      
      expect(await nftContract.totalSupply()).to.equal(BigInt(1));
      expect(await nftContract.tokenURI(0)).to.equal(tokenURI);
      expect(await nftContract.ownerOf(0)).to.equal(owner.address);
    });

    it("Should increment token ID sequentially", async function () {
      const tokenURI1 = "https://ipfs.io/ipfs/QmTest123";
      const tokenURI2 = "https://ipfs.io/ipfs/QmTest456";
      
      await nftContract.mint(tokenURI1);
      await nftContract.mint(tokenURI2);
      
      expect(await nftContract.totalSupply()).to.equal(BigInt(2));
      expect(await nftContract.tokenURI(0)).to.equal(tokenURI1);
      expect(await nftContract.tokenURI(1)).to.equal(tokenURI2);
    });

    it("Should emit Minted event on mint", async function () {
      const tokenURI = "https://ipfs.io/ipfs/QmTest123";
      await expect(nftContract.mint(tokenURI)).to.emit(nftContract, "Minted");
    });
  });

  describe("Transfers and Approval", function () {
    let tokenURI;

    beforeEach(async function () {
      tokenURI = "https://ipfs.io/ipfs/QmTest123";
      await nftContract.mint(tokenURI);
    });

    it("Should transfer tokens correctly", async function () {
      await nftContract.transferFrom(owner.address, addr1.address, 0);
      expect(await nftContract.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should approve and transfer tokens", async function () {
      await nftContract.approve(addr1.address, 0);
      expect(await nftContract.getApproved(0)).to.equal(addr1.address);
      
      const addr1Contract = nftContract.connect(addr1);
      await addr1Contract.transferFrom(owner.address, addr1.address, 0);
      expect(await nftContract.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should allow marketplace to transfer without approval", async function () {
      const marketplaceAddress = addr2.address;
      await nftContract.setMarketplaceAddress(marketplaceAddress);
      
      const marketplaceContract = nftContract.connect(addr2);
      await marketplaceContract.transferFrom(owner.address, addr1.address, 0);
      expect(await nftContract.ownerOf(0)).to.equal(addr1.address);
    });
  });

  describe("Royalties (EIP-2981)", function () {
    const salePrice = 10000;

    it("Should return correct royalty amount and receiver", async function () {
      const expectedRoyalty = (salePrice * 500) / 10000; // 5%
      const [receiver, royaltyAmount] = await nftContract.royaltyInfo(0, salePrice);
      
      expect(receiver).to.equal(owner.address);
      expect(royaltyAmount).to.equal(BigInt(expectedRoyalty));
    });

    it("Should support EIP-2981 interface", async function () {
      const ierc2981InterfaceId = "0x2a55205a";
      expect(await nftContract.supportsInterface(ierc2981InterfaceId)).to.be.true;
    });
  });

  describe("Access Control", function () {
    it("Should restrict setMarketplaceAddress to owner", async function () {
      const nonOwnerContract = nftContract.connect(addr1);
      await expect(nonOwnerContract.setMarketplaceAddress(addr2.address)).to.be.reverted;
    });
  });
});
