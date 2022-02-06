const { expect } = require("chai");

let deployer, bob, alice;
let treasury, myToken, museum;

// Mumbai Testnet AAVE Addresses
const WETHGateway = "0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA";
const LendingPoolAddressesProviderAddress = "0x178113104fEcbcD7fF8669a0150721e231F0FD4B";
const aMATIC = "0xF45444171435d0aCB08a8af493837eF18e86EE27";
const wMATIC = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";


// Mumbai Mainnet AAVE Addresses
// const WETHGateway = "0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97";
// const LendingPoolAddressesProviderAddress = "0xd05e3E715d945B59290df0ae8eF85c1BdB684744";
// const aMATIC = "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4";

const { parseEther, formatEther } = ethers.utils;

describe("Liquidation Test", function () {
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

    const BobBalanceBefore = await treasury.aMATICbalance(treasury.address);
    await tokenNftBob.setApprovalForAll(museum.address, true)
    for (let i = 0; i < 3; i++) {
        await tokenNftBob.mint({ value: parseEther("1") }); 
        await museum.connect(bob).deposit(String(i))       
    }

    const BobBalanceAfter = await treasury.aMATICbalance(treasury.address);

    //liquidityRate: the interest rate being earned by the user for deposits
    //https://docs.aave.com/developers/v/2.0/the-core-protocol/protocol-data-provider
    const liquidityRate = formatEther(await treasury.Info());

    const depositedNFTs = await museum.depositedNFTs(bob.address);
    console.log(`
    -------   Bob Mints 5 NFTs for 5 ETH  -------
    Treasury Before: ${formatEther(BobBalanceBefore)} aWETH
    Treasury After: ${formatEther(BobBalanceAfter)} aWETH
    Treasury Change: +${formatEther((BobBalanceAfter).sub(BobBalanceBefore))} aWETH
    Treasury Interest Being Earned: ${liquidityRate}
    Bob's deposited NFTs: ${depositedNFTs}
    `);

    

  });
});