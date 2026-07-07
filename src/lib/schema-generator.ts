import { PageData, SchemaMarkup } from "./types";

export function generateSchemaMarkup(page: PageData): SchemaMarkup {
  const faqs = Array.isArray(page.metadata?.faqs) ? page.metadata?.faqs || [] : [];

  const ldJson: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: page.business_name,
    description: page.tagline || page.description || "",
    url: page.website_url || `https://schemapage.io/${page.slug}`,
    email: page.contact_email || undefined,
    telephone: page.contact_phone || undefined,
    address: page.location_address
      ? {
          "@type": "PostalAddress",
          streetAddress: page.location_address,
        }
      : undefined,
    priceRange: "$$",
    openingHoursSpecification: [],
    sameAs: page.social_links
      ? Object.values(page.social_links).filter(Boolean)
      : undefined,
    hasPart:
      page.is_pro && faqs.length > 0
        ? {
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }
        : undefined,
  };

  if (page.services && page.services.length > 0) {
    ldJson["hasOfferCatalog"] = {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: page.services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description || "",
          price: s.price || "",
          priceCurrency: "USD",
        },
      })),
    };
  }

  const markdown = generateMarkdown(page);
  const plainText = generatePlainText(page);

  return { ldJson, markdown, plainText };
}

function generateMarkdown(page: PageData): string {
  const lines = [
    `# ${page.business_name}`,
    "",
    page.tagline || "",
    "",
    page.description || "",
    "",
    "## Services",
    ...(page.services || []).map(
      (s) => `- ${s.name}${s.price ? ` (${s.price})` : ""}${s.description ? `: ${s.description}` : ""}`
    ),
    "",
    "## Contact",
    page.contact_email ? `- Email: ${page.contact_email}` : "",
    page.contact_phone ? `- Phone: ${page.contact_phone}` : "",
    page.website_url ? `- Website: ${page.website_url}` : "",
    page.location_address ? `- Address: ${page.location_address}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

function generatePlainText(page: PageData): string {
  return generateMarkdown(page).replace(/[#*_\`]/g, "").trim();
}
