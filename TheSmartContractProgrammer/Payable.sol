// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Payable {
    // Payable address can receive Ether
    address payable public owner;

    // Payable constructor can receive Ether - works with keyword and without

    // constructor() payable {
    //     owner = payable(msg.sender);
    // }

    constructor() {
        owner = payable(msg.sender);
    }

    // Function to deposit Ether into this contract.
    // Call this function along with some Ether.
    // The balance of this contract will be automatically updated.
    function deposit() public payable {}

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
