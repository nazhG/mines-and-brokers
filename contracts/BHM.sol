//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Dummy BSC
contract BHM is ERC20 {
	address public manager;
	address public staking;
	address public treasureWallet;
	address public structureWallet;

    constructor(
        address _manager, 
        uint _initsupply, 
        string memory _name, 
        string memory _symbol, 
        address _treasureWallet, 
        address _structureWallet
    ) ERC20(_name, _symbol) {
        ERC20._mint(_manager, _initsupply);
        manager = _manager;
		treasureWallet = _treasureWallet;
		structureWallet = _structureWallet;
    }

    function setStakingAddress(address _staking) external {
        require(msg.sender == manager, 'Manager Only');
        staking = _staking;
    }

    function mint(address account, uint256 amount) external {
        ERC20._mint(account, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 fee = amount / 100;
        _transfer(_msgSender(), recipient, amount);
        if (_msgSender() != staking) {
            _transfer(_msgSender(), treasureWallet, fee);
            _transfer(_msgSender(), structureWallet, fee);
        }
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 fee = amount / 100;
        _transfer(sender, recipient, amount);
        
        if (!(sender == manager || sender == staking || recipient == staking)) {
            _transfer(sender, treasureWallet, fee);
            _transfer(sender, structureWallet, fee);
        }

        uint256 currentAllowance = allowance(sender, _msgSender());
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }
}