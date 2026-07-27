import BuilderForm from "@/components/BuilderForm";
import BuilderFormIntent from "@/components/BuilderFormIntent";
import SchemaBadge from "@/components/SchemaBadge";
import HeroSection from "@/components/HeroSection";
import BuilderIntro from "@/components/BuilderIntro";
import { ArrowRight, Search, Shield } from "lucide-react";
import { Suspense } from "react";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
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
