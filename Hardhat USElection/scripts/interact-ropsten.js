const hre = require("hardhat");
const USElection = require('../artifacts/contracts/USElection.sol/USElection.json')

// Contract address 0x5FbDB2315678afecb367f032d93F642f64180aa3
const run = async function () {
    const provider = new hre.ethers.providers.InfuraProvider("ropsten", "ab0b32b1a6484c3f94a5753a083ddd11")
	const wallet = new hre.ethers.Wallet("0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0", provider)
	const balance = await wallet.getBalance();
	const contractAddress = "0x529B82474e71DB5ace9a6c387001Eb2c90A67f8f"
	const electionContract = new hre.ethers.Contract(contractAddress, USElection.abi, wallet)

	const transactionOhio = await electionContract.submitStateResult(["Ohio", 250, 150, 24]);
	console.log("State Result Submission Transaction:", transactionOhio.hash);
	
	const transactionReceipt = await transactionOhio.wait();
	if (transactionReceipt.status != 1) { // 1 means success
		console.log("Transaction was not successful")
		return
	}

	const resultsSubmittedOhioNew = await electionContract.resultsSubmitted("Ohio")
	console.log("Results submitted for Ohio", resultsSubmittedOhioNew)
	const currentLeader = await electionContract.currentLeader()
	console.log("Current leader", currentLeader)


}

run()