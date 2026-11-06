// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal interface into the ERC-8004 Identity Registry (EIP-8004).
///         Only ownerOf is needed — registry is deployed at known Fuji/mainnet addresses.
interface IIdentityRegistry {
    function ownerOf(uint256 agentId) external view returns (address owner);
}

