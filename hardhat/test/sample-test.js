const { expect } = require("chai");

let treasury, myToken, museum;

let deployer, bob, alice;

describe("Greeter", function() {
  before(async () => {
    [deployer, bob, alice] = await ethers.getSigners();
  });

  it("Should deploy", async function () {
    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy();
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

    await tokenNftBob.mint({ value: ethers.utils.parseEther("1") });

    expect(await bob.provider.getBalance(treasury.address)).to.eq(ethers.utils.parseEther("1"))
  });

  //ERC721: transfer caller is not owner nor approved
  
  it("Should deposit & widthdraw", async function () {
    const tokenNftBob = myToken.connect(bob);
    await tokenNftBob.approve(museum.address, "0");
    await museum.connect(bob).deposit("0");

    expect(await museum.collateralAmount(bob.address)).to.eq(ethers.utils.parseEther("1"));
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

    expect(bobBalanceAfter.sub(bobBalanceBefore)).to.be.closeTo(ethers.utils.parseEther("0.9"), ethers.utils.parseEther("0.0001"));
    expect(museumBalanceBefore.sub(museumBalanceAfter)).to.be.closeTo(ethers.utils.parseEther("0.9"), ethers.utils.parseEther("0.0001"));
    // https://ethereum-waffle.readthedocs.io/en/latest/matchers.htmlh
  });

  it("Should borrow Ether", async function () {
    const tokenNftAlice = myToken.connect(alice);
    await tokenNftAlice.mint({ value: ethers.utils.parseEther("1") });
    await tokenNftAlice.approve(museum.address, "1");
    await museum.connect(alice).deposit("1");

    const aliceBalanceBefore = await alice.getBalance();
    await museum.connect(alice).borrow(ethers.utils.parseEther("0.5"));
    expect(await museum.currentDebt(alice.address)).closeTo("0", "10");
    
    const aliceBalanceAfter = await alice.getBalance();
    expect(aliceBalanceAfter.sub(aliceBalanceBefore)).to.be.closeTo(ethers.utils.parseEther("0.5"), ethers.utils.parseEther("0.001"));

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 365]); 
    await ethers.provider.send("evm_mine", []); // add 365 days
    
    const expectedDebt = ethers.utils.parseEther("0.5").mul("5").div("100");
    expect(await museum.currentDebt(alice.address)).closeTo(expectedDebt, "1000");
  });

});
