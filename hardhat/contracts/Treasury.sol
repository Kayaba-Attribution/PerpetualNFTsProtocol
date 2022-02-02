//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./Interfaces.sol";

contract Treasury is Ownable {
  IWETHGateway WETHGateway;
  address LendingPoolAddressesProviderAddress;
  IAToken aMATIC;

  // mumbai
  // _WETHGateway 0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA
  // lendingPool 0x178113104fEcbcD7fF8669a0150721e231F0FD4B
  // aMATIC 0xF45444171435d0aCB08a8af493837eF18e86EE27

  // main net;
  // WETHGATEWAY 0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97
  // lendingPool 0xd05e3E715d945B59290df0ae8eF85c1BdB684744
  // aMATIC 0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4
  constructor(address _WETHGateway, address _LendingPoolAddressesProviderAddress, address _aMATIC) {
    WETHGateway = IWETHGateway(_WETHGateway);
    LendingPoolAddressesProviderAddress = _LendingPoolAddressesProviderAddress;
    aMATIC = IAToken(_aMATIC);
  }

  function release(address releaser, uint256 nftTokenValue) external onlyOwner {
    uint256 _releaseValue = nftTokenValue * 90 / 100;
    
    Address.sendValue(payable(releaser), _releaseValue);
  }

  function sendMoney(address user, uint256 amount) public onlyOwner {
    Address.sendValue(payable(user), amount);
  }

  function depositAAVE() public payable {
    address _lendingPool = ILendingPoolAddressesProvider(
        LendingPoolAddressesProviderAddress
    ).getLendingPool();

    WETHGateway.depositETH{value: msg.value }(
        _lendingPool,
        address(this),
        0
    );
  }

  function withdrawAAVE() public payable {
    IAToken(aMATIC).approve(address(WETHGateway), WMATICbalance());
    address _lendingPool = ILendingPoolAddressesProvider(
        LendingPoolAddressesProviderAddress
    ).getLendingPool();

    WETHGateway.withdrawETH(
        _lendingPool,
        WMATICbalance(),
        address(this)
    );
  }

  function seeLendingPool() public view returns (address){
      return ILendingPoolAddressesProvider(LendingPoolAddressesProviderAddress).getLendingPool();
  }
  function WMATICbalance() public view returns(uint256){
      return aMATIC.balanceOf(address(this));
  }

  receive() external payable {}
}