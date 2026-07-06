import { Metadata } from "next";
import DemoWrapper from "@/components/DemoWrapper";
import { PageData } from "@/lib/types";

const siteUrl = process.env.SITE_URL || "https://schemapage.io";

const page: PageData = {
  slug: "coastal-clean",
  business_name: "Coastal Clean Co",
  tagline: "Bond-back guaranteed",
  description:
    "End of lease, office, and Airbnb cleaning on the Gold Coast. Eco-friendly products, 5-star rated.",
  services: [
    { name: "End of Lease Clean", price: "From $399" },
    { name: "Fortnightly Home Clean", price: "$129/visit" },
    { name: "Airbnb Turnover", price: "From $89" },
  ],
  contact_email: "book@coastalclean.au",
  contact_phone: "0400 777 888",
  website_url: "https://coastalclean.au",
  brand_color: "#10b981",
  brand_colour: "#10b981",
  location_address: "78 Scarborough St, Southport QLD 4215",
  is_pro: false,
};

export const metadata: Metadata = {
  title: `${page.business_name} — SchemaPage`,
  description: page.tagline || page.description,
  openGraph: {
    title: `${page.business_name} — SchemaPage`,
    description: page.tagline || page.description,
    url: `${siteUrl}/demo/cleaner`,
    type: "website",
  },
};

export default function CleanerDemoPage() {
  return <DemoWrapper page={page} />;
}
