// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// NOTE: Deploy this contract first
contract B {
    // NOTE: storage layout must be the same as contract A
    uint public num;
    address public sender;

    function setVars(uint _num) public payable {
        num = 2 * _num;
        sender = msg.sender;
    }
}

contract A {
    uint public num;
    address public sender;

    function setVars(address _contract, uint _num) public payable {
        // A's storage is set, B is not modified.

        // (bool success, bytes memory data) = _contract.delegatecall(
        //     abi.encodeWithSignature("setVars(uint256)", _num)
        // );

        (bool success, ) = _contract.delegatecall(
            abi.encodeWithSelector(B.setVars.selector, _num)
        );
        require(success, "Delegatecall failed!");
    }
}