/** Formatting helpers shared across screens. Shopify REST/GraphQL return prices as strings. */

export const formatPrice = (value: string | number | null | undefined): string => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  const rounded = Number.isInteger(amount) ? amount : Math.round(amount * 100) / 100;
  return `₹${rounded}`;
};

export const discountPercent = (
  price: string | number | null | undefined,
  compareAt: string | number | null | undefined,
): number | null => {
  const current = Number(price);
  const original = Number(compareAt);
  if (!Number.isFinite(current) || !Number.isFinite(original) || original <= current) {
    return null;
  }
  return Math.round(((original - current) / original) * 100);
};

/** Strips tags/entities from Shopify `body_html` for plain-text rendering. */
export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const titleCase = (value: string): string =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
