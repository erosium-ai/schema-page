import type { Metadata } from "next";
import { LegalFooter } from "@/components/LegalFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Credentials AI | AI-Readable Websites & ABN Business Checks",
    template: "%s | Credentials AI",
  },
  description:
    "Create an AI-readable small business profile with best-effort ABN/business-registration check wording, source/date details, QR-ready profile links, and simple enquiry tracking for Australian local businesses.",
  keywords: [
    "AI readable website",
    "ABN business registration check",
    "ChatGPT local business SEO",
    "small business lead tracker Australia",
    "voice search optimization",
  ],
  alternates: {
    canonical: "https://credentialsai.com.au",
  },
  openGraph: {
    title: "Credentials AI | Make Your Business Easier for AI to Read",
    description:
      "Create an AI-readable profile, connect offline marketing with QR codes, and track phone or quote enquiries.",
    url: "https://credentialsai.com.au",
    siteName: "Credentials AI",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://credentialsai.com.au/og-image.png",
        width: 1200,
        height: 630,
        alt: "Credentials AI — AI-Ready Business Profiles with ABN Check Wording, Enquiry Tracking, and QR Codes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Credentials AI | AI-Ready Small Business Profiles",
    description:
      "Show best-effort ABN/business-registration check wording with source and date.",
    images: ["https://credentialsai.com.au/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Tells Google & AI crawlers content is fresh — Perplexity heavily weights <3mo content
  other: {
    "dc.date.modified": "2026-07-29",
    "last-modified": "2026-07-29",
    "revised": "2026-07-29",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://plausible.io/js/pa-zAPjMspHIa_4gs877_g6N.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
        <LegalFooter />
      </body>
    </html>
  );
}
