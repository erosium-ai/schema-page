import { Metadata } from "next";
import DemoWrapper from "@/components/DemoWrapper";
import { PageData } from "@/lib/types";

const siteUrl = process.env.SITE_URL || "https://schemapage.io";

const page: PageData = {
  slug: "bright-bookkeeping",
  business_name: "Bright Bookkeeping",
  tagline: "Your books, sorted.",
  description:
    "BAS Agent and Xero-certified bookkeeper. Sole traders, tradies, and small businesses.",
  services: [
    { name: "Quarterly BAS", price: "From $220" },
    { name: "Monthly Bookkeeping", price: "From $350" },
    { name: "Payroll (up to 5 staff)", price: "$180/mth" },
  ],
  contact_email: "tash@brightbookkeeping.com.au",
  contact_phone: "0400 555 666",
  website_url: "https://brightbookkeeping.com.au",
  brand_color: "#2563eb",
  brand_colour: "#2563eb",
  location_address: "Suite 4, 45 Nerang St, Southport QLD 4215",
  is_pro: false,
};

export const metadata: Metadata = {
  title: `${page.business_name} — SchemaPage`,
  description: page.tagline || page.description,
  openGraph: {
    title: `${page.business_name} — SchemaPage`,
    description: page.tagline || page.description,
    url: `${siteUrl}/demo/bookkeeper`,
    type: "website",
  },
};

export default function BookkeeperDemoPage() {
  return <DemoWrapper page={page} />;
}
