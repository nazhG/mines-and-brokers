//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BridgeOut {

    uint256 public i = 0;
    mapping(uint256 => address) public accounts;
    mapping(address => uint256) public balance;
    uint256 public fee;
    address public token;
    address public manager;

    event Withdrawal(address indexed _from, uint _value);

    modifier manager_only() {
        require(manager == msg.sender, "NOT MANAGER");
        _;
    }

    constructor(address _manager, address _token, uint256 _fee) {
        require(_manager != address(0), "ADDRESS 0");
        token = _token;
        manager = _manager;
        fee = _fee;
    }

    function getAccountsCount() external view returns(uint256) {
        return i;
    }

    function changeManager(address _manager) external manager_only() {
        require(_manager != address(0), "ADDRESS 0");
        manager = _manager;
    }

    function adjustFee(uint256 _fee) external manager_only() {
        fee = _fee;
    }

    function claimRequest(address _account) external payable {
        require(msg.value >= fee, "value is less than fee");
        payable(manager).transfer(msg.value);
        accounts[i++] = _account;
    }

    function claim(address _account, uint256 _amount) external manager_only() {
        emit Withdrawal(msg.sender, _amount);
        ERC20(token).transferFrom(manager, _account, _amount);
        require(accounts[i]==_account,"need claim request to pay fee");
        balance[_account] += _amount;
        delete(accounts[i--]);
    }
}