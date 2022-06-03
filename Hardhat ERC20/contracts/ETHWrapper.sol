// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./WETH.sol";

contract ETHWrapper {
    WETH public WETHToken;

    event LogETHWrapped(address sender, uint256 amount);
    event LogETHUnwrapped(address sender, uint256 amount);

    constructor() public {
        WETHToken = new WETH();
    }

    fallback() external payable {
        wrap();
    }

    receive() external payable {
        wrap();
    }

    function wrap() public payable {
        require(msg.value > 0, "We need to wrap at least 1 wei");
        WETHToken.mint(msg.sender, msg.value);
        emit LogETHWrapped(msg.sender, msg.value);
    }

    function recoverSigner(
        bytes32 hashedMessage,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal returns (address) {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hashedMessage)
        );
        return ecrecover(messageDigest, v, r, s);
    }

    function wrapWithSignature(
        bytes32 hashedMessage,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address receiver
    ) public payable {
        require(msg.value > 0, "We need to wrap at least 1 wei");
        require(
            recoverSigner(hashedMessage, v, r, s) == receiver,
            "Receiver does not signed the message"
        );
        WETHToken.mint(msg.sender, msg.value);
        emit LogETHWrapped(msg.sender, msg.value);
    }

    function unwrap(uint256 value) public {
        require(value > 0, "We need to unwrap at least 1 wei");
        WETHToken.transferFrom(msg.sender, address(this), value);
        WETHToken.burn(value);
        payable(msg.sender).transfer(value);
        emit LogETHUnwrapped(msg.sender, value);
    }
}
