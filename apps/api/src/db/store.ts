import {
  ServiceRecord,
  CallRecord,
  SpendPolicy,
  AgentWalletRecord,
  MarketplaceEvent,
  ReputationBreakdown,
} from './types.js';
import { CONFIG } from '../config.js';
import { computeTrustScore } from '../reputation/scoring.js';

class DataStore {
  private services: Map<string, ServiceRecord> = new Map();
  private calls: CallRecord[] = [];
  private spendPolicies: Map<string, SpendPolicy> = new Map();
  private agentWallets: Map<string, AgentWalletRecord> = new Map();
  private events: MarketplaceEvent[] = [];
  private eventListeners: Set<(event: MarketplaceEvent) => void> = new Set();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const defaultOwner = '0x8b32A4601A9E3836173dE1cb915995F77f4e9124';
    const splitter = CONFIG.PROVIDER_SPLITTER_ADDRESS;

    const initialServices: Array<Omit<ServiceRecord, 'trustScore' | 'trustLabel' | 'p50Ms' | 'p95Ms' | 'verifiedCalls' | 'successRate'> & {
      trustScore: number;
      trustLabel: ServiceRecord['trustLabel'];
      verifiedCalls: number;
      p95Ms: number;
      p50Ms: number;
      successRate: number;
    }> = [
      {
        id: 'srv-101',
        slug: 'ev-market-data',
        owner: defaultOwner,
        chainId: CONFIG.CHAIN_ID,
        agentId: 101,
        registryServiceId: 1,
        name: 'India EV Market Data',
        description: 'Real-time telemetry and state-by-state registration data across major EV OEMs in India.',
        category: 'market-data',
        tags: ['automotive', 'ev', 'india', 'telemetry', 'analytics'],
        endpointUrl: `${CONFIG.PUBLIC_API_URL}/upstream/ev-market-data`,
        httpMethod: 'POST',
        inputSchema: {
          type: 'object',
          properties: {
            state: { type: 'string', description: 'State code, e.g. MH, DL, KA' },
            month: { type: 'string', description: 'YYYY-MM format' },
          },
        },
        outputSchema: {
          type: 'object',
          properties: {
            totalRegistrations: { type: 'number' },
            oemBreakdown: { type: 'object' },
            growthYoY: { type: 'number' },
          },
        },
        priceAtomic: 10000n, // 0.010 USDC
        settlementMode: 'pay_on_success',
        payTo: splitter,
        payoutAddress: defaultOwner,
        timeoutMs: 8000,
        slaMs: 1000,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date().toISOString(),
        trustScore: 91,
        trustLabel: 'Established',
        verifiedCalls: 340,
        successRate: 0.994,
        p50Ms: 380,
        p95Ms: 620,
      },
      {
        id: 'srv-102',
        slug: 'competitor-intel',
        owner: defaultOwner,
        chainId: CONFIG.CHAIN_ID,
        agentId: 102,
        registryServiceId: 2,
        name: 'Competitor Intel',
        description: 'Automated competitive tracking and feature delta analysis for B2B SaaS applications.',
        category: 'analytics',
        tags: ['b2b', 'intelligence', 'pricing', 'saas'],
        endpointUrl: `${CONFIG.PUBLIC_API_URL}/upstream/competitor-intel`,
        httpMethod: 'POST',
        inputSchema: {
          type: 'object',
          properties: {
            domain: { type: 'string', description: 'Target competitor domain' },
          },
          required: ['domain'],
        },
        priceAtomic: 20000n, // 0.020 USDC
        settlementMode: 'pay_on_success',
        payTo: splitter,
        payoutAddress: defaultOwner,
        timeoutMs: 12000,
        slaMs: 1500,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        updatedAt: new Date().toISOString(),
        trustScore: 78,
        trustLabel: 'Established',
        verifiedCalls: 85,
        successRate: 0.976,
        p50Ms: 850,
        p95Ms: 1200,
      },
      {
        id: 'srv-103',
        slug: 'sentiment-pulse',
        owner: defaultOwner,
        chainId: CONFIG.CHAIN_ID,
        agentId: 103,
        registryServiceId: 3,
        name: 'Sentiment Pulse',
        description: 'High-frequency sentiment extraction for financial news, SEC filings, and crypto discussions.',
        category: 'nlp',
        tags: ['crypto', 'finance', 'nlp', 'sentiment'],
        endpointUrl: `${CONFIG.PUBLIC_API_URL}/upstream/sentiment-pulse`,
        httpMethod: 'POST',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Paragraph or headline to analyze' },
          },
          required: ['text'],
        },
        priceAtomic: 5000n, // 0.005 USDC
        settlementMode: 'pay_on_success',
        payTo: splitter,
        payoutAddress: defaultOwner,
        timeoutMs: 5000,
        slaMs: 600,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
        updatedAt: new Date().toISOString(),
        trustScore: 83,
        trustLabel: 'Established',
        verifiedCalls: 210,
        successRate: 0.985,
        p50Ms: 290,
        p95Ms: 450,
      },
      {
        id: 'srv-104',
        slug: 'forecast-lite',
        owner: defaultOwner,
        chainId: CONFIG.CHAIN_ID,
        agentId: 104,
        registryServiceId: 4,
        name: 'Forecast Lite',
        description: 'Autoregressive probabilistic forecasting for supply chain inventories and sales trends.',
        category: 'analytics',
        tags: ['forecasting', 'inventory', 'machine-learning'],
        endpointUrl: `${CONFIG.PUBLIC_API_URL}/upstream/forecast-lite`,
        httpMethod: 'POST',
        inputSchema: {
          type: 'object',
          properties: {
            series: { type: 'array', items: { type: 'number' } },
            horizon: { type: 'number' },
          },
          required: ['series'],
        },
        priceAtomic: 10000n, // 0.010 USDC
        settlementMode: 'pay_on_success',
        payTo: splitter,
        payoutAddress: defaultOwner,
        timeoutMs: 15000,
        slaMs: 2500,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
        trustScore: 65,
        trustLabel: 'Provisional',
        verifiedCalls: 22,
        successRate: 0.909,
        p50Ms: 1200,
        p95Ms: 1800,
      },
      {
        id: 'srv-105',
        slug: 'code-review-lite',
        owner: defaultOwner,
        chainId: CONFIG.CHAIN_ID,
        agentId: 105,
        registryServiceId: 5,
        name: 'Code Review Lite',
        description: 'Fast automated static analysis catching reentrancy, overflow, and unchecked return values.',
        category: 'code',
        tags: ['security', 'solidity', 'audit', 'code-review'],
        endpointUrl: `${CONFIG.PUBLIC_API_URL}/upstream/code-review-lite`,
        httpMethod: 'POST',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Solidity contract snippet' },
          },
          required: ['code'],
        },
        priceAtomic: 30000n, // 0.030 USDC
        settlementMode: 'pay_on_success',
        payTo: splitter,
        payoutAddress: defaultOwner,
        timeoutMs: 20000,
        slaMs: 3000,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        updatedAt: new Date().toISOString(),
        trustScore: 88,
        trustLabel: 'Established',
        verifiedCalls: 156,
        successRate: 0.987,
        p50Ms: 1400,
        p95Ms: 2100,
      },
      {
        id: 'srv-106',
        slug: 'flaky-translate',
        owner: defaultOwner,
        chainId: CONFIG.CHAIN_ID,
        agentId: 106,
        registryServiceId: 6,
        name: 'Flaky Translate',
        description: 'Deliberately unreliable translation service. Fails ~40% of calls to demonstrate pay-on-success protection.',
        category: 'nlp',
        tags: ['translation', 'demo', 'unreliable'],
        endpointUrl: `${CONFIG.PUBLIC_API_URL}/upstream/flaky-translate`,
        httpMethod: 'POST',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            targetLang: { type: 'string' },
          },
          required: ['text'],
        },
        priceAtomic: 5000n, // 0.005 USDC
        settlementMode: 'pay_on_success',
        payTo: splitter,
        payoutAddress: defaultOwner,
        timeoutMs: 5000,
        slaMs: 1000,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
        updatedAt: new Date().toISOString(),
        trustScore: 31,
        trustLabel: 'Provisional',
        verifiedCalls: 48,
        successRate: 0.604,
        p50Ms: 550,
        p95Ms: 900,
      },
    ];

    for (const service of initialServices) {
      this.services.set(service.slug, service);
    }

    // Seed agent wallet & default policy
    const defaultAgent = '0xa123456789abcdef0123456789abcdef01234567';
    this.agentWallets.set(defaultAgent, {
      address: defaultAgent,
      owner: defaultOwner,
      label: 'Autonomous Market Researcher',
      usdcBalanceAtomic: 100_000_000n, // 100.00 USDC
      spentTodayAtomic: 340_000n, // 0.34 USDC
      createdAt: new Date().toISOString(),
    });

    this.spendPolicies.set(defaultAgent, {
      wallet: defaultAgent,
      maxPerCallAtomic: 100_000n, // 0.10 USDC max per call
      dailyCapAtomic: 5_000_000n, // 5.00 USDC daily cap
      minTrust: 40,
      allowCategories: ['market-data', 'analytics', 'nlp', 'code'],
      allowServices: [],
      updatedAt: new Date().toISOString(),
    });

    // Seed initial marketplace events
    this.events = [
      {
        id: 'evt-1',
        type: 'CALL_SUCCEEDED',
        timestamp: new Date(Date.now() - 1000 * 18).toISOString(),
        serviceSlug: 'ev-market-data',
        serviceName: 'India EV Market Data',
        buyerAddress: defaultAgent,
        amountAtomic: 10000n,
        latencyMs: 580,
        txHash: '0x3a4b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
      },
      {
        id: 'evt-2',
        type: 'PAYMENT_SETTLED',
        timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
        serviceSlug: 'competitor-intel',
        serviceName: 'Competitor Intel',
        buyerAddress: '0x8b32...9124',
        amountAtomic: 20000n,
        latencyMs: 1150,
        txHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
      },
      {
        id: 'evt-3',
        type: 'CALL_FAILED',
        timestamp: new Date(Date.now() - 1000 * 90).toISOString(),
        serviceSlug: 'flaky-translate',
        serviceName: 'Flaky Translate',
        buyerAddress: defaultAgent,
        amountAtomic: 0n,
        latencyMs: 920,
      },
    ];
  }

  // --- Services ---
  getAllServices(): ServiceRecord[] {
    return Array.from(this.services.values());
  }

  getServiceBySlug(slug: string): ServiceRecord | undefined {
    return this.services.get(slug);
  }

  getServiceById(id: string): ServiceRecord | undefined {
    return Array.from(this.services.values()).find((s) => s.id === id);
  }

  createService(data: Omit<ServiceRecord, 'id' | 'createdAt' | 'updatedAt' | 'trustScore' | 'trustLabel' | 'verifiedCalls' | 'successRate' | 'p50Ms' | 'p95Ms'>): ServiceRecord {
    const id = `srv-${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const service: ServiceRecord = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      trustScore: 50,
      trustLabel: 'New',
      verifiedCalls: 0,
      successRate: 0,
      p50Ms: 0,
      p95Ms: 0,
    };
    this.services.set(service.slug, service);
    return service;
  }

  updateService(id: string, patch: Partial<ServiceRecord>): ServiceRecord | undefined {
    const existing = this.getServiceById(id);
    if (!existing) return undefined;

    const updated: ServiceRecord = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.services.set(updated.slug, updated);
    return updated;
  }

  // --- Calls & Telemetry ---
  recordCall(call: CallRecord) {
    this.calls.unshift(call);
    if (this.calls.length > 1000) {
      this.calls.pop();
    }

    // Re-score the service if this was a delivered or failed call
    const service = this.services.get(call.serviceSlug);
    if (service && !call.isSandbox) {
      const serviceCalls = this.calls.filter((c) => c.serviceSlug === call.serviceSlug && !c.isSandbox);
      const delivered = serviceCalls.filter((c) => c.status === 'DELIVERED').length;
      const total = serviceCalls.length;
      const oldScore = service.trustScore;

      const scored = computeTrustScore({
        verifiedCalls: delivered,
        deliveredCalls: delivered,
        totalAttempted: total,
        p95Ms: service.p95Ms,
        slaMs: service.slaMs,
        isEndpointVerified: true,
        isIdentityLinked: true,
      });

      service.verifiedCalls = delivered;
      service.trustScore = scored.trustScore;
      service.trustLabel = scored.label;
      service.successRate = total > 0 ? delivered / total : 0;
      service.updatedAt = new Date().toISOString();

      if (oldScore !== scored.trustScore) {
        this.addEvent({
          id: `evt-${Date.now().toString(36)}`,
          type: 'SCORE_CHANGED',
          timestamp: new Date().toISOString(),
          serviceSlug: service.slug,
          serviceName: service.name,
          buyerAddress: call.buyer,
          scoreChange: { from: oldScore, to: scored.trustScore },
        });
      }
    }
  }

  getCalls(filter?: { serviceSlug?: string; buyer?: string; limit?: number }): CallRecord[] {
    let result = this.calls;
    if (filter?.serviceSlug) {
      result = result.filter((c) => c.serviceSlug === filter.serviceSlug);
    }
    if (filter?.buyer) {
      result = result.filter((c) => c.buyer.toLowerCase() === filter.buyer?.toLowerCase());
    }
    return result.slice(0, filter?.limit || 50);
  }

  // --- Events (SSE) ---
  addEvent(event: MarketplaceEvent) {
    this.events.unshift(event);
    if (this.events.length > 200) {
      this.events.pop();
    }
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('Error dispatching event to listener', err);
      }
    }
  }

  getRecentEvents(limit = 20): MarketplaceEvent[] {
    return this.events.slice(0, limit);
  }

  subscribeEvents(listener: (event: MarketplaceEvent) => void): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  // --- Buyer & Spend Policies ---
  getAgentWallet(address: string): AgentWalletRecord | undefined {
    return this.agentWallets.get(address.toLowerCase());
  }

  registerAgentWallet(wallet: AgentWalletRecord) {
    this.agentWallets.set(wallet.address.toLowerCase(), wallet);
  }

  getSpendPolicy(wallet: string): SpendPolicy | undefined {
    return this.spendPolicies.get(wallet.toLowerCase());
  }

  setSpendPolicy(policy: SpendPolicy) {
    this.spendPolicies.set(policy.wallet.toLowerCase(), policy);
  }

  // --- Stats & Reputation Breakdown ---
  getStats() {
    const services = Array.from(this.services.values());
    const totalCalls = services.reduce((acc, s) => acc + s.verifiedCalls, 0);
    const totalVolumeAtomic = services.reduce((acc, s) => acc + s.priceAtomic * BigInt(s.verifiedCalls), 0n);

    return {
      totalVerifiedCalls: totalCalls,
      totalVolumeUsdc: (Number(totalVolumeAtomic) / 1_000_000).toFixed(2),
      activeServicesCount: services.filter((s) => s.status === 'active').length,
      averageLatencyMs: 680,
      settlementGuarantee: '100% On-Chain',
    };
  }

  getReputationBreakdown(slug: string): ReputationBreakdown | undefined {
    const service = this.services.get(slug);
    if (!service) return undefined;

    const scored = computeTrustScore({
      verifiedCalls: service.verifiedCalls,
      deliveredCalls: service.verifiedCalls,
      totalAttempted: Math.round(service.verifiedCalls / Math.max(0.1, service.successRate)),
      p95Ms: service.p95Ms,
      slaMs: service.slaMs,
      isEndpointVerified: true,
      isIdentityLinked: true,
    });

    return {
      serviceId: service.id,
      slug: service.slug,
      trustScore: service.trustScore,
      label: service.trustLabel,
      verifiedCalls: service.verifiedCalls,
      successRate: service.successRate,
      p50Ms: service.p50Ms,
      p95Ms: service.p95Ms,
      components: scored.components,
      sampleSizes: {
        totalCalls: Math.round(service.verifiedCalls / Math.max(0.1, service.successRate)),
        deliveredCalls: service.verifiedCalls,
        failedCalls: Math.round(service.verifiedCalls / Math.max(0.1, service.successRate)) - service.verifiedCalls,
        feedbackCount: Math.min(service.verifiedCalls, 28),
      },
    };
  }
}

export const store = new DataStore();


