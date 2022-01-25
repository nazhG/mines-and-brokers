//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// ETH
contract Bridge {

    // Outstanding balance
    mapping(address => uint256) public balance;
    address public token;
    address public manager;

    constructor(address _manager, address _token) {
        require(_manager != address(0), "ADDRESS 0");
        manager = _manager;
        token = _token;
    }
    
    function changeManager(address _manager, address _token) external {
        require(manager == msg.sender, "NOT MANAGER");
        require(_manager != address(0), "ADDRESS 0");
        manager = _manager;
        token = _token;
    }

    function burn(address _sender, uint256 _amount) external {
        ERC20(token).transferFrom(_sender, address(this), _amount);
        balance[_sender] = _amount;
    }

    function claim(address _sender, uint256 _amount) external {
        require(manager == msg.sender, "NOT MANAGER");
        balance[_sender] -= _amount;
    }

}