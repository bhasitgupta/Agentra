import { parseAbi } from 'viem';
import { CONTRACT_ADDRESSES } from './constants';

export const FUJI_CONTRACTS = CONTRACT_ADDRESSES.FUJI;

export const SERVICE_REGISTRY_ABI = parseAbi([
  'function registerService(uint256 agentId, address payTo, bytes32 metadataHash, string calldata metadataURI) external returns (uint256 serviceId)',
  'function updateService(uint256 serviceId, bytes32 metadataHash, string calldata metadataURI) external',
  'function setActive(uint256 serviceId, bool active) external',
  'function getService(uint256 serviceId) external view returns ((uint256 agentId, address payTo, bytes32 metadataHash, uint64 updatedAt, bool active))',
  'event ServiceRegistered(uint256 indexed serviceId, uint256 indexed agentId, address indexed payTo, bytes32 metadataHash, string metadataURI)',
  'event ServiceUpdated(uint256 indexed serviceId, bytes32 metadataHash, string metadataURI)',
  'event ServiceStatusChanged(uint256 indexed serviceId, bool active)',
]);

export const TASK_ESCROW_ABI = parseAbi([
  'function approve(uint256 taskId) external',
  'function accept(uint256 taskId) external',
  'function submit(uint256 taskId, bytes32 deliverHash) external',
  'function claimAfterReview(uint256 taskId) external',
  'function refundAfterDeadline(uint256 taskId) external',
  'function dispute(uint256 taskId, bytes32 evidenceHash) external',
  'function getTask(uint256 taskId) external view returns ((address buyer, address provider, address token, uint256 amount, uint256 deadline, uint256 reviewEnds, uint32 reviewWindow, bytes32 specHash, bytes32 deliverHash, bytes32 evidenceHash, uint8 state))',
  'event TaskCreated(uint256 indexed taskId, address indexed buyer, address indexed provider, uint256 amount, uint256 deadline, bytes32 specHash)',
  'event TaskApproved(uint256 indexed taskId, uint256 toProvider, uint256 toTreasury)',
]);

export const SPLITTER_FACTORY_ABI = parseAbi([
  'function createSplitter(address provider) external returns (address splitter)',
  'function splitterOf(address provider) external view returns (address predicted, bool deployed)',
  'event SplitterCreated(address indexed provider, address indexed splitter, uint16 feeBps)',
]);

export const PROVIDER_SPLITTER_ABI = parseAbi([
  'function release(address token) external',
  'function setProvider(address newProvider) external',
  'event Released(address indexed token, uint256 toProvider, uint256 toTreasury)',
]);

export const ERC20_ABI = parseAbi([
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 value) external returns (bool)',
  'function approve(address spender, uint256 value) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]);

