import { FastifyInstance } from 'fastify';
import { handleGatewayCall } from '../gateway/pipeline.js';

export async function gatewayRoutes(fastify: FastifyInstance) {
  // Direct call to service slug
  fastify.all('/v1/s/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    return handleGatewayCall(slug, request, reply);
  });

  // Call with sub-path, e.g. /v1/s/:slug/query
  fastify.all('/v1/s/:slug/*', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    return handleGatewayCall(slug, request, reply);
  });
}

