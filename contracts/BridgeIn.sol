//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// ETH
contract BridgeIn {

    // Outstanding balance
    mapping(address => uint256) public balance;
    address public token;

    event Deposit(address indexed _from, uint _value);

    constructor(address _token) {
        token = _token;
    }

    function burn(address _account, uint256 _amount) external {
        emit Deposit(msg.sender, _amount);
        ERC20(token).transferFrom(_account, address(this), _amount);
        balance[_account] += _amount;
    }

}