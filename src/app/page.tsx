import BuilderForm from "@/components/BuilderForm";
import BuilderFormIntent from "@/components/BuilderFormIntent";
import SchemaBadge from "@/components/SchemaBadge";
import { Wrench, Coffee, BookOpen, ArrowRight } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">SchemaPage</h1>
            <p className="text-sm text-gray-600">Create an AI-readable business profile that can grow into a verified lead engine.</p>
          </div>
          <SchemaBadge />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Start your Credentials AI profile</h2>
            <p className="text-gray-600">
              Fill in the details below. We&apos;ll generate a clean business profile with structured Schema.org markup,
              then you can upgrade it into a verified lead engine with tracked calls, quote requests, and proof reporting.
            </p>
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
              Founding 50 offer: Verified Lead Engine for $49 AUD/month, with the normal $149 setup fee waived.
              <span className="block mt-1 font-semibold">Built to help customers find you, trust you, enquire, and let you see what came through.</span>
            </p>
          </div>

          <Suspense fallback={<BuilderForm />}>
            <BuilderFormIntent />
          </Suspense>
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6 text-center">See it in action</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DemoCard
              href="/demo/plumber"
              icon={<Wrench className="h-6 w-6 text-orange-600" />}
              name="Joe's Plumbing"
              tagline="Blocked drains fixed today"
              color="#e85d04"
            />
            <DemoCard
              href="/demo/cafe"
              icon={<Coffee className="h-6 w-6 text-amber-800" />}
              name="Gold Coast Coffee House"
              tagline="Best flat white in Broadbeach"
              color="#6b4226"
            />
            <DemoCard
              href="/demo/bookkeeper"
              icon={<BookOpen className="h-6 w-6 text-blue-600" />}
              name="Bright Bookkeeping"
              tagline="Your books, sorted."
              color="#2563eb"
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
            title="Machine Export"
            description="One-click JSON + Markdown exports for any AI system."
          />
        </div>
      </main>
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
