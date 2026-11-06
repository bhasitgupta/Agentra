import { FastifyInstance } from 'fastify';
import { store } from '../db/store.js';
import { rankServicesForTask } from '../discovery/search.js';
import { CONFIG } from '../config.js';

export async function servicesRoutes(fastify: FastifyInstance) {
  // GET /v1/services - Browse & Filter
  fastify.get('/v1/services', async (request, reply) => {
    const query = request.query as {
      category?: string;
      minTrust?: string;
      maxPrice?: string;
      search?: string;
      sort?: 'trust' | 'price' | 'calls' | 'latency';
    };

    let services = store.getAllServices().filter((s) => s.status === 'active');

    if (query.category) {
      services = services.filter((s) => s.category === query.category);
    }

    if (query.minTrust) {
      const min = parseInt(query.minTrust, 10);
      services = services.filter((s) => s.trustScore >= min);
    }

    if (query.maxPrice) {
      const maxAtomic = BigInt(Math.round(parseFloat(query.maxPrice) * 1_000_000));
      services = services.filter((s) => s.priceAtomic <= maxAtomic);
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (query.sort === 'price') {
      services.sort((a, b) => Number(a.priceAtomic - b.priceAtomic));
    } else if (query.sort === 'calls') {
      services.sort((a, b) => b.verifiedCalls - a.verifiedCalls);
    } else if (query.sort === 'latency') {
      services.sort((a, b) => a.p95Ms - b.p95Ms);
    } else {
      // Default: sort by trust score descending
      services.sort((a, b) => b.trustScore - a.trustScore);
    }

    return reply.send({
      count: services.length,
      services: services.map((s) => ({
        ...s,
        priceAtomic: s.priceAtomic.toString(),
        priceUsdc: (Number(s.priceAtomic) / 1_000_000).toFixed(3),
        gatewayUrl: `${CONFIG.GATEWAY_BASE_URL}/${s.slug}`,
      })),
    });
  });

  // POST /v1/discover - Natural Language Discovery with Reason
  fastify.post('/v1/discover', async (request, reply) => {
    const body = (request.body as {
      task?: string;
      category?: string;
      maxPriceUsdc?: number;
      minTrust?: number;
      limit?: number;
    }) || {};

    const task = body.task || '';
    const allServices = store.getAllServices();

    const maxPriceAtomic = body.maxPriceUsdc
      ? BigInt(Math.round(body.maxPriceUsdc * 1_000_000))
      : undefined;

    const ranking = rankServicesForTask(
      task,
      allServices,
      {
        category: body.category,
        maxPriceAtomic,
        minTrust: body.minTrust,
        limit: body.limit || 5,
      },
      CONFIG.GATEWAY_BASE_URL
    );

    return reply.send(ranking);
  });

  // GET /v1/services/:idOrSlug - Service Detail
  fastify.get('/v1/services/:idOrSlug', async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const service = store.getServiceBySlug(idOrSlug) || store.getServiceById(idOrSlug);

    if (!service) {
      return reply.status(404).send({
        type: 'https://agentra.xyz/errors/BZ-1001',
        title: 'Service Not Found',
        status: 404,
        detail: `No service found for ${idOrSlug}`,
      });
    }

    return reply.send({
      ...service,
      priceAtomic: service.priceAtomic.toString(),
      priceUsdc: (Number(service.priceAtomic) / 1_000_000).toFixed(3),
      gatewayUrl: `${CONFIG.GATEWAY_BASE_URL}/${service.slug}`,
    });
  });

  // GET /v1/services/:idOrSlug/reputation - Audit-Grade Reputation Breakdown
  fastify.get('/v1/services/:idOrSlug/reputation', async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const service = store.getServiceBySlug(idOrSlug) || store.getServiceById(idOrSlug);

    if (!service) {
      return reply.status(404).send({ error: 'Service not found' });
    }

    const breakdown = store.getReputationBreakdown(service.slug);
    return reply.send(breakdown);
  });

  // GET /v1/services/:idOrSlug/activity - Recent Calls
  fastify.get('/v1/services/:idOrSlug/activity', async (request, reply) => {
    const { idOrSlug } = request.params as { idOrSlug: string };
    const service = store.getServiceBySlug(idOrSlug) || store.getServiceById(idOrSlug);

    if (!service) {
      return reply.status(404).send({ error: 'Service not found' });
    }

    const calls = store.getCalls({ serviceSlug: service.slug, limit: 30 });
    return reply.send({
      slug: service.slug,
      calls: calls.map((c) => ({
        ...c,
        priceAtomic: c.priceAtomic.toString(),
        priceUsdc: (Number(c.priceAtomic) / 1_000_000).toFixed(3),
      })),
    });
  });

  // GET /v1/stats - Landing Page Totals
  fastify.get('/v1/stats', async (_request, reply) => {
    return reply.send(store.getStats());
  });
}

