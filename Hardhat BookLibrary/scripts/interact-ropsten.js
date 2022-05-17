const hre = require("hardhat");
const BookLibrary = require('../artifacts/contracts/BookLibrary.sol/BookLibrary.json')

//https://ropsten.etherscan.io/address/0x54172e621baB93f4ee0Ad9170eB49A03812f3F13#code
// Contract address 0x54172e621baB93f4ee0Ad9170eB49A03812f3F13

const run = async function () {
    const provider = new hre.ethers.providers.InfuraProvider("ropsten", "ab0b32b1a6484c3f94a5753a083ddd11")
	const wallet = new hre.ethers.Wallet("0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0", provider)
	const balance = await wallet.getBalance();
	const contractAddress = "0x54172e621baB93f4ee0Ad9170eB49A03812f3F13"
	const bookLibraryContract = new hre.ethers.Contract(contractAddress, BookLibrary.abi, wallet)

	// const transactionAddBook1 = await bookLibraryContract.addNewBookAndCopiesCount( 'bible', 3 );
	// console.log("Add Book 1 Submission Transaction:", transactionAddBook1.hash);
	
	// const transactionReceipt1 = await transactionAddBook1.wait();
	// if (transactionReceipt1.status != 1) { // 1 means success
	// 	console.log("Transaction was not successful")
	// 	return
	// }
	// const transactionAddBook2 = await bookLibraryContract.addNewBookAndCopiesCount( 'bukvar', 5 );
	// console.log("Add Book 2 Submission Transaction:", transactionAddBook2.hash);
	
	// const transactionReceipt2 = await transactionAddBook2.wait();
	// if (transactionReceipt2.status != 1) { // 1 means success
	// 	console.log("Transaction was not successful")
	// 	return
	// }

	// const bookIds = await bookLibraryContract.getAllBookIds()
	// console.log("All books", bookIds)

    const transactionRentBukvar = await bookLibraryContract.borrowBook(parseInt(Number("0xaa8864d3e047d00739e9f7769cf1b2be5489911d830cdd15f487dfa7996193e2")));
	console.log("Rent bukvar Submission Transaction:", transactionRentBukvar.hash);
	
	const transactionReceiptBukvar = await transactionRentBukvar.wait();
	if (transactionReceiptBukvar.status != 1) { // 1 means success
		console.log("Transaction was not successful")
		return
	} else{
        console.log(transactionReceiptBukvar)
    }

    const transactionGetAvailableBooksCopiesById = await bookLibraryContract.getAvailableBooksCopiesById(parseInt(Number("0xaa8864d3e047d00739e9f7769cf1b2be5489911d830cdd15f487dfa7996193e2")));
	console.log("GetAvailableBooksCopiesById Submission Transaction:", transactionGetAvailableBooksCopiesById.hash);
	
	const transactionReceiptGetAvailableBooksCopiesById = await transactionGetAvailableBooksCopiesById.wait();
	if (transactionReceiptGetAvailableBooksCopiesById.status != 1) { // 1 means success
		console.log("Transaction was not successful")
		return
	}

    const remainingCopies = await bookLibraryContract.getAvailableBooksCopiesById(parseInt(Number("0xaa8864d3e047d00739e9f7769cf1b2be5489911d830cdd15f487dfa7996193e2")));
	console.log("Available copies of bukvar: ", remainingCopies)

    // const transactionCheckIfRented = await bookLibraryContract.hasAlreadyBorrowedOnce.
	// console.log("Rent bukvar Submission Transaction:", transactionCheckIfRented.hash);
	
	// const transactionReceiptCheckIfRented = await transactionCheckIfRented.wait();
	// if (transactionReceiptCheckIfRented.status != 1) { // 1 means success
	// 	console.log("Transaction was not successful")
	// 	return
	// }

}

run()