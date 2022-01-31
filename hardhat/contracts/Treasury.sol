//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {

  function release(address releaser, uint256 nftTokenValue) external onlyOwner {
    uint256 _releaseValue = nftTokenValue * 90 / 100;
    
    sendMoney(releaser, _releaseValue);
  }

  function sendMoney(address user, uint256 amount) public onlyOwner {
    (bool success, ) = payable(user).call{value: amount }("");
    require(success, "transfer fail");
  }

  receive() external payable {}
}