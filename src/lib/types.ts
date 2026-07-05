export interface ServiceItem {
  name: string;
  price?: string;
  description?: string;
}

export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface PageData {
  id?: string;
  slug: string;
  business_name: string;
  tagline?: string;
  description?: string;
  services?: ServiceItem[];
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  location_address?: string;
  social_links?: SocialLinks;
  brand_color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SchemaMarkup {
  ldJson: Record<string, unknown>;
  markdown: string;
  plainText: string;
}
