// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;


/*
fallback() or receive()?

    Ether is sent to contract
                |
        is msg.data empty?
              / \
            yes  no
            /     \
receive() exists?  fallback()
          /  \
        yes   no
        /      \
    receive()  fallback()
*/

contract Fallback {
    event Log(string func, address sender, uint value, bytes data);

    // Fallback function must be declared as external.
    fallback() external payable {
        emit Log("fallback", msg.sender, msg.value, msg.data);
    }

    receive() external payable {
        emit Log("receive", msg.sender, msg.value, "");
    }
}