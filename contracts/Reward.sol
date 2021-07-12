//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title Terra Virtual Rewards Token
/// @author nazhG
/// @notice This token is used to redeem NFT in terra virtua
/// @dev this contract is a draft
contract Reward is ERC20, Ownable {
	/// @notice Address of the contract with the logic to gives the rewards to the user
    address public minter;
		
    constructor() ERC20("TVR", "Terra Virtual Rewards") {}

	/// @notice set the contract address that will be authorized to generate rewards
	/// @param _minter address of minter contract
	function setMinter(address _minter) public onlyOwner {
		minter = _minter;
	}

	/// @notice this method let to the Minter contract to send reward tokens to users
	/// @dev this methos mints tokens
	function claimReward(uint256 _rewardAmount, address _usersAdress) public {
		require(minter == msg.sender, "Reward: only minter");
        _mint(_usersAdress, _rewardAmount); // emit Transfer
    	console.log("Reward minted: ", _rewardAmount);
	}

}