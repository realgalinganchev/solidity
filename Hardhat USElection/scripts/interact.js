const hre = require("hardhat");
const USElection = require('../artifacts/contracts/USElection.sol/USElection.json')
// const run = async function() {
// 	//console.log("Hello world")
// 	console.log(hre.ethers.version)
// }

//nodes are Providers
const run1 = async function() {
	const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545")
	const latestBlock = await provider.getBlock("latest")
	console.log(latestBlock.hash)
	const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
	const balance = await wallet.getBalance()
//wei to ether - second arg - how many decimal places should be shifted until making it into the base number
console.log(hre.ethers.utils.formatEther(balance, 18))
//.toString() from BigNumber
console.log(balance.toString())
}


// Contract address 0x5FbDB2315678afecb367f032d93F642f64180aa3
const run = async function () {
	const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545")
	const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider)
	const balance = await wallet.getBalance();

	const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
	const electionContract = new hre.ethers.Contract(contractAddress, USElection.abi, wallet)

	// const hasEnded = await electionContract.electionEnded()
	// console.log("The election has ended:", hasEnded)
	// const haveResultsForOhio = await electionContract.resultsSubmitted("Ohio")
	// console.log("Have results for Ohio:", haveResultsForOhio)

	const transactionOhio = await electionContract.submitStateResult(["Ohio", 250, 150, 24]);
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

const connectingOtherToOtherWallets = async () => {
	const aliceWallet = new hre.ethers.Wallet("alicePrivateKey", provider)
	const aliceContractInstance = new hre.ethers.Contract(contractAddress, Contract.abi, aliceWallet)

	const bobsWallet = new hre.ethers.Wallet("bobsPrivateKey", provider)
	const bobsContractInstance = await aliceContractInstance.connect(bobsWallet)
}

run()