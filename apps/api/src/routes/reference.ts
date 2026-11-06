import { FastifyInstance } from 'fastify';

export async function referenceRoutes(fastify: FastifyInstance) {
  // 1. India EV Market Data
  fastify.all('/upstream/ev-market-data', async (request, reply) => {
    return reply.send({
      market: 'India EV Ecosystem',
      asOf: '2026-11-01',
      totalRegistrationsMonth: 148200,
      yearOnYearGrowth: '+41.8%',
      oemLeaderboard: [
        { oem: 'Tata Motors', share: '62.4%', volume: 92476, topModel: 'Nexon EV 45' },
        { oem: 'Mahindra Electric', share: '16.8%', volume: 24897, topModel: 'XUV400' },
        { oem: 'MG Motor India', share: '11.5%', volume: 17043, topModel: 'Windsor EV' },
        { oem: 'BYD India', share: '4.2%', volume: 6224, topModel: 'Atto 3' },
      ],
      subsidyStatus: {
        scheme: 'PM E-DRIVE',
        remainingBudgetCrores: 4890,
        averageClaimTimeDays: 14,
      },
    });
  });

  // 2. Competitor Intel
  fastify.all('/upstream/competitor-intel', async (request, reply) => {
    const body = (request.body as { domain?: string }) || {};
    const domain = body.domain || 'example.com';

    return reply.send({
      target: domain,
      crawledAt: new Date().toISOString(),
      pricingTiers: [
        { plan: 'Starter', price: '$29/mo', userLimit: 3 },
        { plan: 'Growth', price: '$99/mo', userLimit: 10 },
        { plan: 'Enterprise', price: 'Custom', ssoIncluded: true },
      ],
      recentReleases: [
        { date: '2026-10-24', feature: 'x402 Agentic Payment Gateway' },
        { date: '2026-10-10', feature: 'Real-time WebSocket Streaming' },
      ],
      trafficRank: 14209,
      technologyStack: ['Next.js 15', 'Tailwind CSS', 'Fastify', 'Avalanche C-Chain'],
    });
  });

  // 3. Sentiment Pulse
  fastify.all('/upstream/sentiment-pulse', async (request, reply) => {
    const body = (request.body as { text?: string }) || {};
    const text = body.text || 'Avalanche transaction throughput hits new all-time high';

    const isPositive = !text.toLowerCase().includes('fail') && !text.toLowerCase().includes('crash') && !text.toLowerCase().includes('drop');

    return reply.send({
      analyzedText: text.slice(0, 100),
      classification: isPositive ? 'BULLISH' : 'BEARISH',
      confidenceScore: isPositive ? 0.94 : 0.88,
      sentimentComponents: {
        positivity: isPositive ? 0.89 : 0.12,
        negativity: isPositive ? 0.04 : 0.79,
        neutrality: 0.07,
      },
      salientKeywords: ['throughput', 'network', 'growth', 'avalanche'],
    });
  });

  // 4. Forecast Lite
  fastify.all('/upstream/forecast-lite', async (request, reply) => {
    const body = (request.body as { series?: number[]; horizon?: number }) || {};
    const series = body.series || [120, 145, 160, 182, 210];
    const horizon = body.horizon || 3;

    const last = series[series.length - 1];
    const step = 20;
    const predictions = Array.from({ length: horizon }, (_, i) => last + (i + 1) * step);

    return reply.send({
      model: 'AutoRegressive-Lightweight-v1',
      forecastHorizon: horizon,
      predictions,
      confidenceIntervals: predictions.map((p) => ({
        lower: Math.round(p * 0.92),
        upper: Math.round(p * 1.08),
      })),
      trend: 'UPWARD_EXPONENTIAL',
    });
  });

  // 5. Code Review Lite
  fastify.all('/upstream/code-review-lite', async (request, reply) => {
    return reply.send({
      engine: 'Agentra Static Analyzer v2.4',
      passed: true,
      findingsCount: 1,
      findings: [
        {
          severity: 'LOW',
          rule: 'EIP-3009 Nonce Consumption',
          message: 'Ensure nonce is recorded before external calls to prevent reentrancy during settlement.',
          line: 42,
        },
      ],
      gasOptimizationPotential: '~2,400 gas saved by caching storage pointer in memory',
    });
  });

  // 6. Flaky Translate (Deliberately unreliable for Pay-On-Success demo)
  fastify.all('/upstream/flaky-translate', async (request, reply) => {
    const query = request.query as { fail?: string };
    const forceFail = query?.fail === '1' || query?.fail === 'true';

    // Fails ~40% of the time or when ?fail=1 is passed
    const shouldFail = forceFail || Math.random() < 0.4;

    if (shouldFail) {
      return reply.status(503).send({
        error: 'ServiceUnavailable',
        message: 'Translation worker crashed or timed out under load. Pay-on-Success protection active.',
        transient: true,
      });
    }

    const body = (request.body as { text?: string; targetLang?: string }) || {};
    const text = body.text || 'Hello autonomous agents';

    return reply.send({
      originalText: text,
      translatedText: 'Hola agentes autónomos',
      detectedSourceLang: 'en',
      targetLang: body.targetLang || 'es',
      latencyUpstreamMs: 310,
    });
  });
}

