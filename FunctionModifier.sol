// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract FunctionModifier {
    uint public count;
    bool public paused;

    modifier whenNotPaused(){
        require(!paused, "paused");
        _;
    }

    function setPause(bool _paused) external {
        paused = _paused;
    }

    function inc() external whenNotPaused{
        count += 1;
    }
    
    function dec() external whenNotPaused {
        count -= 1;
    }

    modifier cap(uint _x) {
        require(_x < 100, "x >= 100");
        _;
    }

    function incBy(uint _x) external whenNotPaused cap(_x) {
        count += _x;
    }

    modifier sandwich() {
        //code here
        count += 10;
        _;
        if( count < 100){
            count *= 10;
        } else {
            count *= 1;
        }

    }

    function foo() external sandwich {
        count += 1;
    }
}