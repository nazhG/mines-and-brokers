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
    uint256 public fee; // 100 = 1%, 50 = 0.5%

    constructor(
        address _manager, 
        uint _initsupply, 
        string memory _name, 
        string memory _symbol, 
        uint256 _fee,
        address _treasureWallet, 
        address _structureWallet
    ) ERC20(_name, _symbol) {
        ERC20._mint(_manager, _initsupply);
        manager = _manager;
        fee = _fee;
		treasureWallet = _treasureWallet;
		structureWallet = _structureWallet;
    }

    function setStakingAddress(address _staking, address _treasureWallet, address _structureWallet) external {
        require(msg.sender == manager, 'Manager Only');
        staking = _staking;
        treasureWallet = _treasureWallet;
        structureWallet = _structureWallet;
    }

    function setFee(uint256 _fee) external {
        require(msg.sender == manager, 'Manager Only');
        fee = _fee;
    }

    function mint(address account, uint256 amount) external {
        ERC20._mint(account, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 _fee = (amount * fee) / 10000;
        _transfer(_msgSender(), recipient, amount);
        if (_msgSender() != staking) {
            _transfer(_msgSender(), treasureWallet, _fee);
            _transfer(_msgSender(), structureWallet, _fee);
        }
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 _fee = (amount * fee) / 10000;
        _transfer(sender, recipient, amount);
        
        if (!(sender == manager || sender == staking || recipient == staking)) {
            _transfer(sender, treasureWallet, _fee);
            _transfer(sender, structureWallet, _fee);
        }

        uint256 currentAllowance = allowance(sender, _msgSender());
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }
}