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

const { parseEther, formatEther } = ethers.utils;

describe("Greeter", function () {
  before(async () => {
    [deployer, bob, alice] = await ethers.getSigners();

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

  it("Simple liquidation", async function () {
    const tokenNftBob = myToken.connect(bob);
    await tokenNftBob.mint({ value: parseEther("1") });
    
    await tokenNftBob.setApprovalForAll(museum.address, true);
    await museum.connect(bob).deposit("0");
    await museum.connect(bob).borrow(parseEther("0.5"));

    await ethers.provider.send("evm_increaseTime", [4 *60 * 60 * 24 * 365]); 
    await ethers.provider.send("evm_mine", []); // add 365 days

    await museum.connect(alice).liquidate(bob.address);
    expect(await museum.totalDebt(bob.address)).to.eq("0");

  });
});