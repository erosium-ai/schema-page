import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SchemaPage",
  description: "SchemaPage terms of service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-3xl mx-auto px-4 bg-white rounded-2xl shadow-sm border p-8 md:p-12 prose prose-sm md:prose-base">
        <h1>Terms of Service</h1>
        <p className="text-gray-500">Last updated: 6 July 2026</p>

        <h2>1. Acceptance</h2>
        <p>
          By accessing or using SchemaPage, you agree to be bound by these Terms
          of Service. If you do not agree, please do not use our service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          SchemaPage creates AI-readable business listing pages with structured
          Schema.org markup. Pages include business details, services, contact
          information, and machine-readable exports.
        </p>

        <h2>3. User Responsibilities</h2>
        <p>
          You are responsible for the accuracy of the information you submit.
          You may not use SchemaPage for unlawful, fraudulent, or abusive
          purposes. You must have the right to publish any content you upload.
        </p>

        <h2>4. Payments & Refunds</h2>
        <p>
          Pro upgrades are processed securely via Stripe. All purchases are
          covered by a 30-day money-back guarantee. To request a refund, contact
          us using the details below.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          SchemaPage is provided “as is” without warranties of any kind. We are
          not liable for any direct, indirect, incidental, or consequential
          damages arising from your use of the service.
        </p>

        <h2>6. Termination</h2>
        <p>
          We may suspend or terminate your access at any time for violations of
          these terms or for any other reason at our discretion.
        </p>

        <h2>7. Contact</h2>
        <p>
          Questions about these terms? Email us at{" "}
          <a href="mailto:support@erosium.ai">support@erosium.ai</a>.
        </p>
      </article>
    </div>
  );
}
