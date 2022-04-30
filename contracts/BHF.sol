//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Dummy ETH
contract BHF is ERC20 {

    constructor(string memory name_, string memory symbol_, address account_, uint256 amount_) ERC20(name_, symbol_) {
        ERC20._mint(account_, amount_);
    }

    function mint(address account, uint256 amount) external {
        ERC20._mint(account, amount);
    }

}