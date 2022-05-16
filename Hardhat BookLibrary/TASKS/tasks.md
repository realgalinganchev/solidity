Tasks

# Create a Hardhat project for your Book Library contracts and put it in a Github repository
--
# Read about [OpenZeppelin](https://www.notion.so/OpenZeppelin-101-Est-time-10-30-mins-52ec727e5694450498e5e2a53b8c890c) and modify the contract to use OpenZeppelin Ownable instead of your own.
--
# Modify the scripts and deploy them on Hardhat local node.
-- 
PS C:\Users\galin\Desktop\solidity\Hardhat BookLibrary> npx hardhat --network localhost deploy-testnets
Nothing to compile
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000000000000000000000
Waiting for BookLibrary deployment...
BookLibrary Contract address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Done!
# Add configuration for deployment on Rinkeby. Note and save your deployed contract address.
Since on Rinkeby was not possible because of network congestion, contract was deployed on Ropsten.
https://ropsten.etherscan.io/address/0x529B82474e71DB5ace9a6c387001Eb2c90A67f8f#code
# Implement testing scenarios for the Book Library contract
see /test/library-test.js
# Think about more use cases to cover in the tests
--
# Run Solidity Coverage Report & Try to hit 100% coverage for your Smart Contract
Network Info
============
> HardhatEVM: v2.5.0
> network:    hardhat

  BookLibrary
    √ Should add at least one copy of a book to the library
    √ Should add the book's id in the bookIds array (173ms)
    √ Should return the same number of copies when noone has borrowed yet (137ms)
    √ Should return the updated number of copies when someone borrow, return a copy (252ms)
    √ Should return all the borrowers of a book (162ms)

  5 passing (1s)

------------------|----------|----------|----------|----------|----------------|
File              |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------|----------|----------|----------|----------|----------------|
 contracts\       |      100 |     62.5 |      100 |      100 |                |
  BookLibrary.sol |      100 |     62.5 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
All files         |      100 |     62.5 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
# Create Hardhat tasks for deployment
see /scripts folder
# Create subtasks for printing valuable info after deployment
--
# Read any sensitive data (account private keys, API key and etc. from .env file)
done
# Add to the deployment tasks subtasks for Etherscan verification of the contracts
done