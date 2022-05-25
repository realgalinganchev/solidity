require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploys the contract", async (taskArgs, hre) => {
  const LimeToken = await hre.ethers.getContractFactory("LimeToken");
  const lime = await LimeToken.deploy();

  await lime.deployed();

  console.log("LimeCoin deployed to:", lime.address);
});

task("deployETHWrapper", "Deploys the contract", async (taskArgs, hre) => {
  const ETHWrapperFactory = await ethers.getContractFactory("ETHWrapper"); // 
  const ETHWrapperContract = await ETHWrapperFactory.deploy();
  console.log('Waiting for ETHWrapperContract deployment...');
  await ETHWrapperContract.deployed();

  console.log("ETHWrapperContract deployed to address:", ETHWrapperContract.address);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/ab0b32b1a6484c3f94a5753a083ddd11",
      accounts: ["0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0"],     
    }
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
