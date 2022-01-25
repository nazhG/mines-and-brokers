//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Dummy BSC
contract BHM is ERC20 {

    address public manager;

    constructor(string memory name_, string memory symbol_, address _manager) ERC20(name_, symbol_) {
        require(_manager != address(0), "ADDRESS 0");
        manager = _manager;
    }

    function changeManager(address _manager) external {
        require(manager == msg.sender, "NOT MANAGER");
        require(_manager != address(0), "ADDRESS 0");
        manager = _manager;
    }

    function claim(address account, uint256 amount) external {
        require(manager == msg.sender, "NOT MANAGER");
        ERC20._mint(account, amount);
    }

}