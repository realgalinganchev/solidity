require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
const dotenv = require("dotenv");
const { task } = require("hardhat/config");
dotenv.config({ path: __dirname + '/.env' });
const { ROPSTEN_PRIVATE_KEY, RINKEBY_PRIVATE_KEY, ETHERSCAN_APIKEY } = process.env;

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
  .setAction(async ({ privateKey }) => {
    const deployBookLibraryContract = require("./scripts/deploy-with-params");
    await deployBookLibraryContract(privateKey);
    await hre.run('print', { message: "Done!" })
  });

task("deploy-testnets", "Deploys contract on a provided network")
  .setAction(async (taskArguments, hre, runSuper) => {
    const deployBookLibraryContract = require("./scripts/deploy-testnets");
    await deployBookLibraryContract(taskArguments);
    //await hre.run('verify');
  });

subtask("print", "Prints a message")
  .addParam("message", "The message to print")
  .setAction(async (taskArgs) => {
    console.log(taskArgs.message);
  });

task("interact", "Deploys the contract", async (taskArgs, hre) => {
  const BookLibrary = await hre.ethers.getContractFactory("BookLibrary");
  const bookLibrary = await BookLibrary.deploy();
  await bookLibrary.deployed();
  console.log("BookLibrary deployed to:", bookLibrary.address);
});

// subtask("verify", "Verifies with etherscan")
//   .setAction(async () => {
//     await hre.run("verify:verify", {
//         address: bookLibraryContract.address,
//         constructorArguments: [
//         ],
//     });
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "local",
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/ab0b32b1a6484c3f94a5753a083ddd11",
      accounts: [`${ROPSTEN_PRIVATE_KEY}`],
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/ab0b32b1a6484c3f94a5753a083ddd11",
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
    },
    local: {
      url: "http://127.0.0.1:8545/",
      gas: 8000000,
      gasPrice: 30000000000,
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      ropsten: `${ETHERSCAN_APIKEY}`
    }
  },
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

