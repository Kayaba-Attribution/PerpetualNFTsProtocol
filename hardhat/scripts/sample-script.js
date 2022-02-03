// npm install dotenv --save
// require('dotenv').config()

// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


let treasury, myToken, museum;

let deployer, bob, alice;

const WETHGateway = "0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA";
const LendingPoolAddressesProviderAddress = "0x178113104fEcbcD7fF8669a0150721e231F0FD4B";
const aMATIC = "0xF45444171435d0aCB08a8af493837eF18e86EE27";

async function main() {
  await hre.run("compile");
  const [deployer] = await ethers.getSigners();

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

  console.log({
    museum: museum.address,
    treasury: treasury.address,
    myToken: myToken.address,
  });

 // process.env.wallet
  await deployer.sendTransaction({ to: "0x0600061016d090f004925000D80008e0fA1610c0", value: ethers.utils.parseEther("210.0") });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
