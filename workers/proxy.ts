const ICS_URL =
  "https://calendar.google.com/calendar/ical/798c1d6ca774c27ec67cf778290768bfda49f4cb7f9340446a18cb795d795e64%40group.calendar.google.com/public/basic.ics";

const CACHE_KEY_ICS_URL = "https://cache.crashpunkband.com/calendar/basic.ics";
const CACHE_KEY_IMAGE_BASE_URL = "https://cache.crashpunkband.com/image/";
const CACHE_DURATION_SECONDS = 60 * 60 * 12; // 12 hours
const STALE_CACHE_DURATION_SECONDS = 60 * 60 * 24 * 30 * 6; // 6 months

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,HEAD,OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
};

type Env = {
  STALE_CALENDAR_ICS: KVNamespace;
};

type Caches = {
  default: Cache;
};
declare const caches: Caches;


function isAllowedOrigin(request: Request): boolean {
  const source = request.headers.get("origin") || request.headers.get("referer");
  if (source?.includes("crashpunkband.com") || source?.includes("localhost:3000")) {
    return true;
  }
  return false;
}


function driveViewUrlFromId(id: string): string {
  return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`;
}


async function getOrFetchICS(cache: Cache, env: Env): Promise<{ body: string; fromCache: boolean }> {
  // Try cache first
  const cacheKey = new Request(CACHE_KEY_ICS_URL, { method: "GET" });

  const cached = await cache.match(cacheKey);
  if (cached) {
    return { body: await cached.text(), fromCache: true };
  }

  // Fetch fresh
  let upstreamSuccess = false;
  let upstreamError: unknown = null;
  let upstream: Response | null = null;
  try {
    upstream = await fetch(ICS_URL, {
      method: "GET",
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/calendar,application/octet-stream,*/*;q=0.1",
        Referer: "https://calendar.google.com/",
      },
      cf: { cacheEverything: false, cacheTtl: 0 },
    } as RequestInit);
    upstreamSuccess = true;
  } catch (err) {
    upstreamError = err;
  }


  // On Failed Upstream, try to serve stale cache if available
  if (!upstreamSuccess || !upstream?.ok) {
    const staleBody = await env.STALE_CALENDAR_ICS.get('calendar.ics');
    if (staleBody) {
      return { body: staleBody, fromCache: true };
    }

    // If no stale cache, return error
    const bodyText = await upstream?.text().catch(() => "<no body>");
    throw new Error(
      `Upstream ${upstream?.status}: ${bodyText?.slice(0, 200)}`
    );
  }

  const body = await upstream.text();

  // Cache it
  const cacheResponse = new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "cache-control": `public, max-age=${CACHE_DURATION_SECONDS}`,
    },
  });
  await cache.put(cacheKey, cacheResponse);
  await env.STALE_CALENDAR_ICS.put('calendar.ics', body, { expirationTtl: STALE_CACHE_DURATION_SECONDS });

  console.log(JSON.stringify({
    event: "Fetched ICS from upstream",
    success: upstreamSuccess,
    status: upstream?.status,
    fromShortCache: false,
    fromStaleCache: false
  }));
  return { body, fromCache: false };
}

async function getOrFetchImage(id: string, cache: Cache, env: Env): Promise<{ response: Response; fromCache: boolean }> {
  // try cache first
  const imageUrl = `${CACHE_KEY_IMAGE_BASE_URL}${encodeURIComponent(id)}`;
  const cacheKey = new Request(imageUrl, { method: "GET" });

  const cached = await cache.match(cacheKey);
  if (cached) {
    console.log(JSON.stringify({
      event: "Served image from short-term cache",
      fromShortCache: true,
      fromStaleCache: false
    }));

    return { response: cached, fromCache: true };
  }
  
  // Fetch fresh
  let upstreamSuccess = false;
  let upstreamError: unknown = null;
  let upstream: Response | null = null;
  try {
    upstream = await fetch(driveViewUrlFromId(id), {
      method: "GET", // always GET so we can cache the body
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/*,*/*;q=0.1",
        Referer: "https://drive.google.com/",
      },
      cf: { cacheEverything: false, cacheTtl: 0 },
    } as RequestInit);
    upstreamSuccess = true;
  } catch (err) {
    upstreamError = err;
  }

  // On Failed Upstream, try and serve stale cache if available
  if (!upstreamSuccess || !upstream?.ok) {
    const staleData = await env.STALE_CALENDAR_ICS.get(`image-${id}`, { type: "arrayBuffer" });
    if (staleData) {
      const contentType = "image/jpeg"; // default to jpeg, since we don't store content type in stale cache

      console.log(JSON.stringify({
        event: "Upstream image fetch failed, serving stale cache",
        success: upstreamSuccess,
        error: String(upstreamError),
        errorType: (upstreamError as Error)?.constructor?.name || "unknown",
        status: upstream?.status,
        fromShortCache: false,
        fromStaleCache: true
      }));

      return {
        response: new Response(staleData, {
          status: 200,
          headers: {
            "content-type": contentType,
            "cache-control": "no-store, max-age=0",
          },
        }),
        fromCache: true,
      };
    }

    // If no stale cache, return error
    const bodyText = await upstream?.text().catch(() => "<no body>");
    throw new Error(
      `Upstream ${upstream?.status}: ${bodyText?.slice(0, 200)}`
    );
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const imageBuffer = await upstream.arrayBuffer(); // Read stream once into memory

  const cacheResponse = new Response(imageBuffer, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": `public, max-age=${CACHE_DURATION_SECONDS}`,
    },
  });
  await cache.put(cacheKey, cacheResponse.clone());
  await env.STALE_CALENDAR_ICS.put(`image-${id}`, imageBuffer, { expirationTtl: STALE_CACHE_DURATION_SECONDS });

  console.log(JSON.stringify({
    event: "Fetched image from upstream",
    success: upstreamSuccess,
    status: upstream?.status,
    fromShortCache: false,
    fromStaleCache: false
  }));

  return { response: cacheResponse, fromCache: false };
}



export default {
  async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    if (!isAllowedOrigin(request)) {
      return new Response("Forbidden", { status: 403 });
    }


    // Open Cache API
    const cache = caches.default as Cache;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (method !== "GET" && method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    // Route 1: calendar ics proxy (with cache)
    if (url.pathname === "/ical") {
      try {
        const { body, fromCache } = await getOrFetchICS(cache, env as Env);

        return new Response(body, {
          status: 200,
          headers: {
            ...corsHeaders,
            "content-type": "text/calendar; charset=utf-8",
            "cache-control": "no-store, max-age=0",
            "x-from-cache": fromCache ? "true" : "false",
          },
        });
      } catch (err: unknown) {
        return new Response(
          JSON.stringify({
            error: String(err),
            errorType: (err as Error).constructor.name,
            timestamp: new Date().toISOString(),
          }, null, 2),
          { status: 502, headers: { "content-type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Route 2: flyer image proxy
    if (url.pathname === "/image") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response("Missing image id", { status: 400, headers: corsHeaders });
      }

      try {
        const { response, fromCache } = await getOrFetchImage(id, cache, env as Env);
        // Add CORS headers to the image response
        const headers = new Headers(response.headers);
        headers.set("x-from-cache", fromCache ? "true" : "false");
        for (const [key, value] of Object.entries(corsHeaders)) {
          headers.set(key, value);
        }
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch (err: unknown) {
        return new Response(
          JSON.stringify({
            error: String(err),
            errorType: (err as Error).constructor.name,
            timestamp: new Date().toISOString(),
          }, null, 2),
          { status: 502, headers: { "content-type": "application/json", ...corsHeaders } }
        );
      }
    }
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};