/// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "../interfaces/IERC165.sol";

contract ERC165 is IERC165 {
    /// @dev You must not set element 0xffffffff to true
    mapping(bytes4 => bool) internal supportedInterfaces;

    function ERC165MappingImplementation() internal {
        supportedInterfaces[this.supportsInterface.selector] = true;
    }

    function supportsInterface(bytes4 interfaceID)
        external
        view
        override
        returns (bool)
    {
        return supportedInterfaces[interfaceID];
    }

    function _registerInterface(bytes4 interfaceID) internal {
        supportedInterfaces[interfaceID] = true;
    }
}
