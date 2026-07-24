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
      <body className="antialiased min-h-screen">
        {children}
        <LegalFooter />
      </body>
    </html>
  );
}
