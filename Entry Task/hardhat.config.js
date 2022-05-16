require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy-with-params", "Deploys contract on a provided network")
 .addParam("privateKey", "Please provide the private key")
 .setAction(async ({privateKey}) => {
    const deployElectionContract = require("./scripts/deploy-with-params");
    await deployElectionContract(privateKey);
});

task("deploy-testnets", "Deploys contract on a provided network")
    .setAction(async (taskArguments, hre, runSuper) => {
        const deployElectionContract = require("./scripts/deploy-testnets");
        await deployElectionContract(taskArguments);
    });

  task("sample-script", "Deploys contract on a provided network")
    .setAction(async () => {
        const deployElectionContract = require("./scripts/sample-script");
        await deployElectionContract();
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
      accounts: ['0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0'],      
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/ab0b32b1a6484c3f94a5753a083ddd11",
      accounts: ['85da3926bc0423ae5a903e9d0427a48d742cb9c67dd7b81eab34b5f4be987c6b'],    
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      // my own key - VUJ9MQN62MG1QWAJU5MZIH3BD4CP7CDKCJ
      ropsten: "CHIRAADNUI814XIT9ST36R63UFNBNDKBDY"
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

