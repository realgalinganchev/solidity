const hre = require("hardhat");
const BookLibrary = require('../artifacts/contracts/BookLibrary.sol/BookLibrary.json')

//https://ropsten.etherscan.io/address/0xb60A0012C2E0fc9B83ca3C13f279F12F9dA9Ea80#code
// Contract address 0xb60A0012C2E0fc9B83ca3C13f279F12F9dA9Ea80

const run = async function () {
	const provider = new hre.ethers.providers.InfuraProvider("ropsten", "ab0b32b1a6484c3f94a5753a083ddd11")
	const wallet = new hre.ethers.Wallet("0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0", provider)
	const contractAddress = "0xb60A0012C2E0fc9B83ca3C13f279F12F9dA9Ea80"
	const bookLibraryContract = new hre.ethers.Contract(contractAddress, BookLibrary.abi, wallet)

	// - Creates a new book and adds it to the library - please provide new book name

	const initialCopies = 5
	const txAddNewBook = await bookLibraryContract.addNewBookAndCopiesCount('The War Of Art', initialCopies).catch(err => console.log(err.error))
	const txAddNewBookReceipt = await txAddNewBook.wait().catch(err => console.log(err.error))

	const bookId = txAddNewBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.bookId.toString()
	const title = txAddNewBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.title.toString()
	const copiesCount = txAddNewBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.copiesCount.toString()

	console.log(`You have added ${copiesCount} copies of the new book ${title} in the library.`)


	//- Adds copies to a book already existing in the library - please provide name of a book already existing in the library

	const newCopiesAddedCount = 10
	const txAddCopies = await bookLibraryContract.addCopiesToExistingBook('Oliver Twist', newCopiesAddedCount).catch(err => console.log(err.error))
	const txAddCopiesReceipt = await txAddCopies.wait().catch(err => console.log(err.error))

	const titleExistingBook = txAddCopiesReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.title.toString()
	const updatedCopiesCountExistingBook = txAddCopiesReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.copiesCount.toString()

	console.log(`You have added ${newCopiesAddedCount} copies of the book: ${titleExistingBook}. There are now ${updatedCopiesCountExistingBook} copies of it in the library.`);


	// Checks all available books

	const allBooks = await bookLibraryContract.getAllBooksInLibrary().catch(err => console.log(err.error))
	const availableBooks = allBooks.filter(book => parseInt(book.copiesCount) != 0);
	const formattedAvailableBooks = availableBooks.map(nested => nested.map(element => element.toString()));

	console.table(formattedAvailableBooks)


	//- Rents a book

	const txBorrow = await bookLibraryContract.borrowBook(bookId).catch(err => console.log(err.error))
	const receiptBorrow = await txBorrow.wait();
	const borrowedTitle = receiptBorrow.events?.filter((x) => { return x.event == "BookStatus" })[0].args.title.toString()

	console.log("You have rented: ", borrowedTitle)


	// - Checks that it is rented

	const updatedCopiesCount = txBorrow.events?.filter((x) => { return x.event == "BookStatus" })[0].args.copiesCount.toString()
	if (copiesCount > updatedCopiesCount) {
		console.log(receiptBorrow.events?.filter((x) => { return x.event == "BookStatus" })[0].args.title.toString(), "is currently rented.");
	}


	// - Returns the book

	const txReturn = await bookLibraryContract.returnBook(bookId)
	const receiptReturn = await txReturn.wait();
	console.log("You have returned: ", receiptReturn.events?.filter((x) => { return x.event == "BookStatus" })[0].args.title.toString())


	// - Checks the availability of the book

	const availableBooksCopies = await bookLibraryContract.getAvailableBooksCopiesById(bookId)
	console.log(`There are ${availableBooksCopies} copies of ${title} left in the library.`)
}

run()