const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BookLibrary", function () {   
    let bookLibraryFactory;
    let bookLibrary;
    let owner;
    let addr1;
 
    before(async () => {
        bookLibraryFactory = await ethers.getContractFactory("BookLibrary");
        [owner, addr1] = await ethers.getSigners();
        bookLibrary = await bookLibraryFactory.deploy();
        await bookLibrary.deployed();
    });

    it("Should add at least one copy of a book to the library", async function () {
        const title = "bible";
        const copiesCount = 0
        expect(bookLibrary.addNewBookAndCopiesCount(title, copiesCount)).to.be.revertedWith('You have to add at least one copy of the book in the library!');
    });

    it("Should add the book's id in the bookIds array", async function () {
        const title = "bible";
        const copiesCount = 1
        await bookLibrary.addNewBookAndCopiesCount(title, copiesCount);
        expect(await bookLibrary.getAllBookIds()).to.have.lengthOf(1);  
    });

    it("Should return the same number of copies when noone has borrowed yet", async function () {
        const title = "bible";
        const copiesCount = 3
        await bookLibrary.addNewBookAndCopiesCount(title, copiesCount);
        const id = await bookLibrary.generateIdFromTitle(title);
        expect(await bookLibrary.getAvailableBooksCopiesById(id)).to.be.equal(copiesCount);    
    });

    it("Should return the updated number of copies when someone borrow, return a copy", async function () {
        const title = "bible";
        const copiesCount = 3
        await bookLibrary.addNewBookAndCopiesCount(title, copiesCount);
        const id = await bookLibrary.generateIdFromTitle(title);
        await bookLibrary.borrowBook(id);
        expect(await bookLibrary.getAvailableBooksCopiesById(id)).to.be.equal(copiesCount - 1);   
        await bookLibrary.returnBook(id); 
        expect(await bookLibrary.getAvailableBooksCopiesById(id)).to.be.equal(copiesCount);  
    });
    
    it("Should return all the borrowers of a book", async function () {
        const title = "bible";
        const copiesCount = 3
        await bookLibrary.addNewBookAndCopiesCount(title, copiesCount);
        const id = await bookLibrary.generateIdFromTitle(title);
        await bookLibrary.connect(addr1).borrowBook(id);   
        expect(await bookLibrary.getAllBorrowersOfBook(id)).to.eql([owner.address, addr1.address]);
    });
});