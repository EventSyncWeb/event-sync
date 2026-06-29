import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const FORWARD_HEADERS = new Set([
  "content-type",
  "authorization",
  "accept",
  "cache-control",
  "x-visitor-id",
]);

const EXCLUDE_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "transfer-encoding",
  "connection",
  "keep-alive",
]);

export async function proxy(request) {
  const url = new URL(request.url);
  const path = url.pathname + url.search;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Visitor-Id",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const backendUrl = `${apiUrl}${path}`;

  const headers = {};
  for (const [key, value] of request.headers) {
    if (FORWARD_HEADERS.has(key)) {
      headers[key] = value;
    }
  }

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.blob()
      : undefined;

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
    duplex: "half",
  });

  const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
  };

  for (const [key, value] of response.headers) {
    if (!EXCLUDE_RESPONSE_HEADERS.has(key)) {
      responseHeaders[key] = value;
    }
  }

  const responseBody = await response.blob();

  return new Response(responseBody, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const config = {
  matcher: ["/api/:path*", "/question/:path*"],
};
