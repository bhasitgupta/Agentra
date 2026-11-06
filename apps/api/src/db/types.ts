export type ServiceCategory =
  | 'market-data'
  | 'analytics'
  | 'nlp'
  | 'code'
  | 'translation'
  | 'finance';

export type ServiceStatus =
  | 'draft'
  | 'verified'
  | 'publishing'
  | 'active'
  | 'paused'
  | 'delisted';

export type TrustLabel = 'New' | 'Provisional' | 'Established';

export interface ServiceRecord {
  id: string;
  slug: string;
  owner: string;
  chainId: number;
  agentId?: number;
  registryServiceId?: number;
  name: string;
  description: string;
  category: ServiceCategory;
  tags: string[];
  endpointUrl: string;
  httpMethod: 'GET' | 'POST';
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  priceAtomic: bigint; // 1 USDC = 1,000,000 atomic units
  settlementMode: 'pay_on_success' | 'escrow';
  payTo: string; // ProviderSplitter address
  payoutAddress: string;
  timeoutMs: number;
  slaMs: number;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;

  // Cached reputation metrics
  trustScore: number;
  trustLabel: TrustLabel;
  verifiedCalls: number;
  successRate: number;
  p50Ms: number;
  p95Ms: number;
}

export type CallStatus =
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_VERIFIED'
  | 'DELIVERED'
  | 'UPSTREAM_ERROR'
  | 'SCHEMA_INVALID'
  | 'TIMEOUT'
  | 'SETTLEMENT_FAILED';

export interface CallRecord {
  id: string;
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  buyer: string;
  status: CallStatus;
  errorCode?: string;
  httpStatus?: number;
  latencyUpstreamMs?: number;
  latencyTotalMs: number;
  priceAtomic: bigint;
  paymentNonce?: string;
  settleTx?: string;
  isSandbox: boolean;
  createdAt: string;
}

export interface SpendPolicy {
  wallet: string;
  maxPerCallAtomic: bigint;
  dailyCapAtomic: bigint;
  minTrust: number;
  allowCategories: ServiceCategory[];
  allowServices: string[];
  updatedAt: string;
}

export interface AgentWalletRecord {
  address: string;
  owner: string;
  label: string;
  usdcBalanceAtomic: bigint;
  spentTodayAtomic: bigint;
  createdAt: string;
}

export interface MarketplaceEvent {
  id: string;
  type: 'CALL_SUCCEEDED' | 'CALL_FAILED' | 'PAYMENT_SETTLED' | 'SCORE_CHANGED';
  timestamp: string;
  serviceSlug: string;
  serviceName: string;
  buyerAddress: string;
  amountAtomic?: bigint;
  latencyMs?: number;
  txHash?: string;
  scoreChange?: {
    from: number;
    to: number;
  };
}

export interface ReputationBreakdown {
  serviceId: string;
  slug: string;
  trustScore: number;
  label: TrustLabel;
  verifiedCalls: number;
  successRate: number;
  p50Ms: number;
  p95Ms: number;
  components: {
    Q: number; // Rating quality (Bayesian mean)
    S: number; // Wilson lower bound success rate
    L: number; // Latency SLA score
    V: number; // Endpoint and ERC-8004 verification score
  };
  sampleSizes: {
    totalCalls: number;
    deliveredCalls: number;
    failedCalls: number;
    feedbackCount: number;
  };
}

