//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import { Reward } from "./Reward.sol";

/// @title Terra Virtual Rewards Minter
/// @author nazhG
/// @notice This constract let user invest and claim the reward token
/// @dev this contract is a draft
contract Minter {
	/// @notice Address of reward token
    address public tokenAddress;

    mapping(address => uint256) public investorFunds;
    mapping(address => uint256) public investorRewards;

    uint256 public pot;

	/// @param _tokenAddress reward token address
    constructor(address _tokenAddress) {
		tokenAddress = _tokenAddress;
    }

    /// @dev this method let the user send eth or usdt to start earning tokens
	function invest() public {
		//emit
	}

    /// @notice  this method send all the reward tokens to the user
	function claim() public {
        // reward logic
        // emit
	}

    /// @notice this method let the user withdraw their funds
	function withdraw() public {
        require(investorFunds[msg.sender] > 0,"Minter: no funds to withdraw");
		Reward(tokenAddress).claimReward(investorFunds[msg.sender], msg.sender);
	}

}