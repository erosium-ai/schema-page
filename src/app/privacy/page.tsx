import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SchemaPage",
  description: "SchemaPage privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-3xl mx-auto px-4 bg-white rounded-2xl shadow-sm border p-8 md:p-12 prose prose-sm md:prose-base">
        <h1>Privacy Policy</h1>
        <p className="text-gray-500">Last updated: 6 July 2026</p>

        <h2>Information We Collect</h2>
        <p>
          We collect the information you provide when creating a page, including
          your email address, business name, tagline, description, services,
          contact details, and location.
        </p>

        <h2>How We Use Data</h2>
        <p>
          We use your data to generate and host your SchemaPage listing, provide
          customer support, process payments, and send occasional service-related
          updates.
        </p>

        <h2>Data Storage</h2>
        <p>
          Data is stored in Supabase, hosted in the Australia region. We take
          reasonable measures to protect your data from unauthorised access or
          disclosure.
        </p>

        <h2>Cookies</h2>
        <p>
          SchemaPage does not use tracking cookies. Essential cookies may be
          used by our hosting provider for analytics and service reliability.
        </p>

        <h2>Third Party Services</h2>
        <p>
          We use Stripe to process payments and Supabase to store data. These
          providers have their own privacy policies and security practices.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data by contacting us. We will respond within a reasonable timeframe.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions, email{" "}
          <a href="mailto:support@schemapage.io">support@schemapage.io</a>.
        </p>
      </article>
    </div>
  );
}
