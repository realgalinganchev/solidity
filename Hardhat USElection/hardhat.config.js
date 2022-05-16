require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require('dotenv').config()

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// task("deploy", "Deploys contract on a provided network")
//   .setAction(async (taskArguments, hre, runSuper) => {
//       const deployElectionContract = require("./scripts/sample-script");
//       await deployElectionContract(taskArguments);
// });

task("deploy", "Deploys contract on a provided network")
  .setAction(async () => {
    const deployElectionContract = require("./scripts/deploy");
    await deployElectionContract();
    await hre.run('print', { message: "Done!" })
});

subtask("print", "Prints a message")
  .addParam("message", "The message to print")
  .setAction(async (taskArgs) => {
    console.log(taskArgs.message);
});

task("deploy-with-params", "Deploys contract on a provided network")
 .addParam("privateKey", "Please provide the private key")
 .setAction(async ({privateKey}) => {
    const deployElectionContract = require("./scripts/deploy-with-params");
    await deployElectionContract(privateKey);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

// task("deploy-testnets", "Deploys contract on a provided network")
//     .setAction(async (taskArguments, hre, runSuper) => {
//         const deployElectionContract = require("./scripts/deploy");
//         await deployElectionContract(taskArguments);
//     });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 module.exports = {
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/ab0b32b1a6484c3f94a5753a083ddd11",
      accounts: [`${process.env.ROPSTEN_PRIVATE_KEY}`],     
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/ab0b32b1a6484c3f94a5753a083ddd11",
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`],    
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      ropsten: `${process.env.ETHERSCAN_APIKEY}`
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

