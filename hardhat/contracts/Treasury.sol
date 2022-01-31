//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IScaledBalanceToken} from './IScaledBalanceToken.sol';

interface IAToken is IERC20, IScaledBalanceToken {
  /**
   * @dev Emitted after the mint action
   * @param from The address performing the mint
   * @param value The amount being
   * @param index The new liquidity index of the reserve
   **/
  event Mint(address indexed from, uint256 value, uint256 index);

  /**
   * @dev Mints `amount` aTokens to `user`
   * @param user The address receiving the minted tokens
   * @param amount The amount of tokens getting minted
   * @param index The new liquidity index of the reserve
   * @return `true` if the the previous balance of the user was 0
   */
  function mint(
    address user,
    uint256 amount,
    uint256 index
  ) external returns (bool);

  /**
   * @dev Emitted after aTokens are burned
   * @param from The owner of the aTokens, getting them burned
   * @param target The address that will receive the underlying
   * @param value The amount being burned
   * @param index The new liquidity index of the reserve
   **/
  event Burn(address indexed from, address indexed target, uint256 value, uint256 index);

  /**
   * @dev Emitted during the transfer action
   * @param from The user whose tokens are being transferred
   * @param to The recipient
   * @param value The amount being transferred
   * @param index The new liquidity index of the reserve
   **/
  event BalanceTransfer(address indexed from, address indexed to, uint256 value, uint256 index);

  /**
   * @dev Burns aTokens from `user` and sends the equivalent amount of underlying to `receiverOfUnderlying`
   * @param user The owner of the aTokens, getting them burned
   * @param receiverOfUnderlying The address that will receive the underlying
   * @param amount The amount being burned
   * @param index The new liquidity index of the reserve
   **/
  function burn(
    address user,
    address receiverOfUnderlying,
    uint256 amount,
    uint256 index
  ) external;

  /**
   * @dev Mints aTokens to the reserve treasury
   * @param amount The amount of tokens getting minted
   * @param index The new liquidity index of the reserve
   */
  function mintToTreasury(uint256 amount, uint256 index) external;

  /**
   * @dev Transfers aTokens in the event of a borrow being liquidated, in case the liquidators reclaims the aToken
   * @param from The address getting liquidated, current owner of the aTokens
   * @param to The recipient
   * @param value The amount of tokens getting transferred
   **/
  function transferOnLiquidation(
    address from,
    address to,
    uint256 value
  ) external;

  /**
   * @dev Transfers the underlying asset to `target`. Used by the LendingPool to transfer
   * assets in borrow(), withdraw() and flashLoan()
   * @param user The recipient of the aTokens
   * @param amount The amount getting transferred
   * @return The amount transferred
   **/
  function transferUnderlyingTo(address user, uint256 amount) external returns (uint256);
}
interface ILendingPoolAddressesProvider {
    function getLendingPool() external view returns (address);
}

interface IWETHGateway {
  function depositETH(
    address lendingPool,
    address onBehalfOf,
    uint16 referralCode
  ) external payable;

  function withdrawETH(
    address lendingPool,
    uint256 amount,
    address onBehalfOf
  ) external;

  function repayETH(
    address lendingPool,
    uint256 amount,
    uint256 rateMode,
    address onBehalfOf
  ) external payable;

  function borrowETH(
    address lendingPool,
    uint256 amount,
    uint256 interesRateMode,
    uint16 referralCode
  ) external;

  function getWETHAddress() external view returns (address);
}

contract Treasury is Ownable {

  IWETHGateway WETHGateway;
  address LendingPoolAddressesProviderAddress = 0x178113104fEcbcD7fF8669a0150721e231F0FD4B;
  constructor() {
    WETHGateway = IWETHGateway(0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA);
  }

  function release(address releaser, uint256 nftTokenValue) external onlyOwner {
    uint256 _releaseValue = nftTokenValue * 90 / 100;
    
    sendMoney(releaser, _releaseValue);
  }

  function sendMoney(address user, uint256 amount) public onlyOwner {
    (bool success, ) = payable(user).call{value: amount }("");
    require(success, "transfer fail");
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
    address _lendingPool = ILendingPoolAddressesProvider(
        LendingPoolAddressesProviderAddress
    ).getLendingPool();

    WETHGateway.withdrawETH(
        _lendingPool,
        WMATICbalanace(),
        address(this)
    );
  }

  function seeLendingPool() public view returns (address){
      return ILendingPoolAddressesProvider(LendingPoolAddressesProviderAddress).getLendingPool();
  }
  function WMATICbalanace() public view returns(uint256){
      return IAToken(0xF45444171435d0aCB08a8af493837eF18e86EE27).balanceOf(address(this));
  }

  receive() external payable {}
}