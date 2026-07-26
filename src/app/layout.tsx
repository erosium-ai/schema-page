import type { Metadata } from "next";
import { LegalFooter } from "@/components/LegalFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchemaPage — Credentials AI Profile Builder",
  description: "Create an AI-readable business profile and upgrade it into an AI-Ready Business Page with tracked enquiries.",
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
