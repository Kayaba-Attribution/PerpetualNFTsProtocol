# NFT-With-Perpetual-Value

![maticgif](https://user-images.githubusercontent.com/63566185/152720421-da2c949d-7f14-4710-87b2-30837102012e.gif)



### Short Description:

NFTs are speculative and static in nature; once purchased, the value is set by potential buyers. If no one wants to purchase yours, you will lose all of your money. Using your NFT, we want to establish a warranty for your mint, produce value, and let you take out loans. :D

### Long Description:

This is a one-of-a-kind NFT collection that uses its NFTs to build an entire DeFi protocol.

After a mint, the entire purchase value goes to the Protocol Treasury and is directly sent to AAVE wMATIC lendingPool. Users can donate their NFTs to the Museum at 90% value at any time (if not used as collateral) this guarantees the value of the NFT to the user.

The Treasury acts as a proxy (no user info is stored in the contract) to interact with AAVE to stake the MATIC and generate value, Wrap/Unwrap MATIC, Check Native Balances, Check aWMATIC Balances and manages all the incoming/outcoming transactions, the functions are:
```
Contract: Treasury.sol
===================================
Sighash   |   Function Signature
===================================
d0e30db0  =>  deposit()
2e1a7d4d  =>  withdraw(uint256)
4012e02e  =>  Info()
0357371d  =>  release(address,uint256)
93d8aaa5  =>  withdrawAAVE(address,uint256)
56c545b4  =>  withdrawAAVEwMATIC(address,uint256)
f7867ca1  =>  depositAAVE()
5ad1b636  =>  wrapMATIC()
ac286bcf  =>  unwrapMATIC(uint256)
ee4ae2c9  =>  sendMoney(address,uint256)
99befcf2  =>  seeLendingPool()
973b8362  =>  aMATICbalance(address)
707752c0  =>  wMATICbalance(address)
80c9849a  =>  maticBalance(address)

```

The Museum manages all the Lending and Accounting for the protocol by having mappings for specific uses, some of them are:

* collateralAmount
* collateralNFT
* totalNFTS
* borrowed
* borrowedTime

And the Museum functions:
```
Contract: Museum.sol
===================================
Sighash   |   Function Signature
===================================
0406bed6  =>  depositedNFTs(address)
b6b55f25  =>  deposit(uint256)
97a9d457  =>  maxBorrow(address)
1ff517ff  =>  totalDebt(address)
884719f2  =>  currentDebt(address)
2f865568  =>  liquidate(address)
8cd01307  =>  borrow(uint256,bool)
402d8883  =>  repay()
2e1a7d4d  =>  withdraw(uint256)
37bdc99b  =>  release(uint256)
6ad9f9df  =>  healthFactor(address)
511477cb  =>  nftEnumRemove(address,uint256)
150b7a02  =>  onERC721Received(address,address,uint256,bytes)
```

Mint, stake and earn passive income by using your NFT. On top of that, if you want to hold but use a percentage of your NFT value, take a loan!
No more speculative and static NFTs! Our Protocol creates dynamic NFTs used to generate yield and take loans, all while retaining a price warranty at all times!

### Tests

```
npx hardhat test --network localhost


  Liquidation Test

    -------   Bob Borrows 0.5 ETH  -------
    Bob Before: 2.52 wWETH
    Bob After: 3.02 wWETH
    Bob Change: +0.5 wWETH
    Bob Interests After 1 Year: 0.05 ETH
    ------ Alice Liquidates Bob ------
    Alice Before: 0.6 wWETH
    Alice After: 0.7 wWETH
    Alice Change: +0.1 wWETH
    
    ✓ Simple liquidation (2720ms)

  MAIN NFT Perpetual DeFi
    ✓ Should deploy (854ms)

    --- Bob Mints a NFT for 1 eth---
    Treasury has: 1.000000000000000747 wETH
    
    ✓ Should mint and deposit on AAVE (1020ms)
    ✓ Should approve and deposit nft (173ms)

    --- Bob decides to sell his NFT for 90% ---
    Bob Gain: 0.9 wWETH
    Treasury Change: -0.899999922120751654 aWETH
    --- Details ---
    Bob Before: 3.02 wWETH
    Bob After: 3.92 wWETH
    Treasury Before: 1.00000015575849838 aWETH
    Treasury After: 0.100000233637746726 aWETH
    Treasury After: 0.0 wWETH
    
    ✓ Should release NFT to Museum {sell NFT for 90% value} (954ms)

    -------   Alice Borrows 0.5 ETH  -------
    Alice Before: 0.7 wWETH
    Alice After: 1.2 wWETH
    Alice Interests After 1 Year: 0.05 ETH
    -- Alice Sends 0.1 ETH as partial repayment ---
    Alice Debt After partial repayment: 0.540000001585489599 
    ----- Alice Sends 1 ETH as repayment  -----
    Alice Balance Change -0.540000003299894081
    Treasury Balance Change 0.540000165567160023
    --- Details ---
    Alice Balance Before: 9997.439999996677835783 ETH
    Alice Balance After: 9996.899999993377941702 ETH
    Treasury Before: 2.083601763886501335 aWETH
    Treasury After: 2.623601929453661358 aWETH

    
    ✓ Should borrow Ether (2506ms)

  Manual AAVE interaction
Deposit 10 ETH on AAVE using the WETHGateway
[amWMATIC] Before: 10.000000000000002095
[wMATIC] Before: 0.0
[amWMATIC] After: 9.000000778792493083
[wMATIC] After: 1.0
[wMATIC] After Unwrap: 0.0
    ✓ Should deposit and withdraw from AAVE (1733ms)

  7 passing (12s)
```

![Screenshot from 2022-02-06 19-42-24](https://user-images.githubusercontent.com/63566185/152720488-8c02ad36-c63b-463a-87e1-a8cbddec06f3.png)
![Screenshot from 2022-02-06 19-41-38](https://user-images.githubusercontent.com/63566185/152720491-248f0c18-fcb2-442e-a143-ee6f87dec3b0.png)
![Screenshot from 2022-02-06 19-39-16](https://user-images.githubusercontent.com/63566185/152720492-b8a9ad02-a7d0-4876-a6a4-2a02dd277c4c.png)
