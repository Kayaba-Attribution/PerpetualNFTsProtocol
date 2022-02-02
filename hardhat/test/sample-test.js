const { expect } = require("chai");

let treasury, myToken, museum;

let deployer, bob, alice;

// mumbai testnet
const WETHGateway = "0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA";
const LendingPoolAddressesProviderAddress = "0x178113104fEcbcD7fF8669a0150721e231F0FD4B";
const aMATIC = "0xF45444171435d0aCB08a8af493837eF18e86EE27";

// main net;
// const WETHGateway = "0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97";
// const LendingPoolAddressesProviderAddress = "0xd05e3E715d945B59290df0ae8eF85c1BdB684744";
// const aMATIC = "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4";

const { parseEther } = ethers.utils;

describe("Greeter", function() {
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

  it("Should mint", async function () {
    const tokenNftBob = myToken.connect(bob);
    await expect(tokenNftBob.mint()).to.be.reverted;

    await tokenNftBob.mint({ value: parseEther("1") });

    expect(await bob.provider.getBalance(treasury.address)).to.eq(parseEther("1"))
  });

  //ERC721: transfer caller is not owner nor approved
  
  it("Should deposit & widthdraw", async function () {
    const tokenNftBob = myToken.connect(bob);
    await tokenNftBob.approve(museum.address, "0");
    await museum.connect(bob).deposit("0");

    expect(await museum.collateralAmount(bob.address)).to.eq(parseEther("1"));
    expect(await museum.collateralNFTOwner("0")).to.eq(bob.address);
  });

  it("Should release NFT to Museum", async function () {
    await expect(museum.connect(bob).release('1')).to.be.reverted;

    const bobBalanceBefore = await bob.getBalance();
    const museumBalanceBefore = await bob.provider.getBalance(treasury.address);

    await museum.connect(bob).release('0');
    await expect(museum.connect(bob).release('0')).to.be.reverted;
    
    const bobBalanceAfter = await bob.getBalance();
    const museumBalanceAfter = await bob.provider.getBalance(treasury.address);

    expect(bobBalanceAfter.sub(bobBalanceBefore)).to.be.closeTo(parseEther("0.9"), parseEther("0.001"));
    expect(museumBalanceBefore.sub(museumBalanceAfter)).to.be.closeTo(parseEther("0.9"), parseEther("0.0001"));
    // https://ethereum-waffle.readthedocs.io/en/latest/matchers.htmlh
  });

  it("Should borrow Ether", async function () {
    const tokenNftAlice = myToken.connect(alice);
    await tokenNftAlice.mint({ value: parseEther("1") });
    await tokenNftAlice.approve(museum.address, "1");
    await museum.connect(alice).deposit("1");

    const aliceBalanceBefore = await alice.getBalance();
    await museum.connect(alice).borrow(parseEther("0.5"));
    expect(await museum.currentDebt(alice.address)).closeTo("0", "10");
    
    const aliceBalanceAfter = await alice.getBalance();
    expect(aliceBalanceAfter.sub(aliceBalanceBefore)).to.be.closeTo(parseEther("0.5"), parseEther("0.001"));

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 365]);
    await ethers.provider.send("evm_mine", []); // add 365 days
    
    const expectedDebt = parseEther("0.5").mul("5").div("100");
    expect(await museum.currentDebt(alice.address)).closeTo(expectedDebt, "1000");

    await museum.connect(alice).repay({ value: parseEther("0.01") });
    expect(await museum.currentDebt(alice.address)).closeTo("0", "10");
    expect(await museum.totalDebt(alice.address)).closeTo(parseEther("0.515"), parseEther("0.00001"));
    

    const currentAliceBalance = await alice.provider.getBalance(alice.address);
    await museum.connect(alice).repay({ value: parseEther("1") });
    const afterAliceBalance = await alice.provider.getBalance(alice.address);
    
    expect(await museum.totalDebt(alice.address)).be.eq("0");
    expect(currentAliceBalance.sub(afterAliceBalance)).closeTo(parseEther("0.515"), parseEther("0.0001"));
  });
 

  


  /*
  it("Should wrap/unwrap ETH and deposit on AAVE using caller funds", async function () {
    const treasury_aWETHbefore = await treasury.WMATICbalance()
    await treasury.depositAAVE({ value: parseEther("1") })
    const treasury_aWETHafter = await treasury.WMATICbalance()

    expect(treasury_aWETHafter.sub(treasury_aWETHbefore)).to.be.closeTo(parseEther("1"), parseEther("0.001"));

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 365]);
    await ethers.provider.send("evm_mine", []); // add 365 days

    const treasury_aWETHafterOneYear = await treasury.WMATICbalance()
    expect(treasury_aWETHafterOneYear).to.be.above(treasury_aWETHafter.sub(treasury_aWETHbefore));

    console.log(ethers.utils.formatEther(treasury_aWETHafterOneYear), "ETH")
    
    // Toca approve
    //await treasury.withdrawAAVE(parseEther("1"))

  })
  */

});

//    npx hardhat node --fork https://speedy-nodes-nyc.moralis.io/aaf5f27c6c7a9ad182a69ccd/polygon/mumbai --fork-block-number 24401256  
