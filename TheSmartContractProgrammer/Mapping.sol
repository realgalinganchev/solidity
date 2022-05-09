// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Mapping {
    mapping(address => uint) public balances;
    mapping(address => mapping(address => bool)) public isFriend;

    function examples() external {
        balances[msg.sender] = 123;
        uint bal = balances[msg.sender];
        //uint bal2 = balances[address(1)];    //0
            
        //balances[msg.sender] = bal2;
        //isFriend[msg.sender][address(this)] = true;
    }

    function getAddressOfContract() public view returns (address) {
       return address(this);
    }
}
//0x26b989b9525Bb775C8DEDf70FeE40C36B397CE67