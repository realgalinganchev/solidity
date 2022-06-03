// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./LIB.sol";

contract LIBDeployer {
    LIB public LIBToken;
    event LogLIBTokenMinted(address sender, uint256 amount);

    constructor() {
        LIBToken = new LIB();
    }

    function mint() public payable {
        LIBToken.mint(msg.sender, msg.value);
        emit LogLIBTokenMinted(msg.sender, msg.value);
    }

    function send(
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public payable {
        LIBToken.permit(msg.sender, address(this), value, deadline, v, r, s);
        require(
            LIBToken.transferFrom(msg.sender, address(this), value) == true,
            "Transaction failed"
        );
    }
}
