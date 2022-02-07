//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

/**
 * developed by Anon  https://github.com/eugenioclrc/
 * developed by Kayaba-Attribution https://github.com/Kayaba-Attribution
 *
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Interfaces.sol";

interface IWMATIC is IERC20{
  function deposit() external payable;

  function withdraw(uint256) external;
}

contract Treasury is Ownable {
  IWETHGateway WETHGateway;
  address LendingPoolAddressesProviderAddress;
  IAToken aMATIC;
  IWMATIC wMATIC;

  // mumbai
  // _WETHGateway 0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA
  // lendingPool 0x178113104fEcbcD7fF8669a0150721e231F0FD4B
  // aMATIC 0xF45444171435d0aCB08a8af493837eF18e86EE27

  // main net;
  // WETHGATEWAY 0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97
  // lendingPool 0xd05e3E715d945B59290df0ae8eF85c1BdB684744
  // aMATIC 0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4
  constructor(address _WETHGateway, address _LendingPoolAddressesProviderAddress, address _aMATIC /*, address _wMATIC */) {
    WETHGateway = IWETHGateway(_WETHGateway);
    LendingPoolAddressesProviderAddress = _LendingPoolAddressesProviderAddress;
    aMATIC = IAToken(_aMATIC);
    wMATIC = IWMATIC(WETHGateway.getWETHAddress());
    aMATIC.approve(address(WETHGateway), type(uint).max);
    aMATIC.approve(address(this), type(uint).max);
    wMATIC.approve(address(this), type(uint).max);
  }

  //https://docs.aave.com/developers/v/2.0/the-core-protocol/protocol-data-provider
  function Info() public view returns(uint) {

    (
      ,//uint256 currentATokenBalance,
      ,//uint256 currentStableDebt,
      ,//uint256 currentVariableDebt,
      ,//uint256 principalStableDebt,
      ,//uint256 scaledVariableDebt,
      ,//uint256 stableBorrowRate,
      uint256 liquidityRate,
      ,//,uint40 stableRateLastUpdated,
      //,bool usageAsCollateralEnabled
    ) = IAAVEdataProvider(0xFA3bD19110d986c5e5E9DD5F69362d05035D045B).getUserReserveData(address(wMATIC), address(this));

    return liquidityRate;
  }

  function release(address releaser, uint256 nftTokenValue) external onlyOwner {
    uint256 _releaseValue = (nftTokenValue * 90 / 100);
    //Address.sendValue(payable(releaser), _releaseValue);

    //Take off that amount from AAVE and send to user
    withdrawAAVE(releaser, _releaseValue);

    // No need to do extra transfer, withdrawAAVE now send wETH to user
    // Now the release sends back wMATIC (For Now)
    //require(wMATIC.balanceOf(address(this)) > _releaseValue, "Not enough wMATIC to release");
    //wMATIC.transfer(releaser, _releaseValue);
  }

  function withdrawAAVE(address _user, uint _amount) public onlyOwner {
    IAToken(aMATIC).approve(address(WETHGateway), _amount);
    
    // 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 WMATIC address
    ILendingPool(seeLendingPool()).withdraw(
        address(wMATIC),
        _amount,
        address(this)
      );

    wMATIC.withdraw(_amount);
    Address.sendValue(payable(_user), _amount);
  }

    function withdrawAAVEwMATIC(address _user, uint _amount) public onlyOwner {
    IAToken(aMATIC).approve(address(WETHGateway), _amount);
    
    // 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 WMATIC address
    ILendingPool(seeLendingPool()).withdraw(
        address(wMATIC),
        _amount,
        _user
      );
  }

  function depositAAVE() external payable {
    WETHGateway.depositETH{value: msg.value }(
        seeLendingPool(),
        address(this),
        0
    );
  }

  function wrapMATIC() external payable {
      wMATIC.deposit{value: msg.value}();
  }

  function unwrapMATIC(uint _amount) external {
      wMATIC.transfer(address(this),_amount);
      wMATIC.withdraw(_amount);
  }

  // function to send rewards upon liquidation
  function sendMoney(address user, uint256 amount) external onlyOwner {
    Address.sendValue(payable(user), amount);
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
  function maticBalance(address _addr) public view returns(uint){
      return _addr.balance;
  }
  receive() external payable {
    // depositAAVE();
  }
}
