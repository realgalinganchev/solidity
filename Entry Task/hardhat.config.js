require("@nomiclabs/hardhat-waffle");

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
        const deployElectionContract = require("./scripts/deploy");
        await deployElectionContract(taskArguments);
    });



// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/40c2813049e44ec79cb4d7e0d18de173",
      accounts: ['85da3926bc0423ae5a903e9d0427a48d742cb9c67dd7b81eab34b5f4be987c6b'],
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      // my own key - VUJ9MQN62MG1QWAJU5MZIH3BD4CP7CDKCJ
      rinkeby: "VUJ9MQN62MG1QWAJU5MZIH3BD4CP7CDKCJ"
    }
  },
  
};
