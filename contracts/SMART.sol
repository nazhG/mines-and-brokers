//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title ERC20 token with fee per transfers
contract SMART is ERC20 {

    /// @notice Address allowed to change fees and wallets to receive them.
	address public manager;
    /// @notice Contract that makes the staking.
	address public staking;
    /// @notice Treasure wallet.
	address public treasureWallet;
    /// @notice Structure wallet.
	address public structureWallet;
    /// @notice Percentage fee that applies with each transaction of the token.
    /// e.g. 1000 = 1%, 500 = 0.5%
    uint256 public fee; 

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

    /// @notice Allow the ´manager´ to change the wallets that receives the fee.
    function setStakingAddress(address _staking, address _treasureWallet, address _structureWallet) external {
        require(msg.sender == manager, 'Manager Only');
        staking = _staking;
        treasureWallet = _treasureWallet;
        structureWallet = _structureWallet;
    }

    /// @notice Allow the ´manager´ to change the ´fee´.
    function setFee(uint256 _fee) external {
        require(msg.sender == manager, 'Manager Only');
        fee = _fee;
    }

    /// @notice Transfer applying the fee.
    /// fee is adicional to the ´amount´ sended.
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 _fee = (amount * fee) / 10000;
        _transfer(_msgSender(), recipient, amount);
        if (_msgSender() != staking) {
            _transfer(_msgSender(), treasureWallet, _fee);
            _transfer(_msgSender(), structureWallet, _fee);
        }
        return true;
    }

    /// @notice TransferFrom applying the fee.
    /// fee is adicional to the ´amount´ sended.
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 _fee = (amount * fee) / 10000;
        _transfer(sender, recipient, amount);
        _transfer(sender, treasureWallet, _fee);
        _transfer(sender, structureWallet, _fee);

        uint256 currentAllowance = allowance(sender, _msgSender());
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }
}