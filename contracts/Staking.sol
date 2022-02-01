//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Staking is ERC20 {
  	address token;
	address manager;

	struct stake {
		uint256 timestamp;
		uint256 amount;
		uint256 role; /// 0 holder, 1 treasure, 2 structure
	}
	mapping (address => stake) public stakes;

	constructor (uint256 _supply, address _token, string memory name_, string memory symbol_) ERC20(name_, symbol_) {
		_mint(address(this), _supply);
		token = _token;
	}

	function getStake(address _account) public view returns(stake memory) {
		return stakes[_account];
	}

	function staking(uint256 _amount, uint256 _time) public {
		require(_time > block.timestamp, "STAKE: Time");
		stake storage _stake = stakes[msg.sender];
		_stake.timestamp = _time;
		require(
			ERC20(token).transferFrom(msg.sender, address(this), _amount), 
			"STAKE: transfer amount exceeds allowance"
		);
		_stake.amount += _amount;
		if (_time - block.timestamp >= 30 days && _amount >= 500 ether) {
			_stake.role = 1;
		} else if (_time - block.timestamp >= 180 days && _amount >= 5000 ether) {
			_stake.role = 2;
		}
		ERC20(token).transferFrom(msg.sender, address(this), _amount);
		ERC20(this).transfer(msg.sender, _amount);
	}

	function withdraw() public {
		stake storage _stake = stakes[msg.sender];
		require(_stake.amount > 0, "STAKE: no funds");
		_stake.amount = 0;
		_stake.role = 0;
		ERC20(this).transferFrom(msg.sender, address(this), _stake.amount);
		ERC20(token).transfer(msg.sender, _stake.amount);
	}

}