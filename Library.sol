// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookLibrary is Ownable { 

    struct Book {
        string title;
        uint copiesCount;
    }

    uint[] public bookIds;
    mapping(uint => Book) public Library;
    mapping(address => mapping(uint => bool)) private hasCurrentlyBorrowed;
    mapping(address => mapping(uint => bool)) private hasAlreadyBorrowedOnce;
    mapping(uint => address[]) public borrowersAddresses;

    modifier atLeastOneCopy(uint _bookId) {
        require(Library[_bookId].copiesCount > 0, "No more copies of the book are currently available!");
        _;
    }

    function _generateIdFromTitle(string memory _title) private pure returns (uint) {
        uint id = uint(keccak256(abi.encodePacked(_title)));
        return id;
    }

    function addNewBookAndCopiesCount(string memory _title, uint _copies) public onlyOwner {
        require(_copies > 0, "You have to add at least one copy of the book in the library!");
        uint bookId = _generateIdFromTitle(_title);
        bookIds.push(bookId);
        Library[bookId] = Book(_title, _copies);
    }

    function borrowBook(uint _bookId) public atLeastOneCopy(_bookId) {
        require(!hasCurrentlyBorrowed[msg.sender][_bookId], "You have already borrowed a copy of the book, please return it first!");
        hasCurrentlyBorrowed[msg.sender][_bookId] = true;
        Library[_bookId].copiesCount--;
        require(!hasAlreadyBorrowedOnce[msg.sender][_bookId]);
        borrowersAddresses[_bookId].push(msg.sender);
        hasAlreadyBorrowedOnce[msg.sender][_bookId] = true;
    }

    function returnBook(uint _bookId) public {
        require(hasCurrentlyBorrowed[msg.sender][_bookId], "You do not have currently borrowed a copy of this book!");
        Library[_bookId].copiesCount++;
        hasCurrentlyBorrowed[msg.sender][_bookId] = false;
    }

    function getAllBookIds() public view returns(uint[] memory) {
        return bookIds;
    }

    function getAvailableBooksCopiesById(uint _bookId) public view returns(uint) {
        uint remainingCopies = Library[_bookId].copiesCount;
        return remainingCopies;
    }
    
    function getAllBorrowersOfBook(uint _bookId) public view returns(address[] memory) {
        return borrowersAddresses[_bookId];
    }
}