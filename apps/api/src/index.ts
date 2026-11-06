import Fastify, { FastifyError } from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { CONFIG } from './config.js';
import { authRoutes } from './routes/auth.js';
import { servicesRoutes } from './routes/services.js';
import { feedRoutes } from './routes/feed.js';
import { providerRoutes } from './routes/provider.js';
import { buyerRoutes } from './routes/buyer.js';
import { gatewayRoutes } from './routes/gateway.js';
import { mcpRoutes } from './routes/mcp.js';
import { referenceRoutes } from './routes/reference.js';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

async function bootstrap() {
  const fastify = Fastify({
    logger: {
      level: 'info',
    },
  });

  // Register Plugins
  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'PAYMENT-SIGNATURE', 'X-Requested-With', 'X-Agentra-Buyer'],
    exposedHeaders: ['PAYMENT-REQUIRED', 'PAYMENT-RESPONSE', 'X-Agentra-Receipt', 'X-Agentra-Settle-Tx', 'X-Agentra-Untrusted'],
  });

  await fastify.register(formbody);

  // RFC 9457 Problem Details Error Handler
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    fastify.log.error(error);
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      type: `https://agentra.xyz/errors/${error.code || 'BZ-5000'}`,
      title: error.name || 'Internal Server Error',
      status: statusCode,
      detail: error.message,
      requestId: request.id,
    });
  });

  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      network: 'Avalanche (43113)',
      timestamp: new Date().toISOString(),
      contracts: {
        splitter: CONFIG.PROVIDER_SPLITTER_ADDRESS,
        registry: CONFIG.SERVICE_REGISTRY_ADDRESS,
        escrow: CONFIG.TASK_ESCROW_ADDRESS,
      },
    };
  });

  // Mount Routes
  await fastify.register(authRoutes);
  await fastify.register(servicesRoutes);
  await fastify.register(feedRoutes);
  await fastify.register(providerRoutes);
  await fastify.register(buyerRoutes);
  await fastify.register(gatewayRoutes);
  await fastify.register(mcpRoutes);
  await fastify.register(referenceRoutes);

  // Start Server
  try {
    await fastify.listen({ port: CONFIG.PORT, host: CONFIG.HOST });
    fastify.log.info(`🚀 Agentra Backend API & Gateway live on port ${CONFIG.PORT}`);
    fastify.log.info(`📡 Gateway endpoint: http://${CONFIG.HOST}:${CONFIG.PORT}/v1/s/:slug`);
    fastify.log.info(`🤖 MCP Server endpoint: http://${CONFIG.HOST}:${CONFIG.PORT}/mcp`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();

