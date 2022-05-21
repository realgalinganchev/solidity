const hre = require("hardhat");
const BookLibrary = require('../artifacts/contracts/BookLibrary.sol/BookLibrary.json')
const { BigNumber, ethers, utils } = require("ethers");
const deployBookLibraryContract = require('./deploy-testnets')

// always check new contractAddress if interacting with a local hardhat node
// check that you are in scripts folder
const run = async function () {
    const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545")
    const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider)
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const bookLibraryContract = new hre.ethers.Contract(contractAddress, BookLibrary.abi, wallet)

    // - Creates a new book and adds it to the library - please provide new book name

    const initialCopies = 5
    const transactionAddBook = await bookLibraryContract.addNewBookAndCopiesCount('The Old Curiosity Shop', initialCopies).catch(err => console.log(err.error))
    let transactionAddBookReceipt = await transactionAddBook.wait().catch(err => console.log(err.error))

    let bookId = transactionAddBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.bookId.toString()
    let title = transactionAddBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.title.toString()
    let copiesCount = transactionAddBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.copiesCount.toString()

    console.log(`You have added ${copiesCount} copies of the new book ${title} in the library.`)
    

    // - Adds copies to a book already existing in the library - please provide name pf a book already existing in the library

    const newCopiesAddedCount = 10
    const transactionAddCopiesBook1 = await bookLibraryContract.addCopiesToExistingBook('bible', newCopiesAddedCount).catch(err => console.log(err.error))
    let transactionAddCopiesBook1Receipt = await transactionAddCopiesBook1.wait().catch(err => console.log(err.error))

    let title1 = transactionAddCopiesBook1Receipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.title.toString()
    let copiesCount1 = transactionAddCopiesBook1Receipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.copiesCount.toString()


    console.log(`You have added ${newCopiesAddedCount} copies of the book: ${title1}. There are now ${copiesCount1} copies of it in the library.`);


    //- Rents a book

    const t1  = await bookLibraryContract.borrowBook(bookId).catch(err=> console.log(err.error))
    let r1 = await t1.wait();
    const newTitle = r1.events?.filter((x) => {return x.event == "BookStatus"})[0].args.title.toString()
    console.log("You have rented: ", newTitle)


    // Checks all available books

    const allBooks = await bookLibraryContract.getAllBooksInLibrary().catch(err => console.log(err.error))
    const availableBooks = allBooks.filter(book => parseInt(book.copiesCount) != 0);
    const formatedAllBooks = availableBooks.map(nested => nested.map(element => element.toString()));
    console.table(formatedAllBooks)


    // - Checks that it is rented

    let updatedCopiesCount = r1.events?.filter((x) => {return x.event == "BookStatus"})[0].args.copiesCount.toString()
    if (copiesCount > updatedCopiesCount){
        console.log(r1.events?.filter((x) => {return x.event == "BookStatus"})[0].args.title.toString(), "is currently rented." );
    }


    // - Returns the book

    const t2  =  await bookLibraryContract.returnBook(bookId)
    let r2 = await t2.wait();
    console.log("You have returned: ", r2.events?.filter((x) => {return x.event == "BookStatus"})[0].args.title.toString())

    
    // - Checks the availability of the book
    
    const availableBooksCopies  = await bookLibraryContract.getAvailableBooksCopiesById(bookId)
    console.log(`There are ${availableBooksCopies} copies of ${title} left in the library.`)
}

run()