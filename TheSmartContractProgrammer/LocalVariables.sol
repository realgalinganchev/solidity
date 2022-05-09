// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract LocalVariables {
    uint public i;

    function foo() external {
        uint b = 123;
        b += 123;
        i = b;
    }
}
