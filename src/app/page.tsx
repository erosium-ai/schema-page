import BuilderForm from "@/components/BuilderForm";
import BuilderFormIntent from "@/components/BuilderFormIntent";
import SchemaBadge from "@/components/SchemaBadge";
import HeroSection from "@/components/HeroSection";
import BuilderIntro from "@/components/BuilderIntro";
import { ArrowRight, Search, Shield } from "lucide-react";
import { Suspense } from "react";

export const revalidate = 60;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Will an AI-Ready Business Page guarantee me more leads?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No — and be wary of anyone who says it will. What it does is make your business easier to understand, easier to trust, and track enquiries that come through your profile. No one can honestly guarantee leads. We prove what happened."
      }
    },
    {
      "@type": "Question",
      "name": "What does ABN Verified actually mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It means our system automatically checks the business ABN and registered details against the Australian Business Register — the official government database — and publishes what was checked and when. This gives customers confidence the business is real and properly registered."
      }
    },
    {
      "@type": "Question",
      "name": "Can AI assistants like ChatGPT and Siri actually find my business through this?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Your AI-Ready Business Page includes structured data built for ChatGPT, Gemini, Siri, Claude, and Google AI Overviews. When someone asks an AI assistant for a local service, your page is structured so the AI can accurately read your business name, services, location, contact details and verified status."
      }
    },
    {
      "@type": "Question",
      "name": "Is this just another SEO service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. SEO helps with traditional Google rankings. Credentials AI also builds your AI-readable profile — the new search layer where customers ask ChatGPT or Siri direct questions. Every AI-Ready Business Page includes tracked enquiry buttons so you can see what's working."
      }
    }
  ]
};

/** Organization schema — tells Google what Credentials AI is as a company, who founded it, what it offers, and that it's ABN-registered. */
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Credentials AI",
  "alternateName": "Credentials AI by Erosium",
  "description": "Credentials AI builds AI-readable business profiles for Australian local businesses. Every profile includes live ABN verification against the Australian Business Register, structured data for ChatGPT, Gemini, Siri, and Google AI Overviews, and tracked enquiry tools so tradies can see what's working.",
  "url": "https://credentialsai.com.au",
  "email": "hello@erosium.com.au",
  "foundingDate": "2026-06-22",
  "founder": {
    "@type": "Person",
    "name": "Isaac Anasson",
    "jobTitle": "Founder",
    "sameAs": "https://x.com/Ikebuilds"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Beastly Tech GC Pty Ltd",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "Australian Business Number",
      "value": "52699330553"
    }
  },
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "Australian Business Number",
    "value": "52699330553",
    "description": "ABN verified active via Australian Business Register API — Beastly Tech GC Pty Ltd"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Australia"
  },
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Free AI-Ready Business Page",
        "description": "A free AI-readable business profile with ABN verification badge, structured data for AI assistants, QR code, and basic SEO.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "AUD"
        }
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Founding Member Upgrade",
        "description": "Premium business profile with verified lead engine, tracked enquiry dashboard, Pro FAQs, priority support, and analytics.",
        "offers": {
          "@type": "Offer",
          "price": "49",
          "priceCurrency": "AUD",
          "description": "One-time Founding Member payment"
        }
      }
    }
  ],
  "sameAs": [
    "https://x.com/Ikebuilds",
    "https://linkedin.com/company/erosium"
  ]
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* FAQ structured data — enables Google rich snippet expandable Q&A boxes */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Organization structured data — tells Google who we are, our ABN, founder, and what we sell */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* === SOLO OPERATOR HERO — intent-aware (free vs paid) === */}
      <HeroSection />

      {/* === BUILDER SECTION === */}
      <div id="builder">
        <header className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Credentials AI Profile Builder</h1>
              <p className="text-sm text-gray-600">Create an AI-readable business profile that can grow into an AI-Ready Business Page.</p>
            </div>
            <SchemaBadge />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <Suspense
              fallback={
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-2">Start your free AI Business Card</h2>
                </div>
              }
            >
              <BuilderIntro />
            </Suspense>

            <Suspense fallback={<BuilderForm />}>
              <BuilderFormIntent />
            </Suspense>
          </div>

          <section className="mt-16">
            <h2 className="text-xl font-bold mb-2 text-center">See it in action</h2>
            <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-gray-600">
              View the current Credentials AI profile style — not the old plain demo pages.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DemoCard
                href="https://credentialsai.com.au/b/sample-plumbing-co"
                icon={<Shield className="h-6 w-6 text-emerald-600" />}
                name="AI-Ready Business Page"
                tagline="Premium profile with TrustBadge, enquiry form and lead proof panels"
                color="#10b981"
              />
              <DemoCard
                href="https://credentialsai.com.au/b/sample-free-card"
                icon={<Search className="h-6 w-6 text-cyan-600" />}
                name="Free AI Business Card"
                tagline="Clean public starter profile with AI-readable structure"
                color="#06b6d4"
              />
            </div>
          </section>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Human Readable"
              description="Clean, modern landing pages that look great on every device."
            />
            <FeatureCard
              title="AI Friendly"
              description="Built-in Schema.org JSON-LD so agents know exactly what you offer."
            />
            <FeatureCard
              title="QR-ready profile"
              description="Paid profiles include a downloadable QR code for flyers, magnets, invoices and vehicles."
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function DemoCard({
  href,
  icon,
  name,
  tagline,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  name: string;
  tagline: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="group block bg-white rounded-xl border p-6 hover:shadow-md transition"
    >
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-4">{tagline}</p>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:underline">
        View Demo <ArrowRight className="h-4 w-4" />
      </span>
    </a>
  );
}
