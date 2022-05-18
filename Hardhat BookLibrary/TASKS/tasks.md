Tasks

# Create a Hardhat project for your Book Library contracts and put it in a Github repository
done
# Read about [OpenZeppelin](https://www.notion.so/OpenZeppelin-101-Est-time-10-30-mins-52ec727e5694450498e5e2a53b8c890c) and modify the contract to use OpenZeppelin Ownable instead of your own.
done
# Modify the scripts and deploy them on Hardhat local node.

PS C:\Users\galin\Desktop\solidity\Hardhat BookLibrary> npx hardhat --network localhost deploy-testnets
Nothing to compile
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000000000000000000000
Waiting for BookLibrary deployment...
BookLibrary Contract address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Done!
# Add configuration for deployment on Rinkeby. Note and save your deployed contract address.
Since on Rinkeby was not possible because of network congestion, contract was deployed on Ropsten.
https://ropsten.etherscan.io/address/0xE21460B65Edb58638c042fbb48eD52D99566E93D#code
# Implement testing scenarios for the Book Library contract
see /test/library-test.js
# Think about more use cases to cover in the tests
done
# Run Solidity Coverage Report & Try to hit 100% coverage for your Smart Contract
PS C:\Users\galin\Desktop\solidity\Hardhat BookLibrary> npx hardhat coverage

Version
=======
> solidity-coverage: v0.7.21

Instrumenting for coverage...
=============================

> BookLibrary.sol

Compilation:
============

Nothing to compile

Network Info
============
> HardhatEVM: v2.5.0
> network:    hardhat



  BookLibrary
    √ Should add at least one copy of a new book to the library
    √ Should add at least one more copy to a book already existing in the library
    √ Should add the book's id in the bookIds array (166ms)
    √ Should not be able to add a book with the same name twice
    √ Should only change the number of copies to a book already existing in the library (423ms)
    √ Should return the same number of copies when noone has borrowed yet (171ms)
    √ Should not be able to borrow if no more copies of the book are currently available (278ms)
    √ Should keep the borrowers of each book unique (323ms)
    √ Should return the updated number of copies when someone borrow, return a copy (231ms)
    √ Should return all the borrowers of a book (271ms)
    √ Should return the updated number of copies when someone borrow, return a copy (133ms)
    √ Should first return the currently borrowed copy of a book before borrowing the same book again (220ms)


  12 passing (3s)

------------------|----------|----------|----------|----------|----------------|
File              |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------|----------|----------|----------|----------|----------------|
 contracts\       |      100 |      100 |      100 |      100 |                |
  BookLibrary.sol |      100 |      100 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
All files         |      100 |      100 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
# Create Hardhat tasks for deployment
see /scripts folder
# Create subtasks for printing valuable info after deployment
done
# Read any sensitive data (account private keys, API key and etc. from .env file)
done
# Add to the deployment tasks subtasks for Etherscan verification of the contracts
done