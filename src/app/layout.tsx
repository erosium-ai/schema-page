import type { Metadata } from "next";
import { LegalFooter } from "@/components/LegalFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Credentials AI | AI-Readable Websites & Verified ABN Badges",
    template: "%s | Credentials AI",
  },
  description:
    "Get your small business found on ChatGPT, Siri, and Google AI Overviews. Free AI business cards, automated ABN verification, and simple lead tracking dashboards built for Australian local businesses.",
  keywords: [
    "AI readable website",
    "ABN verified badge",
    "ChatGPT local business SEO",
    "small business lead tracker Australia",
    "voice search optimization",
  ],
  alternates: {
    canonical: "https://credentialsai.com.au",
  },
  openGraph: {
    title: "Credentials AI | Get Your Business Seen by AI Assistants",
    description:
      "Stop being invisible to AI search layers. Convert offline marketing with included QR codes and track live phone or quote enquiries.",
    url: "https://credentialsai.com.au",
    siteName: "Credentials AI",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://credentialsai.com.au/og-image.png",
        width: 1200,
        height: 630,
        alt: "Credentials AI — AI-Ready Business Profiles with ABN Verification, Enquiry Tracking, and QR Codes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Credentials AI | AI-Ready Small Business Profiles",
    description:
      "Verify your business ABN automatically and step into the new AI search layer.",
    images: ["https://credentialsai.com.au/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Tells Google & AI crawlers content is fresh — Perplexity heavily weights <3mo content
  other: {
    "dc.date.modified": "2026-07-28",
    "last-modified": "2026-07-28",
    "revised": "2026-07-28",
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
