import { Metadata } from "next";
import DemoWrapper from "@/components/DemoWrapper";
import { PageData } from "@/lib/types";

const siteUrl = process.env.SITE_URL || "https://schemapage.io";

const page: PageData = {
  slug: "joes-plumbing",
  business_name: "Joe's Plumbing",
  tagline: "Blocked drains fixed today",
  description:
    "Gold Coast family plumber with 15 years experience. No call-out fee, same-day service.",
  services: [
    { name: "Blocked drain clearing", price: "From $150" },
    { name: "Hot water replacement", price: "From $800" },
    { name: "Leaking tap repair", price: "From $90" },
  ],
  contact_email: "joe@joesplumbing.com.au",
  contact_phone: "0400 111 222",
  website_url: "https://joesplumbing.com.au",
  brand_color: "#e85d04",
  brand_colour: "#e85d04",
  location_address: "12 Commerce Drive, Ashmore QLD 4214",
  is_pro: true,
};

export const metadata: Metadata = {
  title: `${page.business_name} — SchemaPage`,
  description: page.tagline || page.description,
  openGraph: {
    title: `${page.business_name} — SchemaPage`,
    description: page.tagline || page.description,
    url: `${siteUrl}/demo/plumber`,
    type: "website",
  },
};

export default function PlumberDemoPage() {
  return <DemoWrapper page={page} />;
}
