//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Staking is ERC20 {
  	address token;
	address manager;
	uint256 roleTreasure = 500 * 1e12;
	uint256 roleStructure = 5000 * 1e12;

	uint256 MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

	struct stake {
		uint256 time; 
		uint256 roleTreasure; 
		uint256 roleStructure;
	}
	mapping (address => stake) public stakes;

	constructor (uint256 _supply, address _token, string memory name_, string memory symbol_) ERC20(name_, symbol_) {
		_mint(address(this), _supply);
		token = _token;
	}

	function getStake(address _account) public view returns(stake memory) {
		return stakes[_account];
	}

	function getRole(address _account) public view returns(uint256) {
		if (block.timestamp >= stakes[_account].roleStructure && stakes[_account].roleStructure != 0 && stakes[_account].roleStructure != MAX_INT) {
			return 2;
		} else if (block.timestamp >= stakes[_account].roleTreasure && stakes[_account].roleTreasure != 0 && stakes[_account].roleTreasure != MAX_INT) {
			return 1;
		} else {
			return 0;
		}
	}

	function staking(uint256 _amount) public {
		stake storage _stake = stakes[msg.sender];
		_stake.time = block.timestamp;
		/// si agrego
		ERC20(this).transfer(msg.sender, _amount);
		_approve(msg.sender, address(this), _amount);
		ERC20(token).transferFrom(msg.sender, address(this), _amount);
		_stake.roleTreasure = ERC20(token).balanceOf(msg.sender) >= roleTreasure ? block.timestamp + 30 minutes: MAX_INT;
		_stake.roleStructure = ERC20(token).balanceOf(msg.sender) >= roleStructure ? block.timestamp + 180 minutes: MAX_INT;
	}

	function withdraw(uint256 _amount) public {
		require(ERC20(token).balanceOf(msg.sender) - _amount >= 0, "STAKE: no funds");
		stake storage _stake = stakes[msg.sender];
		ERC20(this).transferFrom(msg.sender, address(this), _amount);
		ERC20(token).transfer(msg.sender, _amount);
		_stake.roleTreasure = ERC20(token).balanceOf(msg.sender) >= roleTreasure ? _stake.roleTreasure : MAX_INT;
		_stake.roleStructure = ERC20(token).balanceOf(msg.sender) >= roleStructure ? _stake.roleTreasure : MAX_INT;
	}

}