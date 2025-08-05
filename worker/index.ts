import { handleHttpAPI } from "./httpAPI";
import { WordCloudSession } from "./WebSocketAPI";

export interface Env {
  ASSETS: any;

  // D1 Database for HTTP API
  DB: D1Database;

  // Durable Objects for WebSocket API (placeholder)
  WORD_CLOUD_SESSIONS?: any;

  // Environment variables
  ENVIRONMENT?: string;
  DEBUG?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const isDebug = env.DEBUG === "true";
    if (isDebug) {
      console.log(
        `[${env.ENVIRONMENT || "dev"}] Request: ${request.method} ${url.pathname}`,
      );
    }

    try {
      // Route 1: WebSocket API - /ws
      if (request.headers.get("Upgrade") === "websocket") {
        return handleWebSocket(request, env);
      }

      // Route 2: HTTP API - /api/felles/*
      if (url.pathname.startsWith("/api/felles/")) {
        return handleHttpAPI(request, env, url);
      }

      // Route 3: Health and info endpoints
      if (url.pathname === "/health") {
        return handleHealth(env);
      }

      if (url.pathname === "/api/info") {
        return handleAPIInfo(env);
      }

      return new Response(null, { status: 404 });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};

// WebSocket handler - delegate to Durable Object
async function handleWebSocket(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId") || "default";

  if (env.DEBUG === "true") {
    console.log(`WebSocket upgrade for session: ${sessionId}`);
  }

  // Get Durable Object instance
  const id = env.WORD_CLOUD_SESSIONS?.idFromName(sessionId);
  if (!id) {
    return new Response("Durable Objects not available", { status: 503 });
  }

  const stub = env.WORD_CLOUD_SESSIONS.get(id);

  // Forward the WebSocket upgrade request to the Durable Object
  return stub.fetch(request);
}

// Health check endpoint
async function handleHealth(env: Env): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: "OK",
      environment: env.ENVIRONMENT || "development",
      timestamp: new Date().toISOString(),
      services: {
        websocket: "available",
        http_api: "available",
        static_assets: "available",
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

// API info endpoint
async function handleAPIInfo(env: Env): Promise<Response> {
  return new Response(
    JSON.stringify({
      name: "ordsky-no-unified",
      version: "1.0.0",
      environment: env.ENVIRONMENT || "development",
      apis: {
        websocket: "/ws?sessionId=<session_id>",
        http: "/api/felles/*",
        health: "/health",
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

// Export Durable Object for wrangler
export { WordCloudSession };
