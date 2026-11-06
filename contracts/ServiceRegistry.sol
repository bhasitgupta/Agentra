// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title  ServiceRegistry — Agentra
/// @notice On-chain listing of services, controlled by ERC-8004 NFT ownership.
///         No admin. No upgrade. Catalog fully rebuildable from events.
contract ServiceRegistry {

    // ── Inline interface ──────────────────────────────────────────────────────
    interface IIdentityRegistry {
        function ownerOf(uint256 agentId) external view returns (address);
    }

    // ── Types ─────────────────────────────────────────────────────────────────
    struct Service {
        uint256 agentId;
        address payTo;
        bytes32 metadataHash;
        uint64  updatedAt;
        bool    active;
    }

    // ── State ─────────────────────────────────────────────────────────────────
    IIdentityRegistry public immutable identity;
    uint256 public nextServiceId = 1;
    mapping(uint256 => Service) private _services;

    // ── Events ────────────────────────────────────────────────────────────────
    event ServiceRegistered(uint256 indexed serviceId, uint256 indexed agentId, address indexed payTo, bytes32 metadataHash, string metadataURI);
    event ServiceUpdated(uint256 indexed serviceId, bytes32 metadataHash, string metadataURI);
    event ServiceStatusChanged(uint256 indexed serviceId, bool active);

    // ── Errors ────────────────────────────────────────────────────────────────
    error NotAgentOwner();
    error UnknownService();
    error ZeroAddress();

    // ── Constructor ───────────────────────────────────────────────────────────
    /// @param identity_  ERC-8004 Identity Registry address.
    ///                   Fuji:    0x8004A818BFB912233c491871b3d84c89A494BD9e
    ///                   Mainnet: 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
    constructor(address identity_) {
        if (identity_ == address(0)) revert ZeroAddress();
        identity = IIdentityRegistry(identity_);
    }

    // ── Write ─────────────────────────────────────────────────────────────────
    function registerService(
        uint256 agentId,
        address payTo,
        bytes32 metadataHash,
        string calldata metadataURI
    ) external returns (uint256 serviceId) {
        if (payTo == address(0)) revert ZeroAddress();
        if (identity.ownerOf(agentId) != msg.sender) revert NotAgentOwner();
        serviceId = nextServiceId++;
        _services[serviceId] = Service(agentId, payTo, metadataHash, uint64(block.timestamp), true);
        emit ServiceRegistered(serviceId, agentId, payTo, metadataHash, metadataURI);
    }

    function updateService(uint256 serviceId, bytes32 metadataHash, string calldata metadataURI) external {
        Service storage s = _authorized(serviceId);
        s.metadataHash = metadataHash;
        s.updatedAt    = uint64(block.timestamp);
        emit ServiceUpdated(serviceId, metadataHash, metadataURI);
    }

    function setActive(uint256 serviceId, bool active) external {
        Service storage s = _authorized(serviceId);
        s.active    = active;
        s.updatedAt = uint64(block.timestamp);
        emit ServiceStatusChanged(serviceId, active);
    }

    // ── Read ──────────────────────────────────────────────────────────────────
    function getService(uint256 serviceId) external view returns (Service memory) {
        Service memory s = _services[serviceId];
        if (s.updatedAt == 0) revert UnknownService();
        return s;
    }

    // ── Internal ──────────────────────────────────────────────────────────────
    function _authorized(uint256 serviceId) internal view returns (Service storage s) {
        s = _services[serviceId];
        if (s.updatedAt == 0) revert UnknownService();
        if (identity.ownerOf(s.agentId) != msg.sender) revert NotAgentOwner();
    }
}
