//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./Interfaces.sol";

contract AAVETEST is Ownable {
  IWETHGateway WETHGateway;
  address LendingPoolAddressesProviderAddress;
  IAToken aMATIC;
  IMATIC wMATIC;

  // mumbai
  // _WETHGateway 0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA
  // lendingPool 0x178113104fEcbcD7fF8669a0150721e231F0FD4B
  // aMATIC 0xF45444171435d0aCB08a8af493837eF18e86EE27

  // main net;
  // WETHGATEWAY 0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97
  // lendingPool 0xd05e3E715d945B59290df0ae8eF85c1BdB684744
  // aMATIC 0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4
  constructor(address _WETHGateway, address _LendingPoolAddressesProviderAddress, address _aMATIC, address _wMATIC) {
    WETHGateway = IWETHGateway(_WETHGateway);
    LendingPoolAddressesProviderAddress = _LendingPoolAddressesProviderAddress;
    aMATIC = IAToken(_aMATIC);
    wMATIC = IMATIC(_wMATIC);
    IAToken(aMATIC).approve(address(WETHGateway), type(uint).max);
    IAToken(aMATIC).approve(address(this), type(uint).max);
    IMATIC(_wMATIC).approve(address(this), type(uint).max);
  }
  function withdrawAAVE(uint _amount, address user) public payable {
    IAToken(aMATIC).approve(address(WETHGateway), _amount);
    address _lendingPool = ILendingPoolAddressesProvider(
        LendingPoolAddressesProviderAddress
    ).getLendingPool();

    // 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 WMATIC address
    ILendingPool(_lendingPool).withdraw(
        address(wMATIC),
        _amount,
        address(this)
        );
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

  function wrapMATIC() public payable {
      wMATIC.deposit{value: msg.value}();
  }

  function unwrapMATIC(uint _amount) public {
      wMATIC.transfer(address(this),_amount);
      wMATIC.withdraw(_amount);
  }



  function seeLendingPool() public view returns (address){
      return ILendingPoolAddressesProvider(LendingPoolAddressesProviderAddress).getLendingPool();
  }

  function aMATICbalance(address _addr) public view returns(uint256){
      return aMATIC.balanceOf(_addr);
  }

  function wMATICbalance(address _addr) public view returns(uint256){
      return wMATIC.balanceOf(_addr);
  }

  function maticBalanceContract() public view returns(uint){
      return address(this).balance;
  }

  function maticBalanceAddress(address _addr) public view returns(uint){
      return _addr.balance;
  }

  receive() external payable {
    //depositAAVE();
  }
}