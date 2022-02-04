const { expect } = require("chai");
const { ethers } = require("hardhat");

let deployer, bob, alice;
let treasury, myToken, museum;

// Mumbai Testnet AAVE Addresses
const WETHGateway = "0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA";
const LendingPoolAddressesProviderAddress = "0x178113104fEcbcD7fF8669a0150721e231F0FD4B";
const aMATIC = "0xF45444171435d0aCB08a8af493837eF18e86EE27";
const wMATIC = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"

// Mumbai Mainnet AAVE Addresses
// const WETHGateway = "0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97";
// const LendingPoolAddressesProviderAddress = "0xd05e3E715d945B59290df0ae8eF85c1BdB684744";
// const aMATIC = "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4";

const { parseEther } = ethers.utils;
let test;
describe("Manual AAVE interaction", function() {
  before(async () => {
    [deployer, bob, alice] = await ethers.getSigners();
    const AAVETESTF = await ethers.getContractFactory("AAVETEST");
    test = await AAVETESTF.deploy(WETHGateway, LendingPoolAddressesProviderAddress, aMATIC, wMATIC);
    await test.deployed();
  });

  
  it("Should deposit and withdraw from AAVE", async function () {
    console.log("Deposit 10 ETH on AAVE using the WETHGateway")
    await test.depositAAVE({ value: parseEther("10") });
    console.log("[amWMATIC] Before:", ethers.utils.formatEther(await test.aMATICbalance(test.address)))
    console.log("[wMATIC] Before:", ethers.utils.formatEther(await test.wMATICbalance(test.address)))
    await test.withdrawAAVE(parseEther("1"), deployer.address);
    console.log("[amWMATIC] After:", ethers.utils.formatEther(await test.aMATICbalance(test.address)))
    console.log("[wMATIC] After:", ethers.utils.formatEther(await test.wMATICbalance(test.address)))
    await test.unwrapMATIC(parseEther("1"))
    console.log("[wMATIC] After Unwrap:", ethers.utils.formatEther(await test.wMATICbalance(test.address)))

  
  });


  
//   it("Should wrap/unwrap ETH and deposit on AAVE using caller funds", async function () {
//     const treasury_aWETHbefore = await treasury.WMATICbalance()
//     await treasury.depositAAVE({ value: parseEther("1") })
//     const treasury_aWETHafter = await treasury.WMATICbalance()

//     expect(treasury_aWETHafter.sub(treasury_aWETHbefore)).to.be.closeTo(parseEther("1"), parseEther("0.001"));

//     await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 365]);
//     await ethers.provider.send("evm_mine", []); // add 365 days

//     const treasury_aWETHafterOneYear = await treasury.WMATICbalance()
//     expect(treasury_aWETHafterOneYear).to.be.above(treasury_aWETHafter.sub(treasury_aWETHbefore));

//     console.log(ethers.utils.formatEther(treasury_aWETHafterOneYear), "ETH")

//     //Toca approve
//     //await treasury.withdrawAAVE(parseEther("1"))

//   })
});
