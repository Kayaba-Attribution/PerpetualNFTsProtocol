const { expect } = require("chai");

let deployer, bob, alice;
let treasury, myToken, museum;

// Mumbai Testnet AAVE Addresses
const WETHGateway = "0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA";
const LendingPoolAddressesProviderAddress = "0x178113104fEcbcD7fF8669a0150721e231F0FD4B";
const aMATIC = "0xF45444171435d0aCB08a8af493837eF18e86EE27";

// Mumbai Mainnet AAVE Addresses
// const WETHGateway = "0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97";
// const LendingPoolAddressesProviderAddress = "0xd05e3E715d945B59290df0ae8eF85c1BdB684744";
// const aMATIC = "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4";

const { parseEther, formatEther } = ethers.utils;

describe("MAIN NFT Perpetual DeFi", function() {
  before(async () => {
    [deployer, bob, alice] = await ethers.getSigners();
  });

  it("Should deploy", async function () {
    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(WETHGateway, LendingPoolAddressesProviderAddress, aMATIC);
    await treasury.deployed();

    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(treasury.address);
    await myToken.deployed();

    const Museum = await ethers.getContractFactory("Museum");
    museum = await Museum.deploy(myToken.address, treasury.address);
    await museum.deployed();

    await treasury.transferOwnership(museum.address);
  });

  it("Should mint and deposit on AAVE", async function () {
    const tokenNftBob = myToken.connect(bob);
    await expect(tokenNftBob.mint()).to.be.reverted;

    await tokenNftBob.mint({ value: parseEther("1") });
    expect(await treasury.aMATICbalance(treasury.address)).to.be.closeTo(parseEther("1"), parseEther("0.00001"));
    console.log(`
    --- Bob Mints a NFT for 1 eth---
    Treasury has: ${formatEther(await treasury.aMATICbalance(treasury.address))} wETH
    `);
    //expect(await bob.provider.getBalance(treasury.address)).to.eq(parseEther("1"))
  });
  
  it("Should approve and deposit nft", async function () {
    // TODO: [FRONTEND] User must aprove museum
    const tokenNftBob = myToken.connect(bob);
    await tokenNftBob.approve(museum.address, "0");
    await museum.connect(bob).deposit("0");

    // Check user colateral variables
    expect(await museum.collateralAmount(bob.address)).to.eq(parseEther("1"));
    expect(await museum.collateralNFTOwner("0")).to.eq(bob.address);
  });

  it("Should release NFT to Museum {sell NFT for 90% value}", async function () {
    // await expect(museum.connect(bob).release('1')).to.be.reverted;

    // const bobBalanceBefore = await bob.getBalance();
    // const museumBalanceBefore = await bob.provider.getBalance(treasury.address);

    // await museum.connect(bob).release('0');
    // await expect(museum.connect(bob).release('0')).to.be.reverted;
    
    // const bobBalanceAfter = await bob.getBalance();
    // const museumBalanceAfter = await bob.provider.getBalance(treasury.address);

    // expect(bobBalanceAfter.sub(bobBalanceBefore)).to.be.closeTo(parseEther("0.9"), parseEther("0.001"));
    // expect(museumBalanceBefore.sub(museumBalanceAfter)).to.be.closeTo(parseEther("0.9"), parseEther("0.0001"));
  

    await expect(museum.connect(bob).release('1')).to.be.reverted;

    const bobBalanceBefore = await treasury.wMATICbalance(bob.address);
    const treasuryBalanceBefore = await treasury.aMATICbalance(treasury.address);

    await museum.connect(bob).release('0');
    await expect(museum.connect(bob).release('0')).to.be.reverted;

    const bobBalanceAfter = await treasury.wMATICbalance(bob.address);
    const treasuryBalanceAfter = await treasury.aMATICbalance(treasury.address);

    // Bob gains 0.9 wETH
    const bobGain = bobBalanceAfter.sub(bobBalanceBefore) 
    expect(bobGain).to.be.closeTo(parseEther("0.9"), parseEther("0.001"));
    // Treasury loses 0.9 aWETH
    expect(treasuryBalanceBefore.sub(treasuryBalanceAfter)).to.be.closeTo(parseEther("0.9"), parseEther("0.001"));
    
    console.log(`
    --- Bob decides to sell his NFT for 90% ---
    Bob Gain: ${formatEther(bobBalanceAfter.sub(bobBalanceBefore))} wWETH
    Treasury Change: ${formatEther((treasuryBalanceAfter).sub(treasuryBalanceBefore))} aWETH
    --- Details ---
    Bob Before: ${formatEther(bobBalanceBefore)} wWETH
    Bob After: ${formatEther(bobBalanceAfter)} wWETH
    Treasury Before: ${formatEther(treasuryBalanceBefore)} aWETH
    Treasury After: ${formatEther(treasuryBalanceAfter)} aWETH
    Treasury After: ${formatEther(await treasury.wMATICbalance(treasury.address))} wWETH
    `)
});

  it("Should borrow Ether", async function () {
    const tokenNftAlice = myToken.connect(alice);
    await tokenNftAlice.mint({ value: parseEther("1") });
    await tokenNftAlice.approve(museum.address, "1");
    await museum.connect(alice).deposit("1");

    const aliceBalanceBefore = await treasury.wMATICbalance(alice.address);
    await museum.connect(alice).borrow(parseEther("0.5"));
    const aliceBalanceAfter = await treasury.wMATICbalance(alice.address);
    // Debt must be close to 0 as the loan was just taken
    expect(await museum.currentDebt(alice.address)).closeTo("0", "10");

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 365]);
    await ethers.provider.send("evm_mine", []); // add 365 days

    // 10% annual
    const expectedDebt = parseEther("0.5").mul("10").div("100");

    expect(await museum.currentDebt(alice.address)).closeTo(expectedDebt, "10");
    
    // partial repay
    await museum.connect(alice).repay({ value: parseEther("0.01") });
    expect(await museum.currentDebt(alice.address)).closeTo("0", "10");
    const aliceDebtAfterPartialRepay = await museum.totalDebt(alice.address)
    expect(aliceDebtAfterPartialRepay).closeTo(parseEther("0.54"), parseEther("0.00001"));
    
    // full repay with extra money sent
    const currentAliceBalance = await alice.provider.getBalance(alice.address);
    const treasuryBalanceBefore = await treasury.aMATICbalance(treasury.address);

    await museum.connect(alice).repay({ value: parseEther("1") });
    const afterAliceBalance = await alice.provider.getBalance(alice.address);
    const treasuryBalanceAfter = await treasury.aMATICbalance(treasury.address);

    expect(await museum.totalDebt(alice.address)).be.eq("0");
    expect(currentAliceBalance.sub(afterAliceBalance)).closeTo(parseEther("0.54"), parseEther("0.0001"));
    expect(treasuryBalanceAfter.sub(treasuryBalanceBefore)).closeTo(parseEther("0.54"), parseEther("0.0001"));
  
    console.log(`
    -------   Alice Borrows 0.5 ETH  -------
    Alice Before: ${formatEther(aliceBalanceBefore)} wWETH
    Alice After: ${formatEther(aliceBalanceAfter)} wWETH
    Alice Interests After 1 Year: ${formatEther(expectedDebt)} ETH
    -- Alice Sends 0.1 ETH as partial repayment ---
    Alice Debt After partial repayment: ${formatEther(aliceDebtAfterPartialRepay)} 
    ----- Alice Sends 1 ETH as repayment  -----
    Alice Balance Change ${formatEther((afterAliceBalance).sub(currentAliceBalance))}
    Treasury Balance Change ${formatEther((treasuryBalanceAfter).sub(treasuryBalanceBefore))}
    --- Details ---
    Alice Balance Before: ${formatEther(currentAliceBalance)} ETH
    Alice Balance After: ${formatEther(afterAliceBalance)} ETH
    Treasury Before: ${formatEther(treasuryBalanceBefore)} aWETH
    Treasury After: ${formatEther(treasuryBalanceAfter)} aWETH

    `)



  //   const tokenNftAlice = myToken.connect(alice);
  //   await tokenNftAlice.mint({ value: parseEther("1") });
  //   await tokenNftAlice.approve(museum.address, "1");
  //   await museum.connect(alice).deposit("1");
  
  //   const aliceBalanceBefore = await alice.getBalance();
  //   await museum.connect(alice).borrow(parseEther("0.5"));
  //   expect(await museum.currentDebt(alice.address)).closeTo("0", "10");
    
  //   const aliceBalanceAfter = await alice.getBalance();
  //   expect(aliceBalanceAfter.sub(aliceBalanceBefore)).to.be.closeTo(parseEther("0.5"), parseEther("0.001"));

  //   await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 365]);
  //   await ethers.provider.send("evm_mine", []); // add 365 days

  //   const expectedDebt = parseEther("0.5").mul("10").div("100");
  //   expect(await museum.currentDebt(alice.address)).closeTo(expectedDebt, "10");
    
  //   await museum.connect(alice).repay({ value: parseEther("0.01") });
  //   expect(await museum.currentDebt(alice.address)).closeTo("0", "10");
  //   expect(await museum.totalDebt(alice.address)).closeTo(parseEther("0.515"), parseEther("0.00001"));
    
  //   const currentAliceBalance = await alice.provider.getBalance(alice.address);
  //   await museum.connect(alice).repay({ value: parseEther("1") });
  //   const afterAliceBalance = await alice.provider.getBalance(alice.address);
    
  //   expect(await museum.totalDebt(alice.address)).be.eq("0");
  //   expect(currentAliceBalance.sub(afterAliceBalance)).closeTo(parseEther("0.515"), parseEther("0.0001"));
   });


});

//    npx hardhat node --fork https://speedy-nodes-nyc.moralis.io/aaf5f27c6c7a9ad182a69ccd/polygon/mumbai --fork-block-number 24401256  
