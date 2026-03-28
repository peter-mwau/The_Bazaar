//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

pragma solidity ^0.8.24;

contract MyToken is ERC20, AccessControl, Ownable {
    uint256 public constant MAX_SUPPLY = 100000000 * 10 ** 18;
    uint256 public constant INITIAL_SUPPLY = 100000 * 10 ** 18;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event MINTSUCCESS(address indexed _user, uint256 _amount);
    event BURNSUCCESS(address indexed _user, uint256 _amount);


    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
        balanceOf(msg.sender) = INITIAL_SUPPLY;
        _grantRole(MINTER_ROLE, msg.sender);
    }

    modifier onlyRole(bytes32 role) {
        require(roles[role][msg.sender], "Access denied");
        _;
    }
    
    function _grantRole(bytes32 role, address account) internal {
        roles[role][account] = true;
    }

    function mintToken(address _user, uint256 _amount) external onlyRole(MINTER_ROLE) returns(uint256) {
        require(totalSupply() + _amount <= MAX_SUPPLY, "MAX SUPPLY EXCEEDED");
        _mint(_user, _amount);

        balanceOf(_user) += _amount;

        emit MINTSUCCESS(_user, _amount);
        return totalSupply();
    }

    function burnToken(address _user, uint256 _amount) external onlyOwner returns(bool){
        require(balanceOf(_user) >= _amount, "INSUFFICIENT BALANCE");
        _burn(_user, _amount);
        emit BURNSUCCESS(_user, _amount);
        return true;
    }

}