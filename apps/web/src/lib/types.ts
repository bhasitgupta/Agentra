export type TrustLabel = 'Established' | 'Provisional' | 'New';

export type ServiceCategory = 'market-data' | 'analytics' | 'nlp' | 'code' | 'translation' | 'finance';

export interface Service {
  slug: string;
  name: string;
  category: ServiceCategory | string;
  price: number;
  trustScore: number;
  label: TrustLabel;
  verifiedCalls: number;
  p95Ms: number;
  description: string;
  providerAddress: string;
  agentId?: number;
  tags: string[];
  endpoint?: string;
  isReference?: boolean;
  successRate?: number;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

export type FeedEventType = 'CALL_SUCCEEDED' | 'CALL_FAILED' | 'PAYMENT_SETTLED' | 'SCORE_CHANGED';

export interface ActivityEvent {
  id: string;
  type: FeedEventType;
  serviceSlug: string;
  serviceName: string;
  buyerAddress: string;
  providerAddress?: string;
  amountUSDC?: number;
  latencyMs?: number;
  txHash: string;
  timestamp: string;
  details?: string;
}

export interface AgentWallet {
  address: string;
  label: string;
  balanceUSDC: number;
  todaySpendUSDC: number;
  active: boolean;
}

export interface SpendPolicy {
  perCallCap: number;
  dailyCap: number;
  minTrustScore: number;
  categoryAllowlist: string[];
}

export interface ProviderCallRecord {
  id: string;
  serviceSlug: string;
  serviceName: string;
  buyerAddress: string;
  status: 'SUCCEEDED' | 'FAILED';
  latencyMs: number;
  amountUSDC: number;
  txHash: string;
  timestamp: string;
}

export interface ChartDataPoint {
  day: string;
  earnings: number;
  calls: number;
}
