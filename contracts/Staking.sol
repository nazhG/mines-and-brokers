//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Staking contract with roles reachable by time and amount.
contract Staking is ERC20 {

    /// @notice Contract of the token to stake.
  	address token;
    /// @notice Time to research treasure rol.
	uint256 public roleTreasure = 500 * 1e12;
    /// @notice Time to research structure rol.
	uint256 public roleStructure = 5000 * 1e12;

    /// @dev if the rol can't be reached return this constant.
	uint256 internal constant MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    /// @notice investment made by the user.
	/// handled time as timestamp,
	/// ´time´ when the stake was made.
	/// ´roleTreasure´ when the Treasure role would be reached.
	/// ´roleStructure´ when the Structure role would be reached.
	struct stake {
		uint256 time; 
		uint256 roleTreasure; 
		uint256 roleStructure;
	}

    /// @notice All stakes made.
	mapping (address => stake) public stakes;

	constructor (uint256 _supply, address _token, string memory name_, string memory symbol_) ERC20(name_, symbol_) {
		_mint(address(this), _supply);
		token = _token;
	}

    /// @notice Show the stake made by an ´_account´.
	function getStake(address _account) public view returns(stake memory) {
		return stakes[_account];
	}

    /// @notice Check ´_account´ role.
	/// Returns;
	/// 2 if the ´_account´ has the structure role,
	/// 1 if has treasure role,
	/// 0 otherwise.
	function getRole(address _account) public view returns(uint256) {
		if (block.timestamp >= stakes[_account].roleStructure && stakes[_account].roleStructure != 0 && stakes[_account].roleStructure != MAX_INT) {
			return 2;
		} else if (block.timestamp >= stakes[_account].roleTreasure && stakes[_account].roleTreasure != 0 && stakes[_account].roleTreasure != MAX_INT) {
			return 1;
		} else {
			return 0;
		}
	}

    /// @notice Make a stake, sending ´_amount´ of ´token´ to this contract,
	/// and sending back the same amount of token of staking.
	/// note: require allowance of the token to stake.
	function staking(uint256 _amount) public {
		stake storage _stake = stakes[msg.sender];
		_stake.time = block.timestamp;
		/// fee posiblemnte procentual
		ERC20(this).transfer(msg.sender, _amount);
		_approve(msg.sender, address(this), allowance(msg.sender, address(this)) + _amount);
		ERC20(token).transferFrom(msg.sender, address(this), _amount);
		_stake.roleTreasure = ERC20(this).balanceOf(msg.sender) >= roleTreasure ? // si cumple con el minimo de staking para el rol
			(_stake.roleTreasure == 0 || _stake.roleTreasure == MAX_INT ? // si no tiene rol asignado
				block.timestamp + 30 minutes:
				_stake.roleTreasure): 
			MAX_INT;
		_stake.roleStructure = ERC20(this).balanceOf(msg.sender) >= roleStructure ? 
			(_stake.roleStructure == 0 || _stake.roleStructure == MAX_INT ?
				block.timestamp + 60 minutes:
				_stake.roleStructure):
			MAX_INT;
	}

    /// @notice Send back ´token´ staked, and transfer back the stake token.
	function withdraw(uint256 _amount) public {
		require(ERC20(token).balanceOf(msg.sender) - _amount >= 0, "STAKE: no funds");
		stake storage _stake = stakes[msg.sender];
		ERC20(this).transferFrom(msg.sender, address(this), _amount);
		ERC20(token).transfer(msg.sender, _amount);
		_stake.roleTreasure = ERC20(this).balanceOf(msg.sender) >= roleTreasure ? _stake.roleTreasure : MAX_INT;
		_stake.roleStructure = ERC20(this).balanceOf(msg.sender) >= roleStructure ? _stake.roleTreasure : MAX_INT;
	}

}