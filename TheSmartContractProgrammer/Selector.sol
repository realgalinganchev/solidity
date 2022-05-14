// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract FunctionSelector {
    function getSelector(string calldata _func) external pure returns(bytes4){
        return bytes4(keccak256(bytes(_func))); //0xa9059cbb
    }
}

contract Receiver {
    event Log(bytes data);

    function transfer(address _to, uint _amount) external {
        emit Log(msg.data);
        // encoded i
        //0xa9059cbb   - the first 4 bytes encodes the function to call - Function Selector
        //0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc - address 
        //4000000000000000000000000000000000000000000000000000000000000000b - amount in Hex(11 we passed)

    }
}