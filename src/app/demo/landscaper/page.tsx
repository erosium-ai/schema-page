import { Metadata } from "next";
import DemoWrapper from "@/components/DemoWrapper";
import { PageData } from "@/lib/types";

const siteUrl = process.env.SITE_URL || "https://schemapage.io";

const page: PageData = {
  slug: "green-edge",
  business_name: "Green Edge Landscaping",
  tagline: "Gardens that grow your home's value",
  description:
    "Design, build, and maintain. Native gardens, retaining walls, irrigation systems.",
  services: [
    { name: "Garden Design", price: "From $550" },
    { name: "Retaining Walls", price: "From $2,200" },
    { name: "Monthly Maintenance", price: "$149/visit" },
  ],
  contact_email: "ben@greenedge.com.au",
  contact_phone: "0400 999 000",
  website_url: "https://greenedge.com.au",
  brand_color: "#15803d",
  brand_colour: "#15803d",
  location_address: "132 Currumbin Creek Rd, Currumbin QLD 4223",
  is_pro: false,
};

export const metadata: Metadata = {
  title: `${page.business_name} — SchemaPage`,
  description: page.tagline || page.description,
  openGraph: {
    title: `${page.business_name} — SchemaPage`,
    description: page.tagline || page.description,
    url: `${siteUrl}/demo/landscaper`,
    type: "website",
  },
};

export default function LandscaperDemoPage() {
  return <DemoWrapper page={page} />;
}
