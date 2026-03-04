const ICS_URL =
  "https://calendar.google.com/calendar/ical/798c1d6ca774c27ec67cf778290768bfda49f4cb7f9340446a18cb795d795e64%40group.calendar.google.com/public/basic.ics";

const CACHE_KEY_ICS_URL = "https://cache.crashpunkband.com/calendar/basic.ics";
const CACHE_KEY_IMAGE_BASE_URL = "https://cache.crashpunkband.com/image/";
const CACHE_DURATION_SECONDS = 30 * 60; // 30 minutes

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,HEAD,OPTIONS",
  "access-control-allow-headers": "content-type,x-cache-clear-token",
  "access-control-max-age": "86400",
};

function driveViewUrlFromId(id: string): string {
  return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`;
}

async function getOrFetchICS(cache: Cache): Promise<{ body: string; fromCache: boolean }> {
  // Try cache first
  const cacheKey = new Request(CACHE_KEY_ICS_URL, { method: "GET" });

  const cached = await cache.match(cacheKey);
  if (cached) {
    return { body: await cached.text(), fromCache: true };
  }

  // Fetch fresh
  const upstream = await fetch(ICS_URL, {
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

  if (!upstream.ok) {
    // if 429 or other transient, serve stale if available
    // Note: this code path is unreachable because cached is already checked above
    if (upstream.status === 429 && cached) {
      const staleText = await (cached as Response).text();
      // This should return the object format, not Response
      return { body: staleText, fromCache: true };
    }
    const bodyText = await upstream.text().catch(() => "<no body>");
    throw new Error(
      `Upstream ${upstream.status}: ${bodyText.slice(0, 200)}`
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

  return { body, fromCache: false };
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // Open Cache API
    const cache = (caches as any).default as Cache;

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
    if (url.pathname === "/" || url.pathname === "/ical") {
      try {
        const { body, fromCache } = await getOrFetchICS(cache);

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

      // unique cache key per image id
      const imageCacheKey = new Request(
        `${CACHE_KEY_IMAGE_BASE_URL}${encodeURIComponent(id)}`,
        { method: "GET" }
      );

      // try image cache first
      const cachedImage = await cache.match(imageCacheKey);
      if (cachedImage) {
        if (method === "HEAD") {
          return new Response(null, {
            status: 200,
            headers: {
              ...corsHeaders,
              "content-type": cachedImage.headers.get("content-type") || "image/jpeg",
              "cache-control": "no-store, max-age=0",
              "x-from-cache": "true",
            },
          });
        }

        return new Response(cachedImage.body, {
          status: 200,
          headers: {
            ...corsHeaders,
            "content-type": cachedImage.headers.get("content-type") || "image/jpeg",
            "cache-control": "no-store, max-age=0",
            "x-from-cache": "true",
          },
        });
      }

      try {
        const upstream = await fetch(driveViewUrlFromId(id), {
          method: "GET", // always GET so we can cache the body
          redirect: "follow",
          cf: { cacheEverything: false, cacheTtl: 0 },
        } as RequestInit);

        if (!upstream.ok) {
          return new Response("Image upstream error", { status: 502, headers: corsHeaders });
        }

        const contentType = upstream.headers.get("content-type") || "image/jpeg";

        // cache image response
        const cacheResponse = new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": contentType,
            "cache-control": `public, max-age=${CACHE_DURATION_SECONDS}`,
          },
        });

        await cache.put(imageCacheKey, cacheResponse.clone());

        if (method === "HEAD") {
          return new Response(null, {
            status: 200,
            headers: {
              ...corsHeaders,
              "content-type": contentType,
              "cache-control": "no-store, max-age=0",
              "x-from-cache": "false",
            },
          });
        }

        return new Response(cacheResponse.body, {
          status: 200,
          headers: {
            ...corsHeaders,
            "content-type": contentType,
            "cache-control": "no-store, max-age=0",
            "x-from-cache": "false",
          },
        });
      } catch (err: unknown) {
        return new Response(
          JSON.stringify({ error: String(err) }, null, 2),
          { status: 502, headers: { "content-type": "application/json", ...corsHeaders } }
        );
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};