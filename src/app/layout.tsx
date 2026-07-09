import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchemaPage — Credentials AI Profile Builder",
  description: "Create an AI-readable business profile and upgrade it into a verified lead engine with tracked enquiries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
