import BuilderForm from "@/components/BuilderForm";
import SchemaBadge from "@/components/SchemaBadge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">SchemaPage</h1>
            <p className="text-sm text-gray-600">Make your business readable by humans and AI agents.</p>
          </div>
          <SchemaBadge />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Create Your AI-Agent Readable Page</h2>
            <p className="text-gray-600">
              Fill in the details below. We'll generate a beautiful landing page
              with structured Schema.org markup that AI agents can read and
              understand.
            </p>
          </div>

          <BuilderForm />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
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
