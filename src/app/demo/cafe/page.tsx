import { Metadata } from "next";
import DemoWrapper from "@/components/DemoWrapper";
import { PageData } from "@/lib/types";

const siteUrl = process.env.SITE_URL || "https://schemapage.io";

const page: PageData = {
  slug: "gold-coast-coffee",
  business_name: "Gold Coast Coffee House",
  tagline: "Best flat white in Broadbeach",
  description:
    "Specialty coffee roaster and cafe. Fresh batch brews daily, house-made pastries.",
  services: [
    { name: "Flat White", price: "$5.50" },
    { name: "Avocado Toast", price: "$16.90" },
    { name: "Bag of Beans (250g)", price: "$18.00" },
  ],
  contact_email: "hello@goldcoastcoffee.com.au",
  contact_phone: "0400 333 444",
  website_url: "https://goldcoastcoffee.com.au",
  brand_color: "#6b4226",
  brand_colour: "#6b4226",
  location_address: "3 Oracle Boulevard, Broadbeach QLD 4218",
  is_pro: false,
};

export const metadata: Metadata = {
  title: `${page.business_name} — SchemaPage`,
  description: page.tagline || page.description,
  openGraph: {
    title: `${page.business_name} — SchemaPage`,
    description: page.tagline || page.description,
    url: `${siteUrl}/demo/cafe`,
    type: "website",
  },
};

export default function CafeDemoPage() {
  return <DemoWrapper page={page} />;
}
