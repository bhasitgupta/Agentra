// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

// ─────────────────────────────────────────────────────────────────────────────
// ProviderSplitter
// ─────────────────────────────────────────────────────────────────────────────

contract ProviderSplitter {
    using SafeERC20 for IERC20;

    uint16 public constant BPS = 10_000;

    address public provider;
    address public treasury;
    uint16  public feeBps;
    bool    private _initialized;

    event Released(address indexed token, uint256 toProvider, uint256 toTreasury);
    event ProviderChanged(address indexed oldProvider, address indexed newProvider);

    error AlreadyInitialized();
    error NotProvider();
    error ZeroAddress();
    error NothingToRelease();

    constructor() { _initialized = true; }

    function initialize(address provider_, address treasury_, uint16 feeBps_) external {
        if (_initialized)            revert AlreadyInitialized();
        if (provider_ == address(0)) revert ZeroAddress();
        if (treasury_ == address(0)) revert ZeroAddress();
        _initialized = true;
        provider     = provider_;
        treasury     = treasury_;
        feeBps       = feeBps_;
    }

    function release(IERC20 token) external {
        uint256 bal = token.balanceOf(address(this));
        if (bal == 0) revert NothingToRelease();
        uint256 fee = (bal * feeBps) / BPS;
        uint256 net = bal - fee;
        if (fee > 0) token.safeTransfer(treasury, fee);
        token.safeTransfer(provider, net);
        emit Released(address(token), net, fee);
    }

    function setProvider(address newProvider) external {
        if (msg.sender != provider)    revert NotProvider();
        if (newProvider == address(0)) revert ZeroAddress();
        emit ProviderChanged(provider, newProvider);
        provider = newProvider;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SplitterFactory
// ─────────────────────────────────────────────────────────────────────────────

contract SplitterFactory is Ownable2Step {

    uint16 public constant MAX_FEE_BPS = 500;

    address public immutable implementation;
    address public treasury;
    uint16  public feeBps;

    event SplitterCreated(address indexed provider, address indexed splitter, uint16 feeBps);
    event FeeUpdated(uint16 feeBps);
    event TreasuryUpdated(address treasury);

    error FeeTooHigh();
    error ZeroAddress();

    constructor(address owner_, address treasury_, uint16 feeBps_) Ownable(owner_) {
        if (treasury_ == address(0)) revert ZeroAddress();
        if (feeBps_   > MAX_FEE_BPS) revert FeeTooHigh();
        implementation = address(new ProviderSplitter());
        treasury       = treasury_;
        feeBps         = feeBps_;
    }

    function createSplitter(address provider) external returns (address splitter) {
        bytes32 salt = keccak256(abi.encode(provider));
        splitter     = Clones.cloneDeterministic(implementation, salt);
        ProviderSplitter(splitter).initialize(provider, treasury, feeBps);
        emit SplitterCreated(provider, splitter, feeBps);
    }

    function splitterOf(address provider) public view returns (address predicted, bool deployed) {
        predicted = Clones.predictDeterministicAddress(
            implementation,
            keccak256(abi.encode(provider)),
            address(this)
        );
        deployed = predicted.code.length > 0;
    }

    function setFee(uint16 feeBps_) external onlyOwner {
        if (feeBps_ > MAX_FEE_BPS) revert FeeTooHigh();
        feeBps = feeBps_;
        emit FeeUpdated(feeBps);
    }

    function setTreasury(address treasury_) external onlyOwner {
        if (treasury_ == address(0)) revert ZeroAddress();
        treasury = treasury_;
        emit TreasuryUpdated(treasury_);
    }
}
