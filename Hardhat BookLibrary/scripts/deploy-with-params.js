const hre = require('hardhat')
const ethers = hre.ethers;

async function deployBookLibraryContract(_privateKey) {
    await hre.run('compile'); // We are compiling the contracts using subtask
    const wallet = new ethers.Wallet(_privateKey, hre.ethers.provider) // New wallet with the privateKey passed from CLI as param
    console.log('Deploying contracts with the account:', wallet.address); // We are printing the address of the deployer
    console.log('Account balance:', (await wallet.getBalance()).toString()); // We are printing the account balance

    const BookLibrary = await ethers.getContractFactory("BookLibrary", wallet); // Get the contract factory with the signer from the wallet created
    const bookLibraryContract = await BookLibrary.deploy();
    console.log('Waiting for BookLibrary deployment...');
    await bookLibraryContract.deployed();

    console.log('BookLibrary Contract address: ', bookLibraryContract.address);
    // await hre.run("verify:verify", {
    //     address: bookLibraryContract.address,
    //     constructorArguments: [
    //      // if any
    //     ],
    // });
}
  
module.exports = deployBookLibraryContract;