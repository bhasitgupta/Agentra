import { FastifyInstance } from 'fastify';
import { store } from '../db/store.js';
import { MarketplaceEvent } from '../db/types.js';

export async function feedRoutes(fastify: FastifyInstance) {
  // GET /v1/feed/recent - JSON format
  fastify.get('/v1/feed/recent', async (request, reply) => {
    const query = request.query as { limit?: string };
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const events = store.getRecentEvents(limit);

    return reply.send({
      events: events.map((e) => ({
        ...e,
        amountAtomic: e.amountAtomic ? e.amountAtomic.toString() : undefined,
        amountUsdc: e.amountAtomic ? Number(e.amountAtomic) / 1_000_000 : undefined,
      })),
    });
  });

  // GET /v1/feed - Server-Sent Events (SSE)
  fastify.get('/v1/feed', async (request, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache, no-transform');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('Access-Control-Allow-Origin', '*');

    // Send initial replay buffer
    const recentEvents = store.getRecentEvents(10);
    for (const evt of recentEvents.reverse()) {
      const data = JSON.stringify({
        ...evt,
        amountAtomic: evt.amountAtomic ? evt.amountAtomic.toString() : undefined,
        amountUsdc: evt.amountAtomic ? Number(evt.amountAtomic) / 1_000_000 : undefined,
      });
      reply.raw.write(`event: marketplace_event\ndata: ${data}\n\n`);
    }

    // Subscribe to new events
    const unsubscribe = store.subscribeEvents((event: MarketplaceEvent) => {
      const data = JSON.stringify({
        ...event,
        amountAtomic: event.amountAtomic ? event.amountAtomic.toString() : undefined,
        amountUsdc: event.amountAtomic ? Number(event.amountAtomic) / 1_000_000 : undefined,
      });
      reply.raw.write(`event: marketplace_event\ndata: ${data}\n\n`);
    });

    // 15-second heartbeat
    const heartbeatTimer = setInterval(() => {
      reply.raw.write(`: heartbeat ${new Date().toISOString()}\n\n`);
    }, 15000);

    request.raw.on('close', () => {
      clearInterval(heartbeatTimer);
      unsubscribe();
    });
  });
}

