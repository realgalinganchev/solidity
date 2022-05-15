// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract TimeLock {
    error NotOwnerError();
    error AlreadyQueuedError(bytes32 txId);
    error TimestampNotInRangeError(uint blockTimestamp, uint timestamp);
    error NotQueuedError(bytes32 txId);
    error TimestampNotPassedError(uint blockTimestamp, uint timestamp);
    error TimestampExpiredError(uint blockTimestamp, uint expiresAt);
    error TxFailedError();

    event Queue(
        bytes32 indexed txId,        
        address indexed target,
        uint value,
        string func,
        bytes data,
        uint timestamp
    );

    event Execute(
        bytes32 indexed txId,        
        address indexed target,
        uint value,
        string func,
        bytes data,
        uint timestamp
    );

    event Cancel(bytes32 indexed txId);

    uint public constant MIN_DELAY = 10;
    uint public constant MAX_DELAY = 1000;
    uint public constant GRACE_PERIOD = 1000;

    address public owner;
    mapping(bytes32 => bool) public queued;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    modifier onlyOwner(){
        if (msg.sender != owner){
            revert NotOwnerError();
        }
        _;
    }

    function getTxId(
        address _target,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        uint _timestamp
    ) public pure returns (bytes32 txId){
        return keccak256(
            abi.encode(
                _target, _value, _func, _data, _timestamp
            )
        );
    }

    function queue(
        address _target,           // address of target contract
        uint _value,               // eth to be sent
        string calldata _func,     // name of func inside target contract as String I.e. "test()"
        bytes calldata _data,      // default value for testing - 0x00
        uint _timestamp
    ) external onlyOwner {
        // create tx id
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);

        //check if tx id unique
        if (queued[txId]){
            revert AlreadyQueuedError(txId);
        }

        // check timestamp
        //
        //                      timestamp here
        // ---|------------|----------------------|-------
        //  block    block + min             block + max
        if(
            _timestamp < block.timestamp + MIN_DELAY ||
            _timestamp > block.timestamp + MAX_DELAY
        ) {
            revert TimestampNotInRangeError(block.timestamp, _timestamp);
        }

        //queue tx
        queued[txId] = true;
        emit Queue(txId, _target, _value, _func, _data, _timestamp);
    }

    function execute(
        address _target,
        uint _value,
        string calldata _func,
        bytes calldata _data,
        uint _timestamp
    ) external payable onlyOwner returns (bytes memory) {
        // create tx id
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);

        // check if tx is queued
        if (!queued[txId]) {
            revert NotQueuedError(txId);
        }
          
        // check if block.timestamp > _timestamp
        if (block.timestamp < _timestamp) {
            revert TimestampNotPassedError(block.timestamp, _timestamp);
        }

        // check if expired
        //
        //        valid to be executed within this range          expired
        // ----|---------------------------------------------|-------
        //  timestamp                               timestamp + grace period
        if (block.timestamp > _timestamp + GRACE_PERIOD) {
            revert TimestampExpiredError(block.timestamp, _timestamp + GRACE_PERIOD);
        }

        // delete tx from queue
        queued[txId] = false;

        // prepare data to be passed to the target contract
        bytes memory data;
        if (bytes(_func).length > 0) {
            data = abi.encodePacked(
                // first 4 bytes of the hash are the function selector, data
                bytes4(keccak256(bytes(_func))), _data
            );
        } else {
            data = _data;
        }
        
        // execute tx
        (bool ok, bytes memory res) = _target.call{value: _value}(data);
        if (!ok) {
            revert TxFailedError();
        }

        emit Execute(txId, _target, _value, _func, _data, _timestamp);

        return res;
    }

    function cancel(bytes32 _txId) external onlyOwner {
        if (!queued[_txId]) {
            revert NotQueuedError(_txId);
        }

        queued[_txId] = false;
        emit Cancel(_txId);
    }
}

contract TestTimeLock {
    address public timeLock;

    constructor(address _timeLock) {
        timeLock = _timeLock;
    }

    function test() external view {
        require(msg.sender == timeLock);
    }

    function getTimeStamp() external view returns (uint) {
        return block.timestamp + 100;
    }
}