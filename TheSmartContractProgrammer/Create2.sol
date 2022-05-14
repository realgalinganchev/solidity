// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract DeployWithCreate2 {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }
}

contract Create2Factory {
    bytes private _bytecode;

    function deploy(uint _salt)         
        public 
        returns (address) {
        DeployWithCreate2 _contract = new DeployWithCreate2{
            salt: bytes32(_salt)
        }(msg.sender);

        return address(_contract);
    }

    function getAddress(uint _salt)
        public
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xFF), address(this), _salt, keccak256(_bytecode)
            )
        );

        return address(uint160(uint(hash)));
    }

    function getByteCode(address _owner) public {
        bytes memory bytecode = type(DeployWithCreate2).creationCode;
        _bytecode = abi.encodePacked(bytecode, abi.encode(_owner));
    }
}