import { NextRequest, NextResponse } from "next/server";
import https from "https";
import http from "http";

export async function GET(req: NextRequest) {
  const mediaUrl = req.nextUrl.searchParams.get("url");

  if (!mediaUrl) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  return new Promise<NextResponse>((resolve) => {
    const parsedUrl = new URL(mediaUrl);
    const client = parsedUrl.protocol === "https:" ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://mixkit.co/",
        "Origin": "https://mixkit.co",
      },
    };

    const proxyReq = client.request(options, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirects if any
        return resolve(
          NextResponse.redirect(
            new URL(`/api/video-proxy?url=${encodeURIComponent(res.headers.location)}`, req.url)
          )
        );
      }

      if (res.statusCode !== 200 && res.statusCode !== 206) {
        return resolve(
          new NextResponse(`Proxy fetch failed with status: ${res.statusCode}`, {
            status: res.statusCode || 500,
          })
        );
      }

      // Convert Node stream to Web ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          res.on("data", (chunk) => controller.enqueue(chunk));
          res.on("end", () => controller.close());
          res.on("error", (err) => controller.error(err));
        },
      });

      const responseHeaders = new Headers();
      responseHeaders.set("Content-Type", res.headers["content-type"] || "video/mp4");
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");
      responseHeaders.set("Accept-Ranges", "bytes");

      if (res.headers["content-length"]) {
        responseHeaders.set("Content-Length", res.headers["content-length"]);
      }

      resolve(
        new NextResponse(stream, {
          status: 200,
          headers: responseHeaders,
        })
      );
    });

    proxyReq.on("error", (err) => {
      console.error("Proxy connection error:", err);
      resolve(new NextResponse("Internal Proxy Error", { status: 500 }));
    });

    proxyReq.end();
  });
}