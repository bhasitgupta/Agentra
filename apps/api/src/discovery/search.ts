import { ServiceRecord } from '../db/types.js';

export interface DiscoveryResult {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  priceUsdc: string;
  priceAtomic: string;
  trustScore: number;
  label: string;
  verifiedCalls: number;
  p95Ms: number;
  gatewayUrl: string;
  score: number;
  reason: string;
}

export interface DiscoverOptions {
  category?: string;
  maxPriceAtomic?: bigint;
  minTrust?: number;
  limit?: number;
}

/**
 * Calculates keyword / semantic relevance score between query and service metadata
 */
function calculateRelevance(query: string, service: ServiceRecord): number {
  if (!query || query.trim() === '') return 0.5;

  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const text = `${service.name} ${service.description} ${service.category} ${service.tags.join(' ')}`.toLowerCase();

  let hits = 0;
  for (const word of words) {
    if (text.includes(word)) hits += 1;
  }

  // Exact phrase boost
  let score = words.length > 0 ? hits / words.length : 0.5;
  if (text.includes(q)) score = Math.max(score, 0.95);

  return Math.min(1.0, score);
}

/**
 * Executes hybrid ranking algorithm per TRD-A section 8
 */
export function rankServicesForTask(
  query: string,
  services: ServiceRecord[],
  options: DiscoverOptions = {},
  gatewayBaseUrl: string
): { degraded: boolean; results: DiscoveryResult[] } {
  const filtered = services.filter((s) => {
    if (s.status !== 'active') return false;
    if (options.category && s.category !== options.category) return false;
    if (options.minTrust && s.trustScore < options.minTrust) return false;
    if (options.maxPriceAtomic && s.priceAtomic > options.maxPriceAtomic) return false;
    return true;
  });

  const scoredResults = filtered.map((service) => {
    const rel = calculateRelevance(query, service);

    const priceUsdcNum = Number(service.priceAtomic) / 1_000_000;
    const maxPriceUsdc = 0.10;
    const priceFit = Math.max(0, 1 - Math.min(1, priceUsdcNum / maxPriceUsdc));

    const latencyFit = Math.max(0, 1 - Math.min(1, service.p95Ms / (4 * Math.max(service.slaMs, 500))));
    const newBoost = service.verifiedCalls < 5 ? 1 : 0;
    const trustNormalized = service.trustScore / 100;

    // final = 0.55*rel + 0.25*(trust/100) + 0.12*priceFit + 0.08*latencyFit + 0.05*newBoost
    const finalScore =
      0.55 * rel +
      0.25 * trustNormalized +
      0.12 * priceFit +
      0.08 * latencyFit +
      0.05 * newBoost;

    const reason = `Matches task (${Math.round(rel * 100)}%); trust ${service.trustScore} over ${service.verifiedCalls} verified calls; ${priceUsdcNum.toFixed(3)} USDC`;

    return {
      id: service.id,
      slug: service.slug,
      name: service.name,
      description: service.description,
      category: service.category,
      priceUsdc: priceUsdcNum.toFixed(3),
      priceAtomic: service.priceAtomic.toString(),
      trustScore: service.trustScore,
      label: service.trustLabel,
      verifiedCalls: service.verifiedCalls,
      p95Ms: service.p95Ms,
      gatewayUrl: `${gatewayBaseUrl}/${service.slug}`,
      score: Math.round(finalScore * 1000) / 1000,
      reason,
    };
  });

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);

  const limit = options.limit || 10;
  return {
    degraded: false,
    results: scoredResults.slice(0, limit),
  };
}

