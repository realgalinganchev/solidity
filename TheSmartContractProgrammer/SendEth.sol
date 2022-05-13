
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract SendEther {

    constructor() payable {}

    receive() external payable {}

    function sendViaTransfer(address payable _to) public payable {
        // This function is no longer recommended for sending Ether.
        _to.transfer(123);
    }

    function sendViaSend(address payable _to) public payable {
        // Send returns a boolean value indicating success or failure.
        // This function is not recommended for sending Ether.
        bool sent = _to.send(123);
        require(sent, "Failed to send Ether");
    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use ?? very little gas sent
        (bool sent,) = _to.call{value: 123}("");
        require(sent, "Failed to send Ether");
    }
}

contract EthRecevier {
    event Log(uint amount, uint  gas);
    
    receive() external payable {
        emit Log(msg.value, gasleft());
    }
}
