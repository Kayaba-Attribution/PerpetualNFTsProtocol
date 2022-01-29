//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "./NFT.sol";
import "./Treasury.sol";

contract Museum is Ownable, IERC721Receiver {

  MyToken public nftToken;
  Treasury public treasury;

  // each nft is 1 ether so everytime a user deposits one nft supply adds 1
  mapping(address => uint256) public collateralAmount;

  // Save User NFT _id
  mapping(uint256 => address) public collateralNFTOwner;

  event Deposit(address owner, uint256 tokenId);
  constructor(address _nftToken, address payable _treasury) {
    nftToken = MyToken(_nftToken);
    treasury = Treasury(_treasury);
  }

  function deposit(uint256 _id) external {
    nftToken.transferFrom(msg.sender, address(this), _id);

    collateralAmount[msg.sender] += nftToken.nftValue();
    collateralNFTOwner[_id] = msg.sender;
    
    emit Deposit(msg.sender, _id);
  }

  function withdraw(uint256 _id) external {
    require(collateralNFTOwner[_id] == msg.sender, "you are not the owner");

    collateralAmount[msg.sender] -= nftToken.nftValue();
    delete collateralNFTOwner[_id];
    
    nftToken.transferFrom(address(this), msg.sender, _id);
  }

  function release(uint256 _id) external {
    require(collateralNFTOwner[_id] == msg.sender, "you are not the owner");

    collateralAmount[msg.sender] -= nftToken.nftValue();
    delete collateralNFTOwner[_id];
    
    treasury.release(msg.sender, nftToken.nftValue());
  }

  // recibe() payable {}
  function onERC721Received(
      address,
      address from,
      uint256,
      bytes calldata
  ) external pure override returns (bytes4) {
    return IERC721Receiver.onERC721Received.selector;
  }
}