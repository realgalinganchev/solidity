const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BookLibrary", function () {   
    let bookLibraryFactory;
    let bookLibrary;
    let addr1;
    
    before(async () => {
        bookLibraryFactory = await ethers.getContractFactory("BookLibrary");
        const [owner, addr1] = await ethers.getSigners();
        bookLibrary = await bookLibraryFactory.deploy();
        await bookLibrary.deployed();
        await bookLibrary.connect(addr1);
    });
});