# NFT-With-Perpetual-Value

![maticgif](https://user-images.githubusercontent.com/63566185/152720421-da2c949d-7f14-4710-87b2-30837102012e.gif)



### Short Description:

NFTs are speculative and static in nature; once purchased, the value is set by potential buyers. If no one wants to purchase yours, you will lose all of your money. Using your NFT, we want to establish a warranty for your mint, produce value, and let you take out loans. :D

### Long Description:

This is a one-of-a-kind NFT collection that uses its NFTs to build an entire DeFi protocol.

After a mint, the entire purchase value goes to the Protocol Treasury, and it's available at all times only for the current owner of the NFT; No more waiting for someone to buy your NFT, and ending up never finding a buyer.

The Treasury will use a series of DeFi protocols such as AAVE and Compound to stake the ETH and generate value. The rewards will be redistributed to users that agree to lock their NFTs in the Protocol Staking contract (The Museum).

The Protocol Treasury will also allow users to take loans using their NFTs as collateral. Mint, stake and earn passive income by using your NFT. On top of that, if you want to hold but use a percentage of your NFT value, take a loan!

A user can burn the NFT and get a 90% cashback.

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
