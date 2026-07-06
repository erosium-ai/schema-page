import { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL || "https://schemapage.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/terms`, lastModified: new Date() },
    { url: `${siteUrl}/privacy`, lastModified: new Date() },
    { url: `${siteUrl}/demo/plumber`, lastModified: new Date() },
    { url: `${siteUrl}/demo/cafe`, lastModified: new Date() },
    { url: `${siteUrl}/demo/bookkeeper`, lastModified: new Date() },
    { url: `${siteUrl}/demo/cleaner`, lastModified: new Date() },
    { url: `${siteUrl}/demo/landscaper`, lastModified: new Date() },
  ];
}
