import { Service, ActivityEvent, ProviderCallRecord } from './types';
import { REFERENCE_SERVICES, MOCK_ACTIVITY_FEED } from './mockData';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

export interface StatsResponse {
  totalVerifiedCalls: number;
  totalVolumeUsdc: string;
  activeServicesCount: number;
  averageLatencyMs: number;
  settlementGuarantee: string;
}

export interface DiscoverResult {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  priceUsdc: string;
  priceAtomic: string;
  trustScore: number;
  label: 'Established' | 'Provisional' | 'New';
  verifiedCalls: number;
  p95Ms: number;
  gatewayUrl: string;
  score: number;
  reason: string;
}

export interface DiscoverResponse {
  degraded: boolean;
  query: string;
  count: number;
  results: DiscoverResult[];
}

export interface GatewayCallResult {
  status: number;
  latencyMs: number;
  chargedUSDC: number;
  receipt?: string;
  txHash?: string;
  data?: any;
  error?: string;
  isFlakyZeroFee?: boolean;
}

// 1. Fetch Stats (Landing page)
export async function fetchStats(): Promise<StatsResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/stats`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Fallback stats used:', err);
    return {
      totalVerifiedCalls: 813,
      totalVolumeUsdc: '11.05',
      activeServicesCount: 6,
      averageLatencyMs: 680,
      settlementGuarantee: '100% On Avalanche Fuji',
    };
  }
}

// 2. Fetch Services (Explore browse)
export async function fetchServices(params?: {
  category?: string;
  minTrust?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}): Promise<Service[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') {
      query.set('category', params.category);
    }
    if (params?.minTrust) {
      query.set('minTrust', params.minTrust.toString());
    }
    if (params?.maxPrice) {
      query.set('maxPrice', params.maxPrice.toString());
    }
    if (params?.search) {
      query.set('search', params.search);
    }
    if (params?.sort) {
      query.set('sort', params.sort);
    }

    const res = await fetch(`${API_BASE_URL}/v1/services?${query.toString()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.services) && data.services.length > 0) {
      return data.services.map((s: any) => ({
        slug: s.slug,
        name: s.name,
        category: s.category,
        price: parseFloat(s.priceUsdc || (Number(s.priceAtomic) / 1_000_000).toFixed(3)),
        trustScore: s.trustScore,
        label: s.label,
        verifiedCalls: s.verifiedCalls,
        p95Ms: s.p95Ms,
        description: s.description,
        providerAddress: s.payTo || s.owner,
        tags: s.tags || [],
        endpoint: s.endpointUrl,
        inputSchema: s.inputSchema,
        outputSchema: s.outputSchema,
      }));
    }
    return REFERENCE_SERVICES;
  } catch (err) {
    console.warn('Fallback services used:', err);
    return REFERENCE_SERVICES;
  }
}

// 3. Natural Language Task Discovery
export async function discoverServices(task: string, maxPriceUsdc?: number): Promise<DiscoverResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, maxPriceUsdc }),
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Fallback discovery used:', err);
    return {
      degraded: true,
      query: task,
      count: REFERENCE_SERVICES.length,
      results: REFERENCE_SERVICES.map((s) => ({
        id: s.slug,
        slug: s.slug,
        name: s.name,
        description: s.description,
        category: s.category,
        priceUsdc: s.price.toFixed(3),
        priceAtomic: (s.price * 1_000_000).toString(),
        trustScore: s.trustScore,
        label: s.label,
        verifiedCalls: s.verifiedCalls,
        p95Ms: s.p95Ms,
        gatewayUrl: `${API_BASE_URL}/v1/s/${s.slug}`,
        score: s.trustScore / 100,
        reason: `Matches task; trust ${s.trustScore}; ${s.price} USDC`,
      })),
    };
  }
}

// 4. Fetch Service Detail
export async function fetchServiceDetail(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/services/${slug}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const s = await res.json();
    return {
      slug: s.slug,
      name: s.name,
      category: s.category,
      price: parseFloat(s.priceUsdc || (Number(s.priceAtomic) / 1_000_000).toFixed(3)),
      trustScore: s.trustScore,
      label: s.label,
      verifiedCalls: s.verifiedCalls,
      p95Ms: s.p95Ms,
      description: s.description,
      providerAddress: s.payTo || s.owner,
      tags: s.tags || [],
      endpoint: s.endpointUrl,
      inputSchema: s.inputSchema,
      outputSchema: s.outputSchema,
    };
  } catch {
    return REFERENCE_SERVICES.find((s) => s.slug === slug) || null;
  }
}

// 5. Fetch Activity / Telemetry
export async function fetchServiceActivity(slug: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/services/${slug}/activity`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.calls || [];
  } catch {
    return [];
  }
}

export async function fetchRecentActivity(): Promise<ActivityEvent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/feed/recent?limit=25`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.events) && data.events.length > 0) {
      return data.events.map((e: any) => ({
        id: e.id,
        type: e.type,
        serviceSlug: e.serviceSlug,
        serviceName: e.serviceName,
        buyerAddress: e.buyerAddress || '0x3A2b...9F4c',
        amountUSDC: e.amountUsdc || 0,
        latencyMs: e.latencyMs || 500,
        txHash: e.txHash || '0x0000000000000000000000000000000000000000',
        timestamp: e.timestamp,
        details: e.details,
      }));
    }
    return MOCK_ACTIVITY_FEED;
  } catch {
    return MOCK_ACTIVITY_FEED;
  }
}

// 6. Execute Real Gateway Call (x402 Flow)
export async function executeGatewayCall(
  slug: string,
  payload: any,
  buyerAddress?: string,
  forceFail = false
): Promise<GatewayCallResult> {
  const url = `${API_BASE_URL}/v1/s/${slug}${forceFail ? '?fail=1' : ''}`;
  const start = Date.now();

  try {
    // 1st request: trigger 402 challenge
    const resInitial = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (resInitial.status === 402) {
      // Received 402 Payment Required!
      const challengeBase64 = resInitial.headers.get('PAYMENT-REQUIRED');
      let challenge: any = null;
      if (challengeBase64) {
        try {
          challenge = JSON.parse(atob(challengeBase64));
        } catch {}
      }

      // Generate payment signature authorization (EIP-712 / EIP-3009 simulation for the browser)
      const buyer = buyerAddress || '0x71C83602167d60FA98e82aC95796a56B9F29A3f0';
      const req = challenge?.accepts?.[0] || { amount: '10000', asset: '0x5425890298aed601595a70ab815c96711a31bc65', payTo: '0x943bc63d6c8dc18b1b234a6e8b8af82cfc52adbf' };
      
      const paymentPayload = {
        x402Version: 2,
        scheme: 'exact',
        network: 'eip155:43113',
        authorization: {
          from: buyer,
          to: req.payTo,
          value: req.amount,
          validAfter: 0,
          validBefore: Math.floor(Date.now() / 1000) + 120,
          nonce: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        },
        signature: '0x' + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      };

      const encodedAuth = btoa(JSON.stringify(paymentPayload));

      // 2nd request: retry with PAYMENT-SIGNATURE
      const resPaid = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PAYMENT-SIGNATURE': encodedAuth,
          'X-Agentra-Buyer': buyer,
        },
        body: JSON.stringify(payload),
      });

      const elapsed = Date.now() - start;

      if (!resPaid.ok) {
        // Pay-on-success protection triggered!
        const errJson = await resPaid.json().catch(() => ({}));
        return {
          status: resPaid.status,
          latencyMs: elapsed,
          chargedUSDC: 0.000,
          isFlakyZeroFee: true,
          error: errJson.detail || errJson.title || 'Upstream provider error. Pay-on-Success activated: 0 USDC debited.',
        };
      }

      const data = await resPaid.json().catch(() => ({}));
      const receipt = resPaid.headers.get('X-Agentra-Receipt') || `rcpt-${Date.now()}`;
      const txHash = resPaid.headers.get('X-Agentra-Settle-Tx') || '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      return {
        status: 200,
        latencyMs: elapsed,
        chargedUSDC: Number(req.amount) / 1_000_000,
        receipt,
        txHash,
        data,
      };
    }

    const data = await resInitial.json().catch(() => ({}));
    return {
      status: resInitial.status,
      latencyMs: Date.now() - start,
      chargedUSDC: 0,
      data,
    };
  } catch (err: any) {
    return {
      status: 500,
      latencyMs: Date.now() - start,
      chargedUSDC: 0,
      error: err.message || 'Connection failed',
    };
  }
}
