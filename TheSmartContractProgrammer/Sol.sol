-Sol.sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

// safe math
contract SafeMath {
    function testUnderflow() public pure returns (uint){
        uint x = 0;
        x--;
        return x;
    }

    function testUnderUncheckedflow() public pure returns (uint){
        uint x = 0;
        unchecked {x--;}
        return x;
    }
}

