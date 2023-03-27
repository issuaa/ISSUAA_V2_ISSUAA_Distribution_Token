// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract GovernanceToken is Ownable, ERC20 {
  using SafeMath for uint256;

  constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
    _mint(msg.sender,1000*10**18);      
  }
  
  
  /**
  * @notice A method that mints new governance tokens. Can only be called by the owner.
  * @param _address Address that receives the governance tokens.
  *        _amount Amount to governance tokens to be minted in WEI.
  */
  function mint(
    address _address, 
    uint256 _amount
    ) 
    external 
    onlyOwner 
    {
  	_mint(_address, _amount);
  }

  /**
  * @notice A method that burns governance tokens. Can only be called by the owner.
  * @param _address Address that receives the governance tokens.
  *        _amount Amount to governance tokens to be minted in WEI.
  */
  function burn(
    address _address,
    uint256 _amount
    ) 
    external 
    onlyOwner {
    _burn(_address, _amount);
  }

  
}