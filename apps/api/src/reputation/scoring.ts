import { TrustLabel, ReputationBreakdown } from '../db/types.js';

export interface ScoreInputs {
  verifiedCalls: number;
  deliveredCalls: number;
  totalAttempted: number;
  p95Ms: number;
  slaMs: number;
  isEndpointVerified: boolean;
  isIdentityLinked: boolean;
  feedbacks?: Array<{ value: number; weight: number }>;
}

/**
 * Computes Wilson score interval 95% lower bound for success rate S
 */
export function computeWilsonScore(successes: number, total: number): number {
  if (total === 0) return 0;
  const z = 1.96; // 95% confidence
  const p = successes / total;
  const z2 = z * z;
  const denominator = 1 + z2 / total;
  const center = p + z2 / (2 * total);
  const spread = z * Math.sqrt((p * (1 - p) + z2 / (4 * total)) / total);
  const lowerBound = (center - spread) / denominator;
  return Math.max(0, Math.min(1, lowerBound));
}

/**
 * Computes Bayesian rating quality Q with prior 70 and strength m=5
 */
export function computeRatingQuality(feedbacks: Array<{ value: number; weight: number }> = []): number {
  const prior = 70;
  const m = 5;

  let sumW = 0;
  let sumWV = 0;

  for (const f of feedbacks) {
    sumW += f.weight;
    sumWV += f.weight * f.value;
  }

  const q = (sumWV + m * prior) / (sumW + m) / 100;
  return Math.max(0, Math.min(1, q));
}

/**
 * Computes Latency score L based on SLA (falls linearly to 0 at 4x SLA)
 */
export function computeLatencyScore(p95Ms: number, slaMs: number): number {
  if (p95Ms <= slaMs) return 1.0;
  const maxLag = 3 * slaMs;
  const over = p95Ms - slaMs;
  return Math.max(0, 1 - over / maxLag);
}

/**
 * Computes Verification score V (0.5 for endpoint, 0.5 for on-chain identity)
 */
export function computeVerificationScore(endpointVerified: boolean, identityLinked: boolean): number {
  let v = 0;
  if (endpointVerified) v += 0.5;
  if (identityLinked) v += 0.5;
  return v;
}

/**
 * Computes Trust Score and Label per TRD-A section 9
 */
export function computeTrustScore(inputs: ScoreInputs): {
  trustScore: number;
  label: TrustLabel;
  components: ReputationBreakdown['components'];
} {
  const Q = computeRatingQuality(inputs.feedbacks);
  const S = computeWilsonScore(inputs.deliveredCalls, Math.max(inputs.totalAttempted, inputs.deliveredCalls));
  const L = computeLatencyScore(inputs.p95Ms, inputs.slaMs);
  const V = computeVerificationScore(inputs.isEndpointVerified, inputs.isIdentityLinked);

  // TrustScore = round(100 * (0.40*Q + 0.30*S + 0.15*L + 0.15*V))
  const rawScore = Math.round(100 * (0.40 * Q + 0.30 * S + 0.15 * L + 0.15 * V));
  const trustScore = Math.max(1, Math.min(100, rawScore));

  let label: TrustLabel = 'New';
  if (inputs.verifiedCalls >= 25) {
    label = 'Established';
  } else if (inputs.verifiedCalls >= 5) {
    label = 'Provisional';
  }

  return {
    trustScore,
    label,
    components: {
      Q: Math.round(Q * 1000) / 1000,
      S: Math.round(S * 1000) / 1000,
      L: Math.round(L * 1000) / 1000,
      V: Math.round(V * 1000) / 1000,
    },
  };
}

