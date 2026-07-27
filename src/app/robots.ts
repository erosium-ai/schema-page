import { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL || "https://credentialsai.com.au";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/build/", "/api/", "/auth/"],
      },
      {
        // Block AI crawlers from the builder/dashboard paths but let them crawl public profiles
        userAgent: "GPTBot",
        allow: "/b/",
        disallow: ["/dashboard/", "/build/", "/api/", "/auth/", "/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/b/",
        disallow: ["/dashboard/", "/build/", "/api/", "/auth/", "/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/b/",
        disallow: ["/dashboard/", "/build/", "/api/", "/auth/", "/"],
      },
      {
        userAgent: "Applebot",
        allow: "/b/",
        disallow: ["/dashboard/", "/build/", "/api/", "/auth/", "/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/b/",
        disallow: ["/dashboard/", "/build/", "/api/", "/auth/", "/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
