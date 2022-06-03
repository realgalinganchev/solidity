// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LIB.sol";

contract BookLibrary is Ownable {
    event BookStatus(uint256 bookId, string title, uint256 copiesCount);

    LIB public LIBToken;

    constructor() {
        LIBToken = new LIB();
    }

    struct Book {
        string title;
        uint256 copiesCount;
    }

    uint256[] public bookIds;
    mapping(uint256 => Book) public Library;
    mapping(address => mapping(uint256 => bool)) private hasCurrentlyBorrowed;
    mapping(address => mapping(uint256 => bool)) private hasBorrowedBookOnce;
    mapping(uint256 => address[]) public borrowersAddresses;

    modifier atLeastOneCopy(uint256 _bookId) {
        require(
            Library[_bookId].copiesCount > 0,
            "No more copies of the book are currently available!"
        );
        _;
    }

    function mint() public payable {
        LIBToken.mint(msg.sender, msg.value);
    }

    function generateIdFromTitle(string memory _title)
        public
        pure
        returns (uint256)
    {
        return uint256(keccak256(abi.encodePacked(_title)));
    }

    function addNewBookAndCopiesCount(
        string memory _title,
        uint256 _copiesCount
    ) public onlyOwner 
    {
        require(
            _copiesCount > 0,
            "You have to add at least one copy of the book in the library!"
        );
        uint256 bookId = generateIdFromTitle(_title);
        require(
            bytes(Library[bookId].title).length == 0,
            "You have already added this book in the library, try using addCopiesToExistingBook!"
        );
        bookIds.push(bookId);
        Library[bookId] = Book(_title, _copiesCount);
        emit BookStatus(bookId, _title, _copiesCount);
        // return bookId;
    }

    //external
    function addCopiesToExistingBook(string memory _title, uint256 _copiesCount)
        public
        onlyOwner
    {
        require(
            _copiesCount > 0,
            "You have to add at least one copy of the book in the library!"
        );
        uint256 bookId = generateIdFromTitle(_title);
        Library[bookId].copiesCount += _copiesCount;
        emit BookStatus(bookId, _title, Library[bookId].copiesCount);
        // return bookId;
    }

    function borrowBook(
        uint256 _bookId,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public atLeastOneCopy(_bookId) {
        require(
            !hasCurrentlyBorrowed[msg.sender][_bookId],
            "You have already borrowed a copy of the book, please return it first!"
        );
        hasCurrentlyBorrowed[msg.sender][_bookId] = true;

        LIBToken.permit(
            msg.sender,
            address(this),
            value,
            deadline,
            v,
            r,
            s
        );
        LIBToken.transferFrom(msg.sender, address(this), value); //borrowPrice?

        Library[_bookId].copiesCount--;
        if (!hasBorrowedBookOnce[msg.sender][_bookId]) {
            borrowersAddresses[_bookId].push(msg.sender);
            hasBorrowedBookOnce[msg.sender][_bookId] = true;
        }
        emit BookStatus(
            _bookId,
            Library[_bookId].title,
            Library[_bookId].copiesCount
        );
    }

    function returnBook(uint256 _bookId) public {
        require(
            hasCurrentlyBorrowed[msg.sender][_bookId],
            "You do not have currently borrowed a copy of this book!"
        );
        Library[_bookId].copiesCount++;
        hasCurrentlyBorrowed[msg.sender][_bookId] = false;
        emit BookStatus(
            _bookId,
            Library[_bookId].title,
            Library[_bookId].copiesCount
        );
    }

    function getAllBookIds() public view returns (uint256[] memory) {
        return bookIds;
    }

    function getAvailableBooksCopiesById(uint256 _bookId)
        public
        view
        returns (uint256)
    {
        return Library[_bookId].copiesCount;
    }

    function getAllBorrowersOfBook(uint256 _bookId)
        public
        view
        returns (address[] memory)
    {
        return borrowersAddresses[_bookId];
    }

    function getAllBooksInLibrary() public view returns (Book[] memory) {
        Book[] memory books = new Book[](bookIds.length);
        for (uint256 index = 0; index < bookIds.length; index++) {
            books[index] = Library[bookIds[index]];
        }
        return books;
    }
}
