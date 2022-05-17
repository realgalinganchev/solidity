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

    it("Should add at least one more copy to a book already existing in the library", async function () {
        const title = "bible";
        const copiesCount = 0
        expect(bookLibrary.addCopiesToExistingBook(title, copiesCount)).to.be.revertedWith('You have to add at least one copy of the book in the library!');
    });
        
    it("Should add the book's id in the bookIds array", async function () {
        const title = "The Hobbit"
        const copiesCount = 1

        await expect(bookLibrary.addNewBookAndCopiesCount(title, copiesCount))
        .to.emit(bookLibrary, 'BookStatus')
        .withArgs(("84230832877629583780746185358427066280366952236084699221992199844503228054584").toString(), title, copiesCount)

        expect(await bookLibrary.getAllBookIds()).to.have.lengthOf(1)
    });

    it("Should only change the number of copies to a book already existing in the library", async function () {
        const title = "bible";
        const copiesCount = 1
        bookLibrary.addNewBookAndCopiesCount(title, copiesCount)
        const extraCopiesCount = 2

        await expect(bookLibrary.addCopiesToExistingBook(title, extraCopiesCount))
        .to.emit(bookLibrary, 'BookStatus')
        .withArgs(("96883630919475513356543269027156640532729329066327600914689320938501925887558").toString(), title, copiesCount + extraCopiesCount)
    });

    it("Should return the same number of copies when noone has borrowed yet", async function () {
        const title = "war and peace"
        const copiesCount = 3
        const id = bookLibrary.generateIdFromTitle(title);

        await expect(bookLibrary.addNewBookAndCopiesCount(title, copiesCount))
        .to.emit(bookLibrary, 'BookStatus')
        .withArgs(("66903904389597564991095457362327425633822547619116603397763695148452436405696").toString(), title, copiesCount)

        expect(await bookLibrary.getAvailableBooksCopiesById(id)).to.equal(copiesCount)
    });

    it("Should return the updated number of copies when someone borrow, return a copy", async function () {
        const title = "the power of now"
        const copiesCount = 3
        const id = await bookLibrary.generateIdFromTitle(title)

        await expect(bookLibrary.addNewBookAndCopiesCount(title, copiesCount))
        .to.emit(bookLibrary, 'BookStatus')
        .withArgs(("87281506753646606480762486071037790706569629491224692871968275297991812596141").toString(), title, copiesCount)

        await expect(bookLibrary.borrowBook(id))
        .to.emit(bookLibrary, 'BookStatus')
        .withArgs(("87281506753646606480762486071037790706569629491224692871968275297991812596141").toString(), title, copiesCount - 1)

        await expect(bookLibrary.returnBook(id))
        .to.emit(bookLibrary, 'BookStatus')
        .withArgs(("87281506753646606480762486071037790706569629491224692871968275297991812596141").toString(), title, copiesCount)
    });
    
    it("Should return all the borrowers of a book", async function () {
        const title = "the bitcoin standard"
        const copiesCount = 3
        const id = await bookLibrary.generateIdFromTitle(title);

        await expect(bookLibrary.addNewBookAndCopiesCount(title, copiesCount))
        .to.emit(bookLibrary, 'BookStatus')
        .withArgs(("105565901557796790361399136131187206998536078001035274386827783214498766687001").toString(), title, copiesCount)

        await bookLibrary.connect(owner).borrowBook(id)  
        await bookLibrary.connect(addr1).borrowBook(id)   
        expect(await bookLibrary.getAllBorrowersOfBook(id)).to.eql([owner.address, addr1.address])
    });
});