//SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketPlace is ERC721URIStorage, Ownable, ReentrancyGuard {
  uint256 public constant MAX_SUPPLY = 1000000;
  uint256 public constant listingPrice = 0.001 ether;
  bytes32 public constant DEFAULT_ADMIN_ROLE = keccak256("DEFAULT_ADMIN_ROLE");

  struct NFT_RWA {
    uint256 tokenId;
    string name;
    string description;
    string tokenURI;
    address payable owner;
    uint256 price;
    bool isListed;
    address[] previousOwners;
  }

  mapping(uint256 => NFT_RWA) public nftObject;
  mapping(address => uint256[]) public ownerNFTs;

  NFT_RWA[] public allNFTs;

  event NFTMinted(uint256 indexed tokenId, string name, string description, string tokenURI, uint256 price, address indexed owner);
  event NFTListed(uint256 indexed tokenId, uint256 price, address indexed owner);
  event NFTUnlisted(uint256 indexed tokenId, address indexed owner);
  event PURCHASE_SUCCESS(uint256 indexed tokenId, string name, string description, string tokenURI, uint256 price, address indexed buyer);
  event NFTBought(uint256 indexed tokenId, address indexed buyer, uint256 price);

  constructor() ERC721("MKT_TOKEN", "MKTPTKN") Ownable(msg.sender) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  //function to mint a new NFT representing a real-world asset
  function mintNFT(
        string memory _name,
        string memory _description,
        string memory _tokenURI,
        uint256 _price
    ) public payable returns (uint256) {
        require(totalSupply() + 1 <= MAX_SUPPLY, "Max supply reached");
        require(msg.value >= listingPrice, "Listing price required");
        require(_price > 0, "Price must be > 0");
        
        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        nftObject[tokenId] = NFT_RWA({
            tokenId: tokenId,
            name: _name,
            description: _description,
            owner: payable(msg.sender),
            price: _price,
            isListed: false,
            previousOwners: new address[](0)
        });
        
        ownerNFTs[msg.sender].push(tokenId);
        
        emit NFTMinted(tokenId, _name, _price, msg.sender);
        return tokenId;
    }

  //function to list an NFT for sale
  function listNFT(uint256 _tokenId) public returns (bool) {
    require(ownerOf(_tokenId) == msg.sender, "Only the owner can list the NFT");
    require(nftObject[_tokenId].price > 0, "Price must be greater than zero");
    NFT_RWA storage nft = nftObject[_tokenId];
    require(!nft.isListed, "NFT is already listed");

    nft.isListed = true;
    _syncAllNFT(_tokenId);
    emit NFTListed(_tokenId, nft.price, msg.sender);
    return true;
  }

  //function to unlist an NFT
  function unlistNFT(uint256 _tokenId) public returns (bool) {
    require(ownerOf(_tokenId) == msg.sender, "Only the owner can unlist the NFT");
    NFT_RWA storage nft = nftObject[_tokenId];
    require(nft.isListed, "NFT is not listed");

    nft.isListed = false;
    _syncAllNFT(_tokenId);
    emit NFTUnlisted(_tokenId, msg.sender);
    return true;
  }

  //function to buy a listed NFT
      function buyNFT(uint256 _tokenId) public payable nonReentrant {
        NFT_RWA storage nft = nftObject[_tokenId];
        require(nft.isListed, "Not listed");
        require(msg.value >= nft.price, "Insufficient funds");
        
        address payable seller = nft.owner;
        uint256 price = nft.price;
        
        // Update state
        nft.owner = payable(msg.sender);
        nft.isListed = false;
        nft.previousOwners.push(seller);
        
        _transfer(seller, msg.sender, _tokenId);
        _removeOwnedToken(seller, _tokenId);
        ownerNFTs[msg.sender].push(_tokenId);
        
        // Transfer funds
        (bool success, ) = seller.call{value: price}("");
        require(success, "Transfer failed");
        
        if (msg.value > price) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit NFTBought(_tokenId, msg.sender, price);
    }
    
    function withdrawFees() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

  //function to get all listed NFTs
  function getListedNFTs() public view returns (NFT_RWA[] memory) {
    uint256 listedCount = 0;
    for (uint256 i = 1; i <= totalSupply(); i++) {
      if (nftObject[i].isListed) {
        listedCount++;
      }
    }

    NFT_RWA[] memory listedNFTs = new NFT_RWA[](listedCount);
    uint256 currentIndex = 0;

    for (uint256 i = 1; i <= totalSupply(); i++) {
      if (nftObject[i].isListed) {
        listedNFTs[currentIndex] = nftObject[i];
        currentIndex++;
      }
    }

    return listedNFTs;
  }

  //function to get NFTs owned by a specific address
  function getNFTsByOwner(address _owner) public view returns (NFT_RWA[] memory) {
    uint256 ownedCount = 0;

    for (uint256 i = 1; i <= totalSupply(); i++) {
      if (ownerOf(i) == _owner) {
        ownedCount++;
      }
    }

    NFT_RWA[] memory nfts = new NFT_RWA[](ownedCount);
    uint256 currentIndex = 0;

    for (uint256 i = 1; i <= totalSupply(); i++) {
      if (ownerOf(i) == _owner) {
        nfts[currentIndex] = nftObject[i];
        currentIndex++;
      }
    }

    return nfts;
  }

  //function to get all NFTs in the marketplace
  function getAllNFTs() public view returns (NFT_RWA[] memory) {
    NFT_RWA[] memory nfts = new NFT_RWA[](totalSupply());

    for (uint256 i = 1; i <= totalSupply(); i++) {
      nfts[i - 1] = nftObject[i];
    }

    return nfts;
  }

    
    function _removeOwnedToken(address _owner, uint256 _tokenId) internal {
        uint256[] storage tokens = ownerNFTs[_owner];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == _tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

  function _syncAllNFT(uint256 _tokenId) internal {
    for (uint256 i = 0; i < allNFTs.length; i++) {
      if (allNFTs[i].tokenId == _tokenId) {
        allNFTs[i] = nftObject[_tokenId];
        break;
      }
    }
  }
    
}