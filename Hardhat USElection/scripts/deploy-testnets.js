const hre = require('hardhat')
const ethers = hre.ethers;

async function deployElectionContract() {
    await hre.run('compile'); // We are compiling the contracts using subtask
    const [deployer] = await ethers.getSigners(); // We are getting the deployer
  
    console.log('Deploying contracts with the account:', deployer.address); // We are printing the address of the deployer
    console.log('Account balance:', (await deployer.getBalance()).toString()); // We are printing the account balance

    const USElection = await ethers.getContractFactory("USElection"); // 

    //const USElectionFactory = await hre.ethers.getContractFactory("USElection");
    //const electionContract = await USElectionFactory.attach("0xc9707E1e496C12f1Fa83AFbbA8735DA697cdBf64");

    const usElectionContract = await USElection.deploy();
    
    console.log('Waiting for USElection deployment...');
    await usElectionContract.deployed();
    //0xdD184C29540EE4FE6d249C526280609e8dC8c366
    console.log('USElection Contract address: ', usElectionContract.address);
    console.log('Done!');

        // await hre.run("verify:verify", {
        //     address: usElectionContract.address,
        //     constructorArguments: [
        //      // if any
        //     ],
        //   });
}
  
module.exports = deployElectionContract;