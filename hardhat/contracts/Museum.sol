//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./NFT.sol";
import "./Treasury.sol";


contract Museum is Ownable, IERC721Receiver {
  MyToken public nftToken;
  Treasury public treasury;

  // each nft is 1 ether so everytime a user deposits one nft supply adds 1
  mapping(address => uint256) public collateralAmount;

  // Save User NFT _id
  mapping(uint256 => address) public collateralNFTOwner;
  mapping(address => uint256[]) public collateralNFT;

  mapping(address => uint256) public borrowed;
  mapping(address => uint256) public borrowedTime;

  event Deposit(address owner, uint256 tokenId);
  event Borrow(address owner, uint256 amount);
  event Repay(address owner, uint256 amount);
  event Liquidate(address owner, address liquidator, uint256 tokenid);

  modifier updateDebt() {
    // debt update
    borrowed[msg.sender] += currentDebt(msg.sender);
    // TODO: revisar por que se pirde que la obrta aumente su valor
    borrowedTime[msg.sender] = block.timestamp;

    _;
  }

  constructor(address _nftToken, address payable _treasury) {
    nftToken = MyToken(_nftToken);
    treasury = Treasury(_treasury);
  }

  function deposit(uint256 _id) external {
    nftToken.transferFrom(msg.sender, address(this), _id);

    collateralAmount[msg.sender] += nftToken.nftValue();
    collateralNFTOwner[_id] = msg.sender;
    collateralNFT[msg.sender].push(_id);
    
    emit Deposit(msg.sender, _id);
  }


  // user cant borrow more than 50% of its collateral
  function maxBorrow(address user) public view returns(uint256) {
    return (collateralAmount[user] / 2) - borrowed[user] - currentDebt(msg.sender);
  }

  function totalDebt(address user) public view returns(uint256) {
    return borrowed[user] + currentDebt(user);
  }


  function currentDebt(address user) public view returns(uint256) {

    uint256 deltaT = (block.timestamp - borrowedTime[user]);
    // 10000 = 10% yearly
    // 100000 = 100%

    return (borrowed[user] * deltaT * 10000) / (365*24*60*60 * 100000);
  }
  
  function liquidate(address user) external {
    require(healthFactor(user) < 6000, "user is safe");

    for(uint i = 0; i < collateralNFT[user].length; i++) {
      emit Liquidate(user, msg.sender, collateralNFT[user][i]);
      delete collateralNFTOwner[collateralNFT[user][i]];
    }
    delete collateralNFT[user];
    delete collateralAmount[msg.sender];
    
    delete borrowed[user];
    delete borrowedTime[user];

    // rewards for liquidation!
    //treasury.sendMoney(msg.sender, 0.1 ether);

    //AAVE changes
    treasury.withdrawAAVE(msg.sender, 0.1 ether);
  }

  function borrow(uint256 amount) external updateDebt {

    require(amount <= maxBorrow(msg.sender), "You cant borrow more than");

    borrowed[msg.sender] += amount;

    treasury.withdrawAAVE(msg.sender, amount);
    // treasury.borrowAAVE(msg.sender, amount);

    emit Borrow(msg.sender, amount);
  }


  function repay() external payable updateDebt{
    if(borrowed[msg.sender] < msg.value) {
      emit Repay(msg.sender, borrowed[msg.sender]);
      uint256 _changeBack = msg.value - borrowed[msg.sender];
      //borrowed[msg.sender] = 0;
      // devuelve el dinero
      Address.sendValue(payable(msg.sender), _changeBack);

      // AAVE changes
      // manda el dinero
      treasury.depositAAVE{value: borrowed[msg.sender]}();
      // borra la deuda
      borrowed[msg.sender] = 0;

    } else {
      borrowed[msg.sender] -= msg.value;

      //AAVE changes
      treasury.depositAAVE{value: msg.value}();

      /*
      valor individual = msg.value / obras de colateral
      por cada obra que tengas:
        obra.valor+= valor individual
      totalcolateral += msg.value
      */

      emit Repay(msg.sender, msg.value);
    }
  }
  
  function withdraw(uint256 _id) external {
    require(collateralNFTOwner[_id] == msg.sender, "you are not the owner");

    collateralAmount[msg.sender] -= nftToken.nftValue();
    require(healthFactor(msg.sender) < 6000, "unsafe collateral ratio");
    delete collateralNFTOwner[_id];
    
    nftEnumRemove(msg.sender, _id);
    
    nftToken.transferFrom(address(this), msg.sender, _id);
  }


  function release(uint256 _id) external updateDebt {
    require(collateralNFTOwner[_id] == msg.sender, "you are not the owner");

    collateralAmount[msg.sender] -= nftToken.nftValue();
    require(healthFactor(msg.sender) < 6000, "unsafe collateral ratio");
    nftEnumRemove(msg.sender, _id);

    delete collateralNFTOwner[_id];
    
    treasury.release(msg.sender, nftToken.nftValue());
  }

  // devuelve el healthFacto del usuario (0 -> 10000):(0 -> 100%)
  function healthFactor(address user) public returns(uint256) {
    if(totalDebt(msg.sender) == 0) {
      return 0;
    }
    if(collateralAmount[msg.sender] == 0) {
      return 10000;
    }
    

    return totalDebt(msg.sender) * 10000 / collateralAmount[msg.sender];
  }

  function nftEnumRemove(address user, uint256 _id) internal {
    uint256[] memory _nfts;

    //uint256 j = 0;

    for (uint i = 0; i < collateralNFT[user].length; i+=1) {
      if (collateralNFT[user][i] != _id) {
        _nfts[_nfts.length] = _id;
        //j+=1;
      }
    }
    collateralNFT[user] = _nfts;
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