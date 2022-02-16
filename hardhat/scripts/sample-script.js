// npm install dotenv --save
// require('dotenv').config()

// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


let treasury, Perpetual, museum;

let deployer, bob, alice;

const WETHGateway = "0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA";
const LendingPoolAddressesProviderAddress = "0x178113104fEcbcD7fF8669a0150721e231F0FD4B";
const aMATIC = "0xF45444171435d0aCB08a8af493837eF18e86EE27";
const wMATIC = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA 0x178113104fEcbcD7fF8669a0150721e231F0FD4B 0xF45444171435d0aCB08a8af493837eF18e86EE27

museum: '0xC90cb99EE0877c42a0B7FA9e437bffd4239969b1',
treasury: '0x0775655ab9E77DCDb3a4d08631Db192f626a19Fd',
perpetual: '0x1830e4E3F11910FcA52e9E1d891B61C87998D84c'

async function main() {
  await hre.run("compile");
  const [deployer] = await ethers.getSigners();

  const Treasury = await ethers.getContractFactory("Treasury");
  treasury = await Treasury.deploy(WETHGateway, LendingPoolAddressesProviderAddress, aMATIC);
  await treasury.deployed();
  console.log("Treasury:", treasury.address)

  const Perpetual = await ethers.getContractFactory("Perpetual");
  myToken = await Perpetual.deploy(treasury.address);
  await myToken.deployed();
  console.log("perpetual:", myToken.address)


  const Museum = await ethers.getContractFactory("Museum");
  museum = await Museum.deploy(myToken.address, treasury.address);
  await museum.deployed();
  console.log("museum:", museum.address)


  await treasury.transferOwnership(museum.address);

  console.log({
    museum: museum.address,
    treasury: treasury.address,
    perpetual: myToken.address,
  });

 // process.env.wallet
  //await deployer.sendTransaction({ to: "0x0600061016d090f004925000D80008e0fA1610c0", value: ethers.utils.parseEther("210.0") });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


// copy abi!
//  cp -f hardhat/data/abi/contracts/Museum.sol/Museum.json web/src/lib/abi/Museum.json