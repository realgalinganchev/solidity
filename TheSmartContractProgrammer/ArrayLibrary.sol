// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library ArrayLibrary {
    function find(uint[] storage arr, uint x) internal view returns (uint) {
        for(uint i=0; i < arr.length; i++){
            if(arr[i] == x) {
                return i;
            }
        }
        revert("not found");
    }
}

contract TestArray {
    using ArrayLibrary for uint[];
    uint[] public arr = [3,2,1];

    function testFind(uint _x) external view returns (uint i) {
        //return ArrayLibrary.find(arr, 2);
        return arr.find(_x);
    }
}