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


});
