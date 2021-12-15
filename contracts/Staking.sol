//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Staking {
  	address token;
	uint256 constant MULTIPLIER_PER_DAY = 1020408163; //0,01020408163

	// Index => Timestamp
	mapping (uint256=>uint256) distributions;

	uint256 currentDistribution;

	struct stake {
		uint256 timestamp;
		uint256 amount;
		address sender;
	}
	mapping (uint256=>stake) stakes;
	uint256 currentStake;

	constructor (address _token, uint256 _nextDistributionTimestamp) {
		token = _token;
		currentDistribution = 0;
		distributions[0] = _nextDistributionTimestamp;
	}

	function staking(uint256 _amount) public {
		stake storage _stake = stakes[currentStake];
		currentStake++;
		_stake.timestamp = block.timestamp;
		require(
			ERC20(token).transferFrom(msg.sender, address(this), _amount), 
			"STAKE: transfer amount exceeds allowance"
		);
		_stake.amount = _amount;
		_stake.sender = msg.sender;
	}


}