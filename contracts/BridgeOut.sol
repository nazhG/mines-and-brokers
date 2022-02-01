//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Bnb
contract BridgeOut {

    // Outstanding balance
    mapping(address => uint256) public claimed;
    mapping(address => bool) public paused;
    uint256 public fee;
    address public token;
    address public manager;
    mapping(uint256 => address) public claimRequests;
    uint256 index = 0;

    event Withdrawal(address indexed _from, uint _value);

    modifier manager_only() {
        require(manager == msg.sender, "NOT MANAGER");
        _;
    }

    modifier addr_not_zero(address addr) {
        require(addr != address(0), "ADDRESS 0");
        _;
    }

    constructor(address _manager, address _token, uint256 _fee) addr_not_zero(_manager) {
        token = _token;
        manager = _manager;
        fee = _fee;
    }

    function changeManager(address _manager) external manager_only() addr_not_zero(_manager) {
        manager = _manager;
    }

    function pause(address _account , bool _paused) external manager_only() {
        paused[_account] = _paused;
    }

    function adjustFee(uint256 _fee) external manager_only() {
        fee = _fee;
    }

    function claimRequest(address _account) external payable {
        require(msg.value >= fee, "FEE");
        payable(manager).transfer(fee);
        claimRequests[index++] = _account;
    }

    function claim(address _account, uint256 _amount) external manager_only() {
        emit Withdrawal(msg.sender, _amount);
        ERC20(token).transferFrom(manager, _account, _amount);
        require(claimRequests[index - 1] == _account,"crash");
        delete claimRequests[index - 1];
        claimed[_account] += _amount;
        index--;
    }
}