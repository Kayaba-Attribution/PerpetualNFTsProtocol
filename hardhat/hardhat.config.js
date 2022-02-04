require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    localhost: {
      url: "http://localhost:8545/",
      chainId: 31337,
    },
    mumbai: {
      url: `https://speedy-nodes-nyc.moralis.io/aaf5f27c6c7a9ad182a69ccd/polygon/mumbai`,
      accounts: ['66ccfc11bd552cf60fc9948330eace879fdd0825959f4197829338f97c07ffe1']
    },
    // 0x00043a4682FB2dc300e96450a6eD328eb805F9d9 generated on vanity-eth
    // etherscan: {
    //   apiKey: {
    //     mumbai: "WVE2MQXRUVR8YRKYUWXYSRR4UM987QMX9S"
    //   }
    // }

  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
  }
};

