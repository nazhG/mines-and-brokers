//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Dummy BSC
contract BHM is ERC20 {

    constructor(address _manager, uint _initsupply, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        ERC20._mint(_manager, _initsupply);
    }

    function mint(address account, uint256 amount) external {
        ERC20._mint(account, amount);
    }
}