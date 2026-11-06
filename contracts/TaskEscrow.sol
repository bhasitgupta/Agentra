// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IUSDC.sol";

/// @title  TaskEscrow — Agentra  (P1)
/// @notice Escrow for async or high-value tasks paid in USDC.
///         Funds enter via EIP-3009 receiveWithAuthorization (escrow is recipient),
///         preventing front-running by third parties.
///
///         State machine:
///           FUNDED  ──accept()──► ACCEPTED  ──submit()──► SUBMITTED ──approve()/claimAfterReview()──► RELEASED
///                                                                   ──dispute()──► DISPUTED ──resolve()──► RESOLVED
///           FUNDED / ACCEPTED  ──refundAfterDeadline()──► REFUNDED
contract TaskEscrow {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    enum State { None, Funded, Accepted, Submitted, Released, Disputed, Resolved, Refunded }

    struct Task {
        address  buyer;
        address  provider;
        address  token;
        uint256  amount;
        uint256  deadline;      // provider must submit before this timestamp
        uint256  reviewEnds;    // set when provider submits
        uint32   reviewWindow;  // seconds buyer has to act after submission
        bytes32  specHash;      // keccak256 of off-chain deliverable spec
        bytes32  deliverHash;   // set by provider on submit
        bytes32  evidenceHash;  // set by buyer on dispute
        State    state;
    }

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    address public immutable arbiter;   // platform multisig in MVP
    address public immutable treasury;
    uint16  public immutable feeBps;    // same rate as splitter (250 = 2.5%)

    uint256 public nextTaskId = 1;
    mapping(uint256 => Task) private _tasks;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event TaskCreated(uint256 indexed taskId, address indexed buyer, address indexed provider, uint256 amount, uint256 deadline, bytes32 specHash);
    event TaskAccepted(uint256 indexed taskId);
    event TaskSubmitted(uint256 indexed taskId, bytes32 deliverHash);
    event TaskApproved(uint256 indexed taskId, uint256 toProvider, uint256 toTreasury);
    event TaskDisputed(uint256 indexed taskId, bytes32 evidenceHash);
    event TaskResolved(uint256 indexed taskId, uint256 toProvider, uint256 toTreasury, uint256 toBuyer);
    event TaskRefunded(uint256 indexed taskId, uint256 amount);

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    error ZeroAddress();
    error InvalidAmount();
    error InvalidDeadline();
    error InvalidReviewWindow();
    error TaskNotFound();
    error WrongState();
    error NotBuyer();
    error NotProvider();
    error NotArbiter();
    error DeadlinePassed();
    error DeadlineNotPassed();
    error ReviewWindowOpen();
    error ReviewWindowClosed();
    error InvalidSplit();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(address arbiter_, address treasury_, uint16 feeBps_) {
        if (arbiter_  == address(0)) revert ZeroAddress();
        if (treasury_ == address(0)) revert ZeroAddress();
        if (feeBps_   > 500)         revert InvalidSplit();
        arbiter  = arbiter_;
        treasury = treasury_;
        feeBps   = feeBps_;
    }

    // -------------------------------------------------------------------------
    // Buyer actions
    // -------------------------------------------------------------------------

    /// @notice Lock funds and create a task using an EIP-3009 receiveWithAuthorization.
    ///         The signed `to` address must equal address(this).
    struct CreateTaskParams {
        address  provider;
        address  token;
        uint256  amount;
        uint256  deadline;
        uint32   reviewWindow;
        bytes32  specHash;
        uint256  validAfter;
        uint256  validBefore;
        bytes32  nonce;
        uint8    v;
        bytes32  r;
        bytes32  s;
    }

    /// @notice Lock funds and create a task using an EIP-3009 receiveWithAuthorization.
    ///         The signed `to` address must equal address(this).
    function createTask(CreateTaskParams calldata p) external returns (uint256 taskId) {
        if (p.provider     == address(0)) revert ZeroAddress();
        if (p.token        == address(0)) revert ZeroAddress();
        if (p.amount       == 0)          revert InvalidAmount();
        if (p.deadline     <= block.timestamp) revert InvalidDeadline();
        if (p.reviewWindow == 0)          revert InvalidReviewWindow();

        IUSDC(p.token).receiveWithAuthorization(
            msg.sender, address(this), p.amount,
            p.validAfter, p.validBefore, p.nonce, p.v, p.r, p.s
        );

        taskId = nextTaskId++;
        _tasks[taskId] = Task({
            buyer:        msg.sender,
            provider:     p.provider,
            token:        p.token,
            amount:       p.amount,
            deadline:     p.deadline,
            reviewEnds:   0,
            reviewWindow: p.reviewWindow,
            specHash:     p.specHash,
            deliverHash:  bytes32(0),
            evidenceHash: bytes32(0),
            state:        State.Funded
        });

        emit TaskCreated(taskId, msg.sender, p.provider, p.amount, p.deadline, p.specHash);
    }

    /// @notice Buyer approves submitted deliverable and pays the provider.
    function approve(uint256 taskId) external {
        Task storage t = _load(taskId);
        if (t.state != State.Submitted) revert WrongState();
        if (msg.sender != t.buyer) revert NotBuyer();
        t.state = State.Released;
        _pay(t);
        emit TaskApproved(taskId, _net(t.amount), _fee(t.amount));
    }

    /// @notice Buyer opens a dispute within the review window.
    function dispute(uint256 taskId, bytes32 evidenceHash) external {
        Task storage t = _load(taskId);
        if (t.state != State.Submitted) revert WrongState();
        if (msg.sender != t.buyer) revert NotBuyer();
        if (block.timestamp > t.reviewEnds) revert ReviewWindowClosed();
        t.state        = State.Disputed;
        t.evidenceHash = evidenceHash;
        emit TaskDisputed(taskId, evidenceHash);
    }

    // -------------------------------------------------------------------------
    // Provider actions
    // -------------------------------------------------------------------------

    /// @notice Provider signals intention to work on the task before the deadline.
    function accept(uint256 taskId) external {
        Task storage t = _load(taskId);
        if (t.state != State.Funded) revert WrongState();
        if (msg.sender != t.provider) revert NotProvider();
        if (block.timestamp >= t.deadline) revert DeadlinePassed();
        t.state = State.Accepted;
        emit TaskAccepted(taskId);
    }

    /// @notice Provider submits the deliverable and starts the buyer review window.
    function submit(uint256 taskId, bytes32 deliverHash) external {
        Task storage t = _load(taskId);
        if (t.state != State.Accepted) revert WrongState();
        if (msg.sender != t.provider) revert NotProvider();
        if (block.timestamp >= t.deadline) revert DeadlinePassed();
        t.state       = State.Submitted;
        t.deliverHash = deliverHash;
        t.reviewEnds  = block.timestamp + t.reviewWindow;
        emit TaskSubmitted(taskId, deliverHash);
    }

    /// @notice Provider claims payment after the review window expires with no buyer action.
    function claimAfterReview(uint256 taskId) external {
        Task storage t = _load(taskId);
        if (t.state != State.Submitted) revert WrongState();
        if (msg.sender != t.provider) revert NotProvider();
        if (block.timestamp <= t.reviewEnds) revert ReviewWindowOpen();
        t.state = State.Released;
        _pay(t);
        emit TaskApproved(taskId, _net(t.amount), _fee(t.amount));
    }

    // -------------------------------------------------------------------------
    // Timeout — anyone can call
    // -------------------------------------------------------------------------

    /// @notice Refund the buyer when provider missed the deadline without submitting.
    function refundAfterDeadline(uint256 taskId) external {
        Task storage t = _load(taskId);
        if (t.state != State.Funded && t.state != State.Accepted) revert WrongState();
        if (block.timestamp < t.deadline) revert DeadlineNotPassed();
        t.state = State.Refunded;
        IERC20(t.token).safeTransfer(t.buyer, t.amount);
        emit TaskRefunded(taskId, t.amount);
    }

    // -------------------------------------------------------------------------
    // Arbiter
    // -------------------------------------------------------------------------

    /// @notice Resolve a disputed task. Platform multisig splits the locked amount.
    /// @param providerBps  Basis points going to provider out of the post-fee amount (0–10_000).
    function resolve(uint256 taskId, uint16 providerBps) external {
        if (msg.sender != arbiter) revert NotArbiter();
        if (providerBps > 10_000) revert InvalidSplit();
        Task storage t = _load(taskId);
        if (t.state != State.Disputed) revert WrongState();
        t.state = State.Resolved;

        uint256 fee        = _fee(t.amount);
        uint256 afterFee   = t.amount - fee;
        uint256 toProvider = (afterFee * providerBps) / 10_000;
        uint256 toBuyer    = afterFee - toProvider;

        if (fee        > 0) IERC20(t.token).safeTransfer(treasury,   fee);
        if (toProvider > 0) IERC20(t.token).safeTransfer(t.provider, toProvider);
        if (toBuyer    > 0) IERC20(t.token).safeTransfer(t.buyer,    toBuyer);

        emit TaskResolved(taskId, toProvider, fee, toBuyer);
    }

    // -------------------------------------------------------------------------
    // View
    // -------------------------------------------------------------------------

    function getTask(uint256 taskId) external view returns (Task memory) {
        return _load(taskId);
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    function _load(uint256 taskId) internal view returns (Task storage t) {
        t = _tasks[taskId];
        if (t.state == State.None) revert TaskNotFound();
    }

    function _fee(uint256 amount) internal view returns (uint256) {
        return (amount * feeBps) / 10_000;
    }

    function _net(uint256 amount) internal view returns (uint256) {
        return amount - _fee(amount);
    }

    function _pay(Task storage t) internal {
        uint256 fee = _fee(t.amount);
        uint256 net = t.amount - fee;
        if (fee > 0) IERC20(t.token).safeTransfer(treasury,   fee);
        IERC20(t.token).safeTransfer(t.provider, net);
    }
}

