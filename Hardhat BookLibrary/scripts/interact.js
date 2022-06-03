const hre = require("hardhat");
const BookLibrary = require('../artifacts/contracts/BookLibrary.sol/BookLibrary.json')

const run = async function () {
	const provider = new hre.ethers.providers.JsonRpcProvider("http://localhost:8545")
	const walletOwner = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider)

	const contractAddress = "0x851356ae760d987E095750cCeb3bC6014560891C"  // paste BookLibraryContract address here
	const bookLibraryContract = new hre.ethers.Contract(contractAddress, BookLibrary.abi, walletOwner)
	const balanceBefore = await provider.getBalance(bookLibraryContract.address);
	console.log('balance before mint:>> ', balanceBefore.toString());

	const mintValue = hre.ethers.utils.parseEther("1")
	const mintTx = await bookLibraryContract.mint({
		value: mintValue,
		gasLimit: 300000,
		gasPrice: 100000000000,
	})
	await mintTx.wait()
	const balanceAfter = await provider.getBalance(bookLibraryContract.address);
	console.log('balance after mint:>> ', balanceAfter.toString());

	const value = hre.ethers.utils.parseEther("0.0001")
	const LIBFactory = await hre.ethers.getContractFactory("LIB");
	const libAddress = await bookLibraryContract.LIBToken();
	const LIBContract = await LIBFactory.attach(libAddress)
	const [account] = await provider.listAccounts();

	const onAttemptToApprove = async () => {
		// Account here is the wallete address
		const nonce = (await LIBContract.nonces(account)); // Our Token Contract Nonces
		const deadline = 1685776964; // Permit with deadline which the permit is valid
		const wrapValue = hre.ethers.utils.parseEther("0.0001"); // Value to approve for the spender to use

		const EIP712Domain = [ // array of objects -> properties from the contract and the types of them ircwithPermit
			{ name: 'name', type: 'string' },
			{ name: 'version', type: 'string' },
			{ name: 'verifyingContract', type: 'address' }
		];

		const domain = {
			name: await LIBContract.name(),
			version: '1',
			verifyingContract: LIBContract.address
		};

		const Permit = [ // array of objects -> properties from erc20withpermit
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' }
		];

		const message = {
			owner: account, // Wallet Address
			spender: bookLibraryContract.address, // This is the address of the spender whe want to give permit to.
			value: wrapValue.toString(),
			nonce: nonce.toHexString(),
			deadline
		};

		const data = JSON.stringify({
			types: {
				EIP712Domain,
				Permit
			},
			domain,
			primaryType: 'Permit',
			message
		});

		const signatureLike = await provider.send('eth_signTypedData_v4', [account, data]); // Library is a provider.
		const signature = await hre.ethers.utils.splitSignature(signatureLike);

		const preparedSignature = {
			v: signature.v,
			r: signature.r,
			s: signature.s,
			deadline
		};

		return preparedSignature;
	}
	// - Creates a new book and adds it to the library - please provide new book name

	const initialCopies = 5
	const txAddNewBook = await bookLibraryContract.addNewBookAndCopiesCount('The War Of Art', initialCopies).catch(err => console.log(err.error))
	const txAddNewBookReceipt = await txAddNewBook.wait().catch(err => console.log(err.error))

	const bookId = txAddNewBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.bookId.toString()
	const title = txAddNewBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.title.toString()
	const copiesCount = txAddNewBookReceipt.events?.filter((x) => { return x.event == "BookStatus" })[0].args.copiesCount.toString()

	console.log(`You have added ${initialCopies} copies of the new book ${title} in the library. There are now ${copiesCount} copies of it in the library.`)


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

	const sig = await onAttemptToApprove();
	const txBorrow = await bookLibraryContract
		.borrowBook(bookId, value, sig.deadline, sig.v, sig.r, sig.s, { gasLimit: 300000, gasPrice: 100000000000 })

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
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});